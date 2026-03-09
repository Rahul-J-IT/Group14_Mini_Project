import { Sparkles } from "lucide-react";
import CourseSection from "../components/CourseSection";
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import type { Course } from "../data/courses";
import {
  recommendedCourses as hardcodedRecommended,
  exploreCourses as hardcodedExplore,
  trendingCourses as hardcodedTrending,
} from "../data/courses";

// Helper to map backend course to frontend Course interface
const mapCourse = (backendCourse: any): Course => {
  return {
    id: String(backendCourse.id),
    title: backendCourse.title,
    instructor: backendCourse.instructor?.name || "Unknown Instructor",
    instructor_bio: backendCourse.instructor?.bio,
    instructor_avatar: backendCourse.instructor?.avatar,
    thumbnail_url: backendCourse.thumbnailUrl || "https://picsum.photos/seed/default/800/450",
    price: parseFloat(backendCourse.price),
    average_rating: 4.5, // Mocked for now, depending on if reviews are added
    total_enrollments: backendCourse.enrollments?.length || 0,
    level: backendCourse.level || "BEGINNER",
    estimated_duration_minutes: backendCourse.duration || 600,
    short_description: backendCourse.description?.substring(0, 100) + "...",
    description: backendCourse.description,
    language: backendCourse.language || "English",
    category: backendCourse.category?.name || "General",
    progress: backendCourse.enrollmentProgress, // Only for enrolled courses
  };
};

const WelcomeBanner: React.FC<{ name?: string; count?: number }> = ({ name = "Student", count = 0 }) => (
  <div className="relative mb-10 rounded-3xl overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-8 shadow-2xl">
    <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
    <div className="absolute -bottom-8 -right-4 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

    <div className="relative z-10 flex flex-col items-center text-center">
  
  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
    <Sparkles size={12} />
    Personalized for you
  </div>

  <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">
    Welcome back, <br />
    <span className="text-violet-200">{name}! 👋</span>
  </h1>

  <p className="text-violet-100 text-sm max-w-xs leading-relaxed mx-auto">
    You have <span className="text-white font-bold">{count} courses</span> in progress. Keep the momentum going!
  </p>

  <div className="flex justify-center gap-4 mt-6">
    {[
      { value: "0", label: "Completed" },
      { value: String(count), label: "In Progress" },
      { value: "0h", label: "Learning Time" },
    ].map(({ value, label }) => (
      <div
        key={label}
        className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-center"
      >
        <p className="text-white font-black text-xl">{value}</p>
        <p className="text-violet-200 text-xs">{label}</p>
      </div>
    ))}
  </div>

</div>

  </div>
);

const HomePage: React.FC = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [publishedCourses, setPublishedCourses] = useState<Course[]>([]);
  const [userName, setUserName] = useState<string>("User");
  
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch enrolled courses
        const enrollmentsRes = await api.get('/enrollments');
        const enrollmentsData = enrollmentsRes.data || [];
        const mappedEnrolled = enrollmentsData.map((e: any) => {
           const c = mapCourse(e.course);
           c.progress = e.progress || 0;
           return c;
        });
        setEnrolledCourses(mappedEnrolled);

        // Fetch user data (optional, but good for Welcome banner)
        if (enrollmentsData.length > 0 && enrollmentsData[0].user) {
            setUserName(enrollmentsData[0].user.name || enrollmentsData[0].user.email);
        }

        // Fetch all published courses to populate other sections
        const coursesRes = await api.get('/courses/published');
        const mappedCourses = (coursesRes.data || []).map(mapCourse);
        setPublishedCourses(mappedCourses);

      } catch (err) {
        console.error("Failed to load home data", err);
      }
    };
    fetchHomeData();
  }, []);

  // For now, if published courses are empty from backend (e.g. no script run yet),
  // fallback to hardcoded for the display (except for enrolled which should be strictly DB driven if possible, or just empty)
  const displayRecommended = publishedCourses.length > 0 ? publishedCourses : hardcodedRecommended;
  const displayExplore = publishedCourses.length > 0 ? publishedCourses : hardcodedExplore;
  const displayTrending = publishedCourses.length > 0 ? publishedCourses : hardcodedTrending;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeBanner name={userName} count={enrolledCourses.length} />

        <CourseSection
          title="Recommended for You"
          subtitle="Curated based on your interests and learning history"
          courses={displayRecommended.slice(0, 6)}
          accentColor="violet"
          viewAllPath="/courses/recommended"
        />

        {enrolledCourses.length > 0 && (
          <CourseSection
            title="Continue Learning"
            subtitle="Pick up where you left off"
            courses={enrolledCourses.slice(0, 6)}
            showProgress={true}
            accentColor="indigo"
            viewAllPath="/courses/enrolled"
          />
        )}

        <CourseSection
          title="Explore New Topics"
          subtitle="Discover something outside your comfort zone"
          courses={displayExplore.slice(0, 6)}
          accentColor="emerald"
          viewAllPath="/courses/explore"
        />

        <CourseSection
          title="Trending Right Now"
          subtitle="What thousands of learners are signing up for this week"
          courses={displayTrending.slice(0, 6)}
          accentColor="rose"
          viewAllPath="/courses/trending"
        />
      </div>
    </div>
  );
};

export default HomePage;

