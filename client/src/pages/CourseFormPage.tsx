import { useState, useEffect} from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Save, Plus, Trash2, GripVertical,
  Image, BookOpen, Tag, ChevronDown, Info,
} from "lucide-react";
import { useLecturerCourses } from "../context/LecturerCoursesContext";
import type { CourseLevel, CourseModule } from "../data/courses";

const LEVELS: CourseLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

const CATEGORIES = [
  "Web Development", "Backend", "Mobile Development", "Data Science",
  "AI/ML", "DevOps", "Cloud", "Cybersecurity", "Design", "Marketing",
  "Programming", "Computer Science", "JavaScript", "Systems Programming",
];

interface FormState {
  title: string;
  short_description: string;
  description: string;
  price: string;
  level: CourseLevel;
  category: string;
  language: string;
  thumbnail_url: string;
  estimated_duration_minutes: string;
  is_featured: boolean;
  tags: string;
  what_you_learn: string[];
  requirements: string[];
  curriculum: CourseModule[];
}

const EMPTY_FORM: FormState = {
  title: "",
  short_description: "",
  description: "",
  price: "",
  level: "BEGINNER",
  category: "Web Development",
  language: "English",
  thumbnail_url: "",
  estimated_duration_minutes: "",
  is_featured: false,
  tags: "",
  what_you_learn: ["", ""],
  requirements: ["", ""],
  curriculum: [{ title: "", lessons: [""] }],
};

const InputField = ({
  label, required, hint, children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-slate-700">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-slate-400">{hint}</p>}
  </div>
);

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all bg-white";

