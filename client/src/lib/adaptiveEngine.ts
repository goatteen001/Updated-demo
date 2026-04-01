export const prerequisites: Record<string, string[]> = {
  "React State Management": ["JavaScript Variables", "JavaScript Scope"],
  "React Hooks": ["JavaScript Functions", "Closures"],
  "Advanced React": ["React State Management", "React Hooks"]
};

export function getPrerequisites(topic: string) {
  return prerequisites[topic] || [];
}

export function shouldStepBack(score: number) {
  return score < 50;
}