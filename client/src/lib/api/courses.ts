// src/lib/api/courses.ts
// All course-related database operations with intelligent caching

import { supabase } from "@/lib/supabase";
import CacheManager from "@/lib/cache";

const COURSES_CACHE_KEY = "courses_all";
const COURSES_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function fetchCourses(useCache = true) {
  // Try cache first
  if (useCache) {
    const cached = await CacheManager.get(COURSES_CACHE_KEY, COURSES_CACHE_TTL);
    if (cached) {
      console.log("[Courses] From cache - instant load!");
      return cached;
    }
  }

  console.log("[Courses] Fetching from database...");
  const startTime = performance.now();

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: true });
  console.log("[Courses] Supabase response:", data, error);

  if (error) throw error;

  const result = data ?? [];
  const duration = performance.now() - startTime;

  console.log(
    `[Courses] Fetched ${result.length} courses in ${duration.toFixed(0)}ms`,
  );

  // Cache the result
  await CacheManager.set(COURSES_CACHE_KEY, result, COURSES_CACHE_TTL);

  return result;
}

export async function fetchCourseById(courseId: string) {
  const cacheKey = `course_${courseId}`;

  // Try cache first
  const cached = await CacheManager.get(cacheKey, 10 * 60 * 1000);
  if (cached) {
    console.log(`[Course] ${courseId} from cache - instant load!`);
    return cached;
  }

  console.log(`[Course] Fetching ${courseId} from database...`);
  const { data, error } = await supabase
    .from("courses")
    .select("*, materials(*)")
    .eq("id", courseId)
    .single();

  if (error) throw error;

  // Cache the result
  await CacheManager.set(cacheKey, data, 10 * 60 * 1000);

  return data;
}

export async function fetchMaterialById(materialId: string) {
  const cacheKey = `material_${materialId}`;

  const cached = await CacheManager.get(cacheKey, 10 * 60 * 1000);
  if (cached) {
    return cached;
  }

  const { data, error } = await supabase
    .from("materials")
    .select("*, courses(*)")
    .eq("id", materialId)
    .single();

  if (error) throw error;

  await CacheManager.set(cacheKey, data, 10 * 60 * 1000);

  return data;
}

// Invalidate courses cache when needed
export async function invalidateCoursesCache() {
  await CacheManager.clear("course_");
  console.log("[Courses] Cache invalidated");
}