export default function CourseFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const { addCourse, updateCourse, getCourseById } = useLecturerCourses();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const course = getCourseById(id);
      if (course) {
        setForm({
          title: course.title,
          short_description: course.short_description,
          description: course.description ?? "",
          price: String(course.price),
          level: course.level,
          category: course.category,
          language: course.language,
          thumbnail_url: course.thumbnail_url,
          estimated_duration_minutes: String(course.estimated_duration_minutes),
          is_featured: course.is_featured ?? false,
          tags: (course.tags ?? []).join(", "),
          what_you_learn: course.what_you_learn?.length ? course.what_you_learn : ["", ""],
          requirements: course.requirements?.length ? course.requirements : ["", ""],
          curriculum: course.curriculum?.length ? course.curriculum : [{ title: "", lessons: [""] }],
        });
      }
    }
  }, [id]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // Dynamic list helpers
  const updateListItem = (list: "what_you_learn" | "requirements", i: number, val: string) => {
    const updated = [...form[list]];
    updated[i] = val;
    set(list, updated);
  };
  const addListItem = (list: "what_you_learn" | "requirements") => set(list, [...form[list], ""]);
  const removeListItem = (list: "what_you_learn" | "requirements", i: number) => {
    if (form[list].length <= 1) return;
    set(list, form[list].filter((_, idx) => idx !== i));
  };

  // Curriculum helpers
  const updateModuleTitle = (mi: number, val: string) => {
    const c = form.curriculum.map((m, i) => (i === mi ? { ...m, title: val } : m));
    set("curriculum", c);
  };
  const addModule = () => set("curriculum", [...form.curriculum, { title: "", lessons: [""] }]);
  const removeModule = (mi: number) => {
    if (form.curriculum.length <= 1) return;
    set("curriculum", form.curriculum.filter((_, i) => i !== mi));
  };
  const updateLesson = (mi: number, li: number, val: string) => {
    const c = form.curriculum.map((m, i) =>
      i === mi ? { ...m, lessons: m.lessons.map((l, j) => (j === li ? val : l)) } : m
    );
    set("curriculum", c);
  };
  const addLesson = (mi: number) => {
    const c = form.curriculum.map((m, i) =>
      i === mi ? { ...m, lessons: [...m.lessons, ""] } : m
    );
    set("curriculum", c);
  };
  const removeLesson = (mi: number, li: number) => {
    const c = form.curriculum.map((m, i) =>
      i === mi && m.lessons.length > 1
        ? { ...m, lessons: m.lessons.filter((_, j) => j !== li) }
        : m
    );
    set("curriculum", c);
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.short_description.trim()) e.short_description = "Short description is required";
    if (form.price === "" || isNaN(Number(form.price)) || Number(form.price) < 0)
      e.price = "Enter a valid price (0 for free)";
    if (!form.estimated_duration_minutes || isNaN(Number(form.estimated_duration_minutes)))
      e.estimated_duration_minutes = "Enter duration in minutes";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: form.title.trim(),
      short_description: form.short_description.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      level: form.level,
      category: form.category,
      language: form.language,
      thumbnail_url: form.thumbnail_url || `https://picsum.photos/seed/${Date.now()}/800/450`,
      estimated_duration_minutes: Number(form.estimated_duration_minutes),
      is_featured: form.is_featured,
      instructor: "Alex Johnson",
      instructor_bio: "Senior full-stack developer with 10+ years of experience.",
      instructor_avatar: "https://picsum.photos/seed/lecav1/80/80",
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      what_you_learn: form.what_you_learn.filter(Boolean),
      requirements: form.requirements.filter(Boolean),
      curriculum: form.curriculum.filter((m) => m.title.trim()),
    };

    if (isEdit && id) {
      updateCourse(id, payload);
    } else {
      addCourse(payload);
    }

    setSaved(true);
    setTimeout(() => navigate("/lecturer/dashboard"), 800);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-xs font-bold text-violet-600 uppercase tracking-widest">
              {isEdit ? "Edit Course" : "New Course"}
            </p>
            <h1 className="text-2xl font-black text-slate-800">
              {isEdit ? "Update Course Details" : "Create a New Course"}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">

          {/* Basic Info */}
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Info size={16} className="text-violet-500" /> Basic Information
            </h2>

            <InputField label="Course Title" required>
              <input
                className={inputClass}
                placeholder="e.g. The Complete React Developer in 2024"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
              {errors.title && <p className="text-xs text-rose-500 mt-0.5">{errors.title}</p>}
            </InputField>

            <InputField label="Short Description" required hint="Shows on course cards. Keep it under 120 characters.">
              <input
                className={inputClass}
                placeholder="A brief, punchy description of your course"
                value={form.short_description}
                onChange={(e) => set("short_description", e.target.value)}
                maxLength={150}
              />
              {errors.short_description && (
                <p className="text-xs text-rose-500 mt-0.5">{errors.short_description}</p>
              )}
            </InputField>

            <InputField label="Full Description" hint="Detailed description shown on the course detail page.">
              <textarea
                className={`${inputClass} resize-none`}
                rows={5}
                placeholder="Describe what students will learn, who it's for, and what makes it special..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </InputField>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Category" required>
                <div className="relative">
                  <select
                    className={`${inputClass} appearance-none pr-8`}
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </InputField>

              <InputField label="Level" required>
                <div className="relative">
                  <select
                    className={`${inputClass} appearance-none pr-8`}
                    value={form.level}
                    onChange={(e) => set("level", e.target.value as CourseLevel)}
                  >
                    {LEVELS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </InputField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Price (₹)" required hint="Set 0 for a free course">
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  placeholder="e.g. 1299"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
                {errors.price && <p className="text-xs text-rose-500 mt-0.5">{errors.price}</p>}
              </InputField>

              <InputField label="Duration (minutes)" required>
                <input
                  className={inputClass}
                  type="number"
                  min={1}
                  placeholder="e.g. 720"
                  value={form.estimated_duration_minutes}
                  onChange={(e) => set("estimated_duration_minutes", e.target.value)}
                />
                {errors.estimated_duration_minutes && (
                  <p className="text-xs text-rose-500 mt-0.5">{errors.estimated_duration_minutes}</p>
                )}
              </InputField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField label="Language">
                <input
                  className={inputClass}
                  placeholder="English"
                  value={form.language}
                  onChange={(e) => set("language", e.target.value)}
                />
              </InputField>

              <InputField label="Thumbnail URL" hint="Leave blank for auto-generated image">
                <input
                  className={inputClass}
                  placeholder="https://..."
                  value={form.thumbnail_url}
                  onChange={(e) => set("thumbnail_url", e.target.value)}
                />
              </InputField>
            </div>

            <InputField label="Tags" hint="Comma separated: React, JavaScript, Frontend">
              <input
                className={inputClass}
                placeholder="React, JavaScript, Frontend"
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
              />
            </InputField>

            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set("is_featured", !form.is_featured)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                  form.is_featured ? "bg-violet-600" : "bg-slate-200"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    form.is_featured ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
              <span className="text-sm font-semibold text-slate-700">Mark as Featured</span>
            </label>
          </section>

          {/* What You'll Learn */}
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7 flex flex-col gap-4">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-500" /> What Students Will Learn
            </h2>
            {form.what_you_learn.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  className={`${inputClass} flex-1`}
                  placeholder={`Learning outcome ${i + 1}`}
                  value={item}
                  onChange={(e) => updateListItem("what_you_learn", i, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeListItem("what_you_learn", i)}
                  disabled={form.what_you_learn.length <= 1}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-30"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem("what_you_learn")}
              className="self-start flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 px-3 py-2 rounded-xl hover:bg-violet-50 transition-colors"
            >
              <Plus size={15} /> Add Outcome
            </button>
          </section>

          {/* Requirements */}
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7 flex flex-col gap-4">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Tag size={16} className="text-emerald-500" /> Requirements
            </h2>
            {form.requirements.map((req, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  className={`${inputClass} flex-1`}
                  placeholder={`Requirement ${i + 1}`}
                  value={req}
                  onChange={(e) => updateListItem("requirements", i, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeListItem("requirements", i)}
                  disabled={form.requirements.length <= 1}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-30"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem("requirements")}
              className="self-start flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 px-3 py-2 rounded-xl hover:bg-violet-50 transition-colors"
            >
              <Plus size={15} /> Add Requirement
            </button>
          </section>

          {/* Curriculum */}
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7 flex flex-col gap-5">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <GripVertical size={16} className="text-rose-500" /> Curriculum
            </h2>

            {form.curriculum.map((module, mi) => (
              <div
                key={mi}
                className="border border-slate-200 rounded-2xl overflow-hidden"
              >
                {/* Module header */}
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-3">
                  <span className="w-6 h-6 rounded-lg bg-violet-100 text-violet-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {mi + 1}
                  </span>
                  <input
                    className="flex-1 bg-transparent text-sm font-bold text-slate-800 outline-none placeholder-slate-400"
                    placeholder="Module title (e.g. Getting Started)"
                    value={module.title}
                    onChange={(e) => updateModuleTitle(mi, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeModule(mi)}
                    disabled={form.curriculum.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors disabled:opacity-30"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Lessons */}
                <div className="p-4 flex flex-col gap-2">
                  {module.lessons.map((lesson, li) => (
                    <div key={li} className="flex gap-2 items-center">
                      <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 text-xs flex items-center justify-center flex-shrink-0">
                        {li + 1}
                      </span>
                      <input
                        className={`${inputClass} flex-1 py-2`}
                        placeholder={`Lesson title`}
                        value={lesson}
                        onChange={(e) => updateLesson(mi, li, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeLesson(mi, li)}
                        disabled={module.lessons.length <= 1}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors disabled:opacity-30"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addLesson(mi)}
                    className="self-start flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-2 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors mt-1"
                  >
                    <Plus size={13} /> Add Lesson
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addModule}
              className="self-start flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 px-3 py-2 rounded-xl hover:bg-violet-50 transition-colors border-2 border-dashed border-violet-200 hover:border-violet-300 w-full justify-center"
            >
              <Plus size={15} /> Add Module
            </button>
          </section>

          {/* Submit */}
          <div className="flex gap-3 pb-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg ${
                saved
                  ? "bg-emerald-500 text-white shadow-emerald-200"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-violet-200"
              }`}
            >
              <Save size={18} />
              {saved ? "Saved! Redirecting..." : isEdit ? "Save Changes" : "Publish Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
