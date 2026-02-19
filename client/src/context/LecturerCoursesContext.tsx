import { createContext, useContext, useState  } from "react";
import type {ReactNode} from "react";
import type { Course, CourseLevel } from "../data/courses";

// Lecturer's own courses — seeded with 3 dummy ones
const INITIAL_COURSES: Course[] = [
  {
    id: "lec-1",
    title: "Mastering Full Stack Development with React & Node",
    instructor: "Alex Johnson",
    instructor_bio: "Senior full-stack developer with 10+ years of experience.",
    instructor_avatar: "https://picsum.photos/seed/lecav1/80/80",
    thumbnail_url: "https://picsum.photos/seed/lec1/800/450",
    price: 1499,
    average_rating: 4.7,
    total_enrollments: 3240,
    level: "INTERMEDIATE",
    estimated_duration_minutes: 1440,
    short_description: "Build complete full-stack applications with React, Node.js, Express and MongoDB.",
    description: "A comprehensive full-stack course covering the entire development pipeline from designing RESTful APIs to deploying React frontends. Includes 10 real-world projects.",
    language: "English",
    category: "Web Development",
    is_featured: true,
    tags: ["React", "Node.js", "MongoDB", "Full Stack"],
    what_you_learn: [
      "Build REST APIs with Node.js and Express",
      "Create dynamic UIs with React and TypeScript",
      "Design and manage MongoDB databases",
      "Deploy apps to AWS and Vercel",
    ],
    requirements: ["Basic JavaScript knowledge", "HTML & CSS basics"],
    curriculum: [
      { title: "Introduction", lessons: ["Course Overview", "Setting up the environment"] },
      { title: "Backend with Node.js", lessons: ["Express basics", "REST API design", "MongoDB integration"] },
      { title: "Frontend with React", lessons: ["React fundamentals", "State management", "API integration"] },
    ],
  },
  {
    id: "lec-2",
    title: "Advanced TypeScript: Patterns & Best Practices",
    instructor: "Alex Johnson",
    instructor_bio: "Senior full-stack developer with 10+ years of experience.",
    instructor_avatar: "https://picsum.photos/seed/lecav2/80/80",
    thumbnail_url: "https://picsum.photos/seed/lec2/800/450",
    price: 999,
    average_rating: 4.5,
    total_enrollments: 1820,
    level: "ADVANCED",
    estimated_duration_minutes: 960,
    short_description: "Deep dive into TypeScript generics, decorators, utility types and design patterns.",
    description: "Take your TypeScript skills to the next level. This course explores advanced type system features, design patterns, and real-world architecture used in large-scale applications.",
    language: "English",
    category: "Web Development",
    is_featured: false,
    tags: ["TypeScript", "Design Patterns", "Advanced", "OOP"],
    what_you_learn: [
      "Master TypeScript generics and conditional types",
      "Apply advanced design patterns",
      "Build type-safe APIs",
      "Optimize TypeScript performance",
    ],
    requirements: ["TypeScript basics", "JavaScript experience"],
    curriculum: [
      { title: "Type System Deep Dive", lessons: ["Generics", "Conditional types", "Mapped types"] },
      { title: "Design Patterns", lessons: ["SOLID principles", "Factory pattern", "Observer pattern"] },
    ],
  },
  {
    id: "lec-3",
    title: "Docker for Developers: Zero to Production",
    instructor: "Alex Johnson",
    instructor_bio: "Senior full-stack developer with 10+ years of experience.",
    instructor_avatar: "https://picsum.photos/seed/lecav3/80/80",
    thumbnail_url: "https://picsum.photos/seed/lec3/800/450",
    price: 0,
    average_rating: 4.6,
    total_enrollments: 5100,
    level: "BEGINNER",
    estimated_duration_minutes: 720,
    short_description: "Learn Docker from scratch and containerize your applications for production.",
    description: "A beginner-friendly Docker course that takes you from zero knowledge to shipping containerized applications. Includes Docker Compose, networking, volumes, and CI/CD integration.",
    language: "English",
    category: "DevOps",
    is_featured: false,
    tags: ["Docker", "DevOps", "Containers", "CI/CD"],
    what_you_learn: [
      "Understand containers vs virtual machines",
      "Write Dockerfiles for any stack",
      "Use Docker Compose for multi-service apps",
      "Integrate Docker into CI/CD pipelines",
    ],
    requirements: ["Basic command line experience"],
    curriculum: [
      { title: "Docker Basics", lessons: ["What is Docker?", "Images and Containers", "Running your first container"] },
      { title: "Docker Compose", lessons: ["Multi-container apps", "Volumes", "Networking"] },
    ],
  },
];

interface LecturerCoursesContextType {
  courses: Course[];
  addCourse: (course: Omit<Course, "id" | "average_rating" | "total_enrollments">) => void;
  updateCourse: (id: string, updated: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  getCourseById: (id: string) => Course | undefined;
}

const LecturerCoursesContext = createContext<LecturerCoursesContextType | null>(null);

export const LecturerCoursesProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);

  const addCourse = (data: Omit<Course, "id" | "average_rating" | "total_enrollments">) => {
    const newCourse: Course = {
      ...data,
      id: `lec-${Date.now()}`,
      average_rating: 0,
      total_enrollments: 0,
    };
    setCourses((prev) => [newCourse, ...prev]);
  };

  const updateCourse = (id: string, updated: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const getCourseById = (id: string) => courses.find((c) => c.id === id);

  return (
    <LecturerCoursesContext.Provider value={{ courses, addCourse, updateCourse, deleteCourse, getCourseById }}>
      {children}
    </LecturerCoursesContext.Provider>
  );
};

export const useLecturerCourses = (): LecturerCoursesContextType => {
  const ctx = useContext(LecturerCoursesContext);
  if (!ctx) throw new Error("useLecturerCourses must be used within LecturerCoursesProvider");
  return ctx;
};
