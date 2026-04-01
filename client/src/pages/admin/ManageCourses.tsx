import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCourses } from "@/hooks/useSupabaseQuery";

export default function ManageCourses() {
  const { data: courses = [], isLoading } = useCourses();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">Manage Courses</h1>
          <p className="text-muted-foreground">View and manage all courses</p>
        </div>
        <Button asChild>
          <Link to="/admin/upload-course"><Plus className="mr-2 h-4 w-4" />Add Course</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{course.title}</h3>
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge>{course.difficulty}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {(course.materials ?? []).length} materials · {course.enrolled_count} enrolled
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline"><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
