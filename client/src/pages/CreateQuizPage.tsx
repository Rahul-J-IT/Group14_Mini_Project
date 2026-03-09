import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../api/QuizApi";
import type { Question } from "../types/quiz";
import {
  ClipboardList,
  Plus,
  Trash2,
  CheckCircle,
  ChevronLeft,
  Clock,
  Target,
  FileQuestion,
  BookOpen,
  Send,
  AlertCircle,
} from "lucide-react";

const CreateQuizPage: React.FC = () => {
  const navigate = useNavigate();

  // Quiz meta
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sectionId, setSectionId] = useState<number | "">("");
  const [duration, setDuration] = useState(1800);
  const [passingScore, setPassingScore] = useState(70);

  // Current question being built
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  // Accumulated questions
  const [questions, setQuestions] = useState<Question[]>([]);

  // UI states
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [questionError, setQuestionError] = useState("");

  const handleOptionChange = (value: string, idx: number) => {
    const updated = [...options];
    updated[idx] = value;
    setOptions(updated);
  };

  const addQuestion = () => {
    setQuestionError("");
    if (!questionText.trim()) {
      setQuestionError("Question text is required.");
      return;
    }
    if (options.some((o) => !o.trim())) {
      setQuestionError("All option fields must be filled.");
      return;
    }
    const newQ: Question = {
      id: questions.length + 1,
      question: questionText.trim(),
      options: options.map((o) => o.trim()),
      correctAnswer,
    };
    setQuestions([...questions, newQ]);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s > 0 ? s + "s" : ""}`.trim();
  };

  const handleSubmit = async () => {
    setError("");
    if (!title.trim()) { setError("Quiz title is required."); return; }
    if (!sectionId) { setError("Section ID is required."); return; }
    if (questions.length === 0) { setError("Add at least one question before submitting."); return; }

    setSubmitting(true);
    try {
      await createQuiz({
        sectionId: Number(sectionId),
        title: title.trim(),
        description: description.trim(),
        duration,
        passingScore,
        questions,
      });
      setSuccess(true);
      setTimeout(() => navigate("/instructor"), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Quiz Created!</h2>
          <p className="text-slate-500 text-sm">Redirecting you to the instructor dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Back button + Header */}
        <div>
          <button
            onClick={() => navigate("/instructor")}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4 font-medium"
          >
            <ChevronLeft size={16} />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
              <ClipboardList size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Create Quiz</h1>
              <p className="text-sm text-slate-500">Build a quiz for your course section</p>
            </div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Quiz Details Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={16} className="text-violet-500" />
            <h2 className="font-bold text-slate-800">Quiz Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Quiz Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Chapter 3 – Data Structures Quiz"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Brief description of what this quiz covers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Section ID <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                placeholder="Section ID"
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                <Clock size={11} className="inline mr-1" />Duration (seconds)
              </label>
              <input
                type="number"
                value={duration}
                min={60}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
              <p className="text-xs text-slate-400 mt-1">{formatDuration(duration)}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                <Target size={11} className="inline mr-1" />Passing Score (%)
              </label>
              <input
                type="number"
                value={passingScore}
                min={1}
                max={100}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        {/* Add Question Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <FileQuestion size={16} className="text-indigo-500" />
            <h2 className="font-bold text-slate-800">Add Question</h2>
          </div>

          {questionError && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
              <AlertCircle size={14} />
              {questionError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Question Text
            </label>
            <textarea
              placeholder="Enter your question here..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Options — select the correct answer
            </label>
            <div className="space-y-2.5">
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    correctAnswer === idx
                      ? "border-emerald-400 bg-emerald-50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50"
                  }`}
                  onClick={() => setCorrectAnswer(idx)}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 transition-all ${
                      correctAnswer === idx
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-white border-slate-300 text-slate-400"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <input
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    value={opt}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleOptionChange(e.target.value, idx)}
                    className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
                  />
                  {correctAnswer === idx && (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 flex-shrink-0">
                      <CheckCircle size={13} /> Correct
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-2">Click on an option row to mark it as the correct answer</p>
          </div>

          <button
            onClick={addQuestion}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 shadow-md shadow-indigo-200"
          >
            <Plus size={15} />
            Add Question
          </button>
        </div>

        {/* Questions List */}
        {questions.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileQuestion size={16} className="text-slate-500" />
                <h2 className="font-bold text-slate-800">
                  Questions Added
                  <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full">
                    {questions.length}
                  </span>
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {questions.map((q, qi) => (
                <div key={q.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50 group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {qi + 1}
                      </span>
                      <p className="text-sm font-semibold text-slate-800 leading-snug">{q.question}</p>
                    </div>
                    <button
                      onClick={() => removeQuestion(qi)}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mt-3 ml-10">
                    {q.options.map((o, oi) => (
                      <div
                        key={oi}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs ${
                          oi === q.correctAnswer
                            ? "bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200"
                            : "bg-white text-slate-600 border border-slate-100"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                          oi === q.correctAnswer ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                        }`}>
                          {String.fromCharCode(65 + oi)}
                        </span>
                        <span className="truncate">{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between gap-4 pb-8">
          <button
            onClick={() => navigate("/instructor")}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || questions.length === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send size={15} />
                Create Quiz
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;
