import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function UploadCourse() {
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category || !difficulty) {
      toast.error("Please select a category and difficulty.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    setSaving(true);
    const { error } = await supabase.from("courses").insert({
      title: formData.get("title") as string,
      description: formData.get("desc") as string,
      category,
      difficulty,
      instructor: formData.get("instructor") as string,
      duration_minutes: parseInt(formData.get("duration") as string || "0"),
      enrolled_count: 0,
    });

    setSaving(false);
    if (error) {
      toast.error("Failed to create course: " + error.message);
    } else {
      toast.success("Course created successfully!");
      form.reset();
      setCategory("");
      setDifficulty("");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Upload Course</h1>
        <p className="text-muted-foreground">Create a new course</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input id="title" name="title" placeholder="e.g. React Fundamentals" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" name="desc" placeholder="Course description..." rows={4} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Languages">Languages</SelectItem>
                    <SelectItem value="Styling">Styling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Estimated Duration (minutes)</Label>
              <Input id="duration" name="duration" type="number" placeholder="120" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor Name</Label>
              <Input id="instructor" name="instructor" placeholder="e.g. Jane Smith" required />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create Course"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
