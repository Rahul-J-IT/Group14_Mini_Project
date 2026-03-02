// lightweight wrapper around fetch for calling the NestJS backend
// backend uses global prefix `/api` (see server/src/main.ts)

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ""; // typically empty during dev (proxied)

interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

function buildQuery(params: QueryParams) {
  const esc = encodeURIComponent;
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${esc(k)}=${esc(String(v))}`)
    .join("&");
  return query ? `?${query}` : "";
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }
  return res.json();
}

// --- types ------------------------------------------------------------------
export type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface CourseModule {
  title: string;
  lessons: string[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructor_bio?: string;
  instructor_avatar?: string;
  thumbnail_url: string;
  price: number;
  average_rating: number;
  total_enrollments: number;
  level: CourseLevel;
  estimated_duration_minutes: number;
  short_description: string;
  description?: string;
  language: string;
  category: string;
  is_featured?: boolean;
  progress?: number;
  last_watched?: string;
  what_you_learn?: string[];
  requirements?: string[];
  curriculum?: CourseModule[];
  tags?: string[];
}

export interface CoursesResponse {
  data: Course[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

// --- helpers ---------------------------------------------------------------
export const api = {
  getCourses: (query: QueryParams = {}) =>
    request<CoursesResponse>(`/api/courses${buildQuery(query)}`),

  getCourse: (id: string) => request<Course>(`/api/courses/${id}`),

  getSectionCourses: (section: string, limit?: number) =>
    request<Course[]>(`/api/courses/section/${section}${buildQuery({ limit })}`),

  createCourse: (payload: Partial<Course>) =>
    request<Course>(`/api/courses`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateCourse: (id: string, payload: Partial<Course>) =>
    request<Course>(`/api/courses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteCourse: (id: string) =>
    request<{ message: string }>(`/api/courses/${id}`, {
      method: "DELETE",
    }),
};
