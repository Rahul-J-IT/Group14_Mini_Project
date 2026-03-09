import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Section {
  title: string;
  description: string;
  videoUrl: string;      
  orderIndex: number;
}

interface CourseForm {
  title: string;
  description: string;
  duration: string;
  language: string;
  status: 'draft' | 'published' | 'archived';
  videoUrl: string;       
  thumbnailUrl: string;
  sections: Section[];
}

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState<CourseForm>({
    title: '',
    description: '',
    duration: '',
    language: '',
    status: 'draft',
    videoUrl: '',
    thumbnailUrl: '',
    sections: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isExist, setIsExist] = useState(true);

  const courseId = window.location.pathname.split('/').pop();
    React.useEffect(() => {
      if (courseId && courseId !== 'createCourse') {
        setIsExist(true);
      } else {
        setIsExist(false);
      }
    }, [courseId]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSection = () => {
    setForm({
      ...form,
      sections: [
        ...form.sections,
        { title: '', description: '', videoUrl: '', orderIndex: form.sections.length },
      ],
    });
  };

  const handleSectionChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedSections = [...form.sections];
    updatedSections[index] = { ...updatedSections[index], [e.target.name]: e.target.value };
    setForm({ ...form, sections: updatedSections });
  };

  const removeSection = (index: number) => {
    const updatedSections = form.sections
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, orderIndex: i }));
    setForm({ ...form, sections: updatedSections });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title || !form.description || !form.duration || !form.language) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        videoUrl: form.videoUrl || undefined,
        thumbnailUrl: form.thumbnailUrl || undefined,
        sections: form.sections.map((s) => ({
          title: s.title,
          description: s.description,
          orderIndex: s.orderIndex,
          ...(s.videoUrl ? { videoUrl: s.videoUrl } : {}),
        })),
      };

      await axios.post('http://localhost:3000/courses', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Course created successfully!');
      setTimeout(() => navigate('/instructor'), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border shadow-md shadow-blue-500 border-gray-200 rounded-lg px-2 py-1";
  const labelClass = 'block text-gray-700 font-medium mb-1';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      { !isExist && <h1 className="text-3xl font-bold mb-2">Create Course</h1>}
      { isExist && <h1 className="text-3xl font-bold mb-2">Edit Course</h1>}

      {error && <p className="text-red-500 mb-4 bg-red-50 border border-red-200 rounded p-2">{error}</p>}
      {success && <p className="text-green-600 mb-4 bg-green-50 border border-green-200 rounded p-2">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 border shadow-md shadow-blue-500 border-gray-300 rounded-xl">
        <div>
          <label className={labelClass}>Course Title <span className="text-red-500">*</span></label>
          <input name="title" value={form.title} onChange={handleChange}
            type="text" className={inputClass} placeholder="e.g. Introduction to React" />
        </div>

        <div>
          <label className={labelClass}>Description <span className="text-red-500">*</span></label>
          <textarea name="description" value={form.description} onChange={handleChange}
            className={inputClass} placeholder="Describe your course..." rows={4} />
        </div>

        <div>
          <label className={labelClass}>Duration <span className="text-red-500">*</span></label>
          <input name="duration" value={form.duration} onChange={handleChange}
            type="text" className={inputClass} placeholder="e.g. 10 hours" />
        </div>

        <div>
          <label className={labelClass}>Language <span className="text-red-500">*</span></label>
          <input name="language" value={form.language} onChange={handleChange}
            type="text" className={inputClass} placeholder="e.g. English" />
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Video URL</label>
          <input name="videoUrl" value={form.videoUrl} onChange={handleChange}
            type="url" className={inputClass} placeholder="https://..." />
        </div>

        <div>
          <label className={labelClass}>Thumbnail URL</label>
          <input name="thumbnailUrl" value={form.thumbnailUrl} onChange={handleChange}
            type="url" className={inputClass} placeholder="https://..." />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2 ">
            <h2 className="text-xl font-semibold">Sections</h2>
            <button type="button" onClick={addSection}
              className="text-sm bg-gray-100 hover:bg-gray-200 border  border-gray-300 px-3 py-1 rounded">
              + Add Section
            </button>
          </div>

          {form.sections.length === 0 && (
            <p className="text-gray-400 text-sm">No sections added yet.</p>
          )}

          {form.sections.map((section, index) => (
            <div key={index} className="border rounded-md p-4 mb-3 bg-gray-50 shadow-md shadow-blue-500 border-gray-300">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">Section {index + 1}</span>
                <button type="button" onClick={() => removeSection(index)}
                  className="text-red-500 text-sm hover:underline">Remove</button>
              </div>
              <div className="flex flex-col gap-2">
                <input name="title" value={section.title}
                  onChange={(e) => handleSectionChange(index, e)}
                  type="text" className={inputClass} placeholder="Section Title" />
                <textarea name="description" value={section.description}
                  onChange={(e) => handleSectionChange(index, e)}
                  className={inputClass} placeholder="Section Description" rows={2} />
                <input name="videoUrl" value={section.videoUrl}
                  onChange={(e) => handleSectionChange(index, e)}
                  type="url" className={inputClass} placeholder="Section Video URL" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-2">
          <button type="submit" disabled={loading}
            className="bg-black text-white px-6 py-2 rounded-md shadow hover:bg-gray-800 transition disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Course'}
          </button>
          <button type="button" onClick={() => navigate('/instructor')}
            className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoursePage;