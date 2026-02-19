import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Star, Users, Clock, Edit2, Trash2,
  BookOpen, TrendingUp, DollarSign, Award, Search,
  MoreVertical, Eye,
} from "lucide-react";
import { useLecturerCourses } from "../context/LecturerCoursesContext";
import DeleteModal from "../components/DeleteModal";

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: "bg-emerald-100 text-emerald-700",
  INTERMEDIATE: "bg-amber-100 text-amber-700",
  ADVANCED: "bg-rose-100 text-rose-700",
};

const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  return `${h}h`;
};

const formatEnrollments = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

export default function LecturerDashboardPage() {
  const navigate = useNavigate();
  const { courses, deleteCourse } = useLecturerCourses();

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEnrollments = courses.reduce((a, c) => a + c.total_enrollments, 0);
  const totalRevenue = courses.reduce((a, c) => a + c.price * c.total_enrollments, 0);
  const avgRating =
    courses.length > 0
      ? (courses.reduce((a, c) => a + c.average_rating, 0) / courses.length).toFixed(1)
      : "—";

  const handleDelete = () => {
    if (deleteTarget) {
      deleteCourse(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
          <div>
            <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-1">Lecturer Portal</p>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Courses</h1>
            <p className="text-sm text-slate-500 mt-1">Manage, edit, and track all your published courses</p>
          </div>
          <button
            onClick={() => navigate("/lecturer/courses/new")}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={18} />
            Create Course
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <BookOpen size={20} />, label: "Total Courses", value: courses.length, color: "text-violet-600", bg: "bg-violet-100" },
            { icon: <Users size={20} />, label: "Total Students", value: formatEnrollments(totalEnrollments), color: "text-indigo-600", bg: "bg-indigo-100" },
            { icon: <Star size={20} />, label: "Avg Rating", value: avgRating, color: "text-amber-600", bg: "bg-amber-100" },
            { icon: <DollarSign size={20} />, label: "Est. Revenue", value: `₹${(totalRevenue / 1000).toFixed(0)}k`, color: "text-emerald-600", bg: "bg-emerald-100" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center flex-shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-black text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 mb-6 shadow-sm focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
          <Search size={16} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search your courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent"
          />
        </div>

        {/* Course list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center">
              <BookOpen size={28} className="text-violet-500" />
            </div>
            <p className="font-bold text-slate-700 text-lg">No courses found</p>
            <p className="text-sm text-slate-400">
              {searchQuery ? "Try a different search term" : "Create your first course to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/lecturer/courses/new")}
                className="mt-2 px-5 py-2.5 bg-violet-600 text-white font-bold rounded-xl"
              >
                Create Course
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="flex gap-0">
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0 w-40 sm:w-52 h-full min-h-[140px]">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    {course.is_featured && (
                      <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full bg-violet-600 text-white">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col gap-2 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">
                            {course.category}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEVEL_COLORS[course.level]}`}>
                            {course.level}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-slate-800 text-base leading-snug line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{course.short_description}</p>
                      </div>

                      {/* Actions menu */}
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === course.id ? null : course.id)}
                          className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {openMenuId === course.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 top-10 z-20 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 w-44 overflow-hidden">
                              <button
                                onClick={() => { navigate(`/course/${course.id}`); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                <Eye size={15} className="text-slate-400" /> View Page
                              </button>
                              <button
                                onClick={() => { navigate(`/lecturer/courses/edit/${course.id}`); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                              >
                                <Edit2 size={15} className="text-indigo-400" /> Edit Course
                              </button>
                              <div className="border-t border-slate-100 my-1" />
                              <button
                                onClick={() => { setDeleteTarget({ id: course.id, title: course.title }); setOpenMenuId(null); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 size={15} /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 mt-auto pt-3 border-t border-slate-50 flex-wrap">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-slate-700">{course.average_rating || "New"}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Users size={12} />
                        {formatEnrollments(course.total_enrollments)} students
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock size={12} />
                        {formatDuration(course.estimated_duration_minutes)}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 ml-auto">
                        {course.price === 0 ? (
                          <span className="text-emerald-600">Free</span>
                        ) : (
                          `₹${course.price}`
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick action bar at bottom */}
                <div className="border-t border-slate-100 flex">
                  <button
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold text-slate-500 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                  >
                    <Eye size={14} /> Preview
                  </button>
                  <div className="w-px bg-slate-100" />
                  <button
                    onClick={() => navigate(`/lecturer/courses/edit/${course.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <div className="w-px bg-slate-100" />
                  <button
                    onClick={() => setDeleteTarget({ id: course.id, title: course.title })}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        courseTitle={deleteTarget?.title ?? ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
