import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Star, Users, Search, PlayCircle, Code, Filter, Loader2 } from "lucide-react";
import { useCourses } from "@/hooks/useSupabaseQuery";

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  format: string;
  thumbnail: string;
  instructor: string;
  rating: number;
  duration_minutes: number;
  enrolled_count: number;
}

const CATEGORIES = ["All", "Frontend", "Backend", "Languages", "Styling"];

const difficultyConfig: Record<string, { label: string; class: string }> = {
  beginner: { label: "Beginner", class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  intermediate: { label: "Intermediate", class: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  advanced: { label: "Advanced", class: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
};

const formatIcons: Record<string, typeof PlayCircle> = {
  video: PlayCircle,
  interactive: Code,
  article: Code,
};

export default function Courses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { data: courses = [], isLoading } = useCourses();

  const filtered = (courses as Course[]).filter((c) => {
    // 1. Fallback to empty strings so .toLowerCase() never crashes on missing data
    const safeTitle = c?.title || "";
    const safeDescription = c?.description || "";

    // 2. Safely perform the search match
    const matchSearch =
      safeTitle.toLowerCase().includes(search.toLowerCase()) ||
      safeDescription.toLowerCase().includes(search.toLowerCase());

    // 3. Safely check the category
    const matchCat = category === "All" || c?.category === category;

    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-8 pb-6">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold font-display">Courses</h1>
        <p className="text-muted-foreground">Browse our library of AI-curated learning materials</p>
      </div>

      <div className="glass rounded-2xl border border-border/60 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses, topics..."
              className="pl-10 h-10 bg-secondary/50 border-border/60 focus:border-primary/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={category === cat ? "default" : "outline"}
                onClick={() => setCategory(cat)}
                className={category === cat
                  ? "gradient-primary border-0 text-white glow-sm h-8 text-xs"
                  : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border h-8 text-xs"
                }
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Showing <span className="text-foreground font-medium">{filtered.length}</span> courses
            {category !== "All" && <> in <span className="text-primary font-medium">{category}</span></>}
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course: Course) => {
              const diff = difficultyConfig[course.difficulty];
              const FormatIcon = formatIcons[course.format] || PlayCircle;
              return (
                <Link key={course.id} to={`/courses/${course.id}`} className="group block">
                  <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden card-hover h-full flex flex-col">
                    <div className="relative h-40 overflow-hidden bg-secondary">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${diff.class}`}>
                          {diff.label}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white">
                          <FormatIcon className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1 space-y-3">
                      <div>
                        <Badge variant="secondary" className="text-xs mb-2 bg-secondary/80">
                          {course.category}
                        </Badge>
                        <h3 className="text-base font-bold font-display group-hover:text-primary transition-colors leading-tight">
                          {course.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      <div className="mt-auto pt-3 border-t border-border/40">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">by <span className="text-foreground/80 font-medium">{course.instructor}</span></p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />{course.rating}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />{course.enrolled_count?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filtered.length === 0 && !isLoading && (
            <div className="text-center py-20 space-y-3">
              <div className="text-5xl">🔍</div>
              <h3 className="text-xl font-bold font-display">No courses found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter</p>
              <Button variant="outline" onClick={() => { setSearch(""); setCategory("All"); }}>
                Clear filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}