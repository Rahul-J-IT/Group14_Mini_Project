import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import CourseSection from "../components/CourseSection";
import { api } from "../api";
import type { Course } from "../api";

const WelcomeBanner: React.FC = () => (
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
    <span className="text-violet-200">Alex! 👋</span>
  </h1>

  <p className="text-violet-100 text-sm max-w-xs leading-relaxed mx-auto">
    You have <span className="text-white font-bold">3 courses</span> in progress. Keep the momentum going!
  </p>

  <div className="flex justify-center gap-4 mt-6">
    {[
      { value: "12", label: "Completed" },
      { value: "3", label: "In Progress" },
      { value: "48h", label: "Learning Time" },
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
  const [recommended, setRecommended] = useState<Course[]>([]);
  const [enrolled, setEnrolled] = useState<Course[]>([]);
  const [explore, setExplore] = useState<Course[]>([]);
  const [trending, setTrending] = useState<Course[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [r, e, x, t] = await Promise.all([
          api.getSectionCourses("recommended", 6),
          api.getSectionCourses("enrolled", 6),
          api.getSectionCourses("explore", 6),
          api.getSectionCourses("trending", 6),
        ]);
        setRecommended(r);
        setEnrolled(e);
        setExplore(x);
        setTrending(t);
      } catch (err) {
        console.error("failed to load home sections", err);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeBanner />

        <CourseSection
          title="Recommended for You"
          subtitle="Curated based on your interests and learning history"
          courses={recommended}
          accentColor="violet"
          viewAllPath="/courses/recommended"
        />

        <CourseSection
          title="Continue Learning"
          subtitle="Pick up where you left off"
          courses={enrolled}
          showProgress={true}
          accentColor="indigo"
          viewAllPath="/courses/enrolled"
        />

        <CourseSection
          title="Explore New Topics"
          subtitle="Discover something outside your comfort zone"
          courses={explore}
          accentColor="emerald"
          viewAllPath="/courses/explore"
        />

        <CourseSection
          title="Trending Right Now"
          subtitle="What thousands of learners are signing up for this week"
          courses={trending}
          accentColor="rose"
          viewAllPath="/courses/trending"
        />
      </div>
    </div>
  );
};

export default HomePage;
