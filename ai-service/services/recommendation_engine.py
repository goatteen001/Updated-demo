from typing import List, Dict, Any
from dataclasses import dataclass
from supabase import Client

@dataclass
class Recommendation:
    course_id: str
    title: str
    reason: str
    priority: str  # 'high' | 'medium' | 'low'

@dataclass
class UserData:
    completed_courses: List[str]
    quiz_scores: List[Dict[str, Any]]
    topics_performance: List[Dict[str, Any]]
    interests: List[str]

class RecommendationEngine:
    def __init__(self, supabase: Client):
        self.supabase = supabase

    def fetch_user_data(self, user_id: str) -> UserData:
        """Fetch user data from Supabase (or use example data)."""
        # Real Supabase queries
        quiz_attempts = self.supabase.table('quiz_attempts').select('*').eq('user_id', user_id).execute()
        progress = self.supabase.table('student_progress').select('*').eq('user_id', user_id).execute()
        
        # Example data for testing (replace with real data processing)
        return UserData(
            completed_courses=['course1', 'course2'],
            quiz_scores=[{'course_id': 'course1', 'score': 85}, {'course_id': 'course3', 'score': 45}],
            topics_performance=[
                {'topic': 'React Hooks', 'score': 55},
                {'topic': 'State Management', 'score': 90},
                {'topic': 'Routing', 'score': 40}
            ],
            interests=[]
        )

    def analyze_performance(self, user_data: UserData) -> Dict[str, List[str]]:
        """Identify weak/strong topics."""
        weak_topics = [t['topic'] for t in user_data.topics_performance if t['score'] < 60]
        strong_topics = [t['topic'] for t in user_data.topics_performance if t['score'] > 80]
        return {'weak_topics': weak_topics, 'strong_topics': strong_topics}

    def get_course_recommendations(self, user_data: UserData, weak_topics: List[str], strong_topics: List[str]) -> List[Recommendation]:
        """Get and rank recommendations."""
        available_courses = [
            {'id': 'course4', 'title': 'Advanced React Hooks', 'topics': ['React Hooks']},
            {'id': 'course5', 'title': 'React Router v6', 'topics': ['Routing']},
            {'id': 'course6', 'title': 'Advanced State Patterns', 'topics': ['State Management']},
            {'id': 'course7', 'title': 'Next.js Fundamentals', 'topics': ['React Hooks', 'Routing']}
        ]
        
        recs = []
        for course in available_courses:
            if course['id'] in user_data.completed_courses:
                continue
                
            score = 0
            reason_parts = []
            
            # High priority: weak topics
            weak_matches = [t for t in course['topics'] if t in weak_topics]
            if weak_matches:
                score += 3
                reason_parts.append(f"covers weak topics: {', '.join(weak_matches)}")
            
            # Medium: interests
            interest_matches = [t for t in course['topics'] if t in user_data.interests]
            if interest_matches:
                score += 2
                reason_parts.append(f"matches interests: {', '.join(interest_matches)}")
            
            # Low: general progression
            score += 1
            
            if score > 0:
                priority = 'high' if score >= 3 else 'medium' if score >= 2 else 'low'
                recs.append(Recommendation(
                    course_id=course['id'],
                    title=course['title'],
                    reason='; '.join(reason_parts),
                    priority=priority
                ))
        
        # Sort by priority/score
        priority_order = {'high': 3, 'medium': 2, 'low': 1}
        recs.sort(key=lambda r: priority_order[r.priority], reverse=True)
        
        return recs

    def get_recommendations(self, user_id: str, interests: List[str] = []) -> Dict[str, Any]:
        """Main entry point - ML replaceable."""
        try:
            user_data = self.fetch_user_data(user_id)
            user_data.interests = interests  # Override for request
            
            analysis = self.analyze_performance(user_data)
            recs = self.get_course_recommendations(user_data, analysis['weak_topics'], analysis['strong_topics'])
            
            return {
                'recommended_courses': [r.__dict__ for r in recs],
                'weak_topics': analysis['weak_topics'],
                'strong_topics': analysis['strong_topics']
            }
        except Exception as e:
            # Edge case: new user, no data
            return {
                'recommended_courses': [{'course_id': 'intro-js', 'title': 'Intro to JavaScript', 'reason': 'New user - start fundamentals', 'priority': 'medium'}],
                'weak_topics': [],
                'strong_topics': [],
                'message': 'Welcome! Starting recommendations.'
            }
