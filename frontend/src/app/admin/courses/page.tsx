"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  BookOpen,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import LivePreviewPanel from "@/components/admin/LivePreviewPanel";
import CourseCardPreview from "@/components/admin/CourseCardPreview";
import ImageUpload from "@/components/ImageUpload";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import { getApiErrorMessage } from "@/lib/api-errors";
import { Course } from "@/lib/types";

type CourseFormData = {
  title: string;
  description: string;
  syllabus: string;
  fee: number;
  duration: string;
  target_group: string;
  image_url: string;
  is_active: boolean;
  display_order: number;
};

const emptyFormData: CourseFormData = {
  title: "",
  description: "",
  syllabus: "",
  fee: 0,
  duration: "",
  target_group: "",
  image_url: "",
  is_active: true,
  display_order: 0,
};

export default function CoursesPage() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(emptyFormData);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/admin/courses");
      setCourses(res.data);
    } catch (error) {
      showToast({
        variant: "error",
        title: "Could not load courses",
        description: getApiErrorMessage(error, "Refresh the page and try again."),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openModal = (course?: Course) => {
    if (course) {
      setEditCourse(course);
      setFormData({
        title: course.title,
        description: course.description || "",
        syllabus: course.syllabus || "",
        fee: course.fee || 0,
        duration: course.duration || "",
        target_group: course.target_group || "",
        image_url: course.image_url || "",
        is_active: course.is_active,
        display_order: course.display_order || 0,
      });
    } else {
      setEditCourse(null);
      setFormData(emptyFormData);
    }

    setIsModalOpen(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (editCourse) {
        await api.put(`/admin/courses/${editCourse.id}`, formData);
      } else {
        await api.post("/admin/courses", formData);
      }

      await fetchCourses();
      setIsModalOpen(false);
      showToast({
        variant: "success",
        title: editCourse ? "Course updated" : "Course created",
        description: "The course has been saved successfully.",
      });
    } catch (error) {
      showToast({
        variant: "error",
        title: "Course save failed",
        description: getApiErrorMessage(error, "Review the form values and try again."),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/admin/courses/${courseToDelete.id}`);
      await fetchCourses();
      showToast({
        variant: "success",
        title: "Course deleted",
        description: `"${courseToDelete.title}" has been removed.`,
      });
      setCourseToDelete(null);
    } catch (error) {
      showToast({
        variant: "error",
        title: "Delete failed",
        description: getApiErrorMessage(error, "The course could not be deleted."),
      });
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (course: Course) => {
    try {
      await api.put(`/admin/courses/${course.id}`, { is_active: !course.is_active });
      await fetchCourses();
      showToast({
        variant: "success",
        title: course.is_active ? "Course hidden" : "Course published",
        description: `"${course.title}" visibility has been updated.`,
      });
    } catch (error) {
      showToast({
        variant: "error",
        title: "Visibility update failed",
        description: getApiErrorMessage(error, "The course status could not be updated."),
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif font-bold text-primary tracking-tight">
            Academic <span className="italic text-primary/40">Programs</span>
          </h2>
          <p className="mt-1 text-sm font-light text-primary/40">
            Curate and manage all academic offerings
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-3 rounded-2xl bg-primary px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" /> Commission Program
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group overflow-hidden rounded-[32px] border border-primary/5 bg-white transition-all duration-500 hover:shadow-premium"
          >
            <div
              className="relative h-40 overflow-hidden"
              style={{
                background: course.image_url
                  ? `url(${course.image_url}) center/cover`
                  : "linear-gradient(135deg, var(--color-primary, #1e1b4b) 0%, var(--color-accent, #3b82f6) 100%)",
              }}
            >
              {!course.image_url ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-white/20" />
                </div>
              ) : null}
              <div className="absolute right-3 top-3">
                <span
                  className={`rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md ${
                    course.is_active ? "bg-black/85 text-white" : "bg-white/90 text-black/60"
                  }`}
                >
                  {course.is_active ? "Live" : "Draft"}
                </span>
              </div>
            </div>

            <div className="space-y-4 p-6">
              {course.target_group ? (
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary/55">
                  {course.target_group}
                </span>
              ) : null}
              <h3 className="text-xl font-bold leading-tight tracking-tight text-primary">
                {course.title}
              </h3>
              <p className="line-clamp-2 text-sm font-light text-primary/40">
                {course.description || "No synopsis."}
              </p>

              <div className="flex items-center justify-between border-t border-primary/5 pt-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-xs font-semibold text-primary/60">
                    <Clock className="h-3 w-3" /> {course.duration || "N/A"}
                  </span>
                  <span className="text-lg font-black text-primary">
                    {course.fee ? `$${course.fee}` : "Free"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(course)}
                    className="rounded-xl p-2 transition hover:bg-primary/5"
                    title={course.is_active ? "Hide" : "Show"}
                  >
                    {course.is_active ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-primary/35" />
                    )}
                  </button>
                  <button
                    onClick={() => openModal(course)}
                    className="rounded-xl p-2 text-primary/40 transition hover:bg-primary/5 hover:text-primary"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCourseToDelete(course)}
                    className="rounded-xl p-2 text-primary/35 transition hover:bg-primary hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {courses.length === 0 ? (
          <div className="col-span-full py-20 text-center text-primary/20">
            <BookOpen className="mx-auto mb-4 h-16 w-16" />
            <p className="text-lg font-serif italic">No academic programs commissioned</p>
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {isModalOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="flex max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-[32px] bg-[#fcfcfc] shadow-2xl"
            >
              <div className="w-1/2 overflow-y-auto border-r border-primary/5 p-10">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-2xl font-serif font-bold text-primary">
                    {editCourse ? "Refine Program" : "Commission Program"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl p-2 hover:bg-primary/5"
                  >
                    <X className="h-5 w-5 text-primary/40" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <Field
                    label="Program Title"
                    value={formData.title}
                    onChange={(value) => setFormData({ ...formData, title: value })}
                    required
                    placeholder="e.g. Advanced Mathematics"
                  />
                  <Field
                    label="Synopsis"
                    value={formData.description}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                    textarea
                    placeholder="Comprehensive overview..."
                  />

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/40">
                      Cover Image
                    </label>
                    <ImageUpload
                      value={formData.image_url}
                      onChange={(value) => setFormData({ ...formData, image_url: value })}
                      label="Upload Course Cover"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/40">
                        Fee ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
                        <input
                          type="number"
                          value={formData.fee}
                          onChange={(event) =>
                            setFormData({ ...formData, fee: Number(event.target.value) })
                          }
                          className="input-premium pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/40">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(event) =>
                          setFormData({ ...formData, duration: event.target.value })
                        }
                        className="input-premium"
                        placeholder="e.g. 6 months"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/40">
                        Target Group
                      </label>
                      <select
                        value={formData.target_group}
                        onChange={(event) =>
                          setFormData({ ...formData, target_group: event.target.value })
                        }
                        className="input-premium"
                      >
                        <option value="">Select...</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10 / SEE">Class 10 / SEE</option>
                        <option value="+2 Science">+2 Science</option>
                        <option value="+2 Management">+2 Management</option>
                        <option value="+2 Humanities">+2 Humanities</option>
                        <option value="Engineering Entrance">Engineering Entrance</option>
                        <option value="Medical Entrance">Medical Entrance</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>
                  </div>

                  <Field
                    label="Detailed Syllabus"
                    value={formData.syllabus}
                    onChange={(value) => setFormData({ ...formData, syllabus: value })}
                    textarea
                    placeholder="Chapter 1: ..."
                  />

                  <div className="flex items-center justify-between rounded-2xl bg-primary/5 p-4">
                    <label className="flex items-center gap-3 text-sm font-medium text-primary">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(event) =>
                          setFormData({ ...formData, is_active: event.target.checked })
                        }
                        className="h-5 w-5 rounded accent-accent"
                      />
                      Publish immediately
                    </label>
                    <div className="flex items-center gap-2 text-xs text-primary/40">
                      Order:
                      <input
                        type="number"
                        value={formData.display_order}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            display_order: Number(event.target.value),
                          })
                        }
                        className="input-premium w-16 text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-2xl bg-primary py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-xl transition-all hover:bg-accent hover:text-primary disabled:opacity-50"
                  >
                    {saving ? "Deploying..." : "Deploy Program"}
                  </button>
                </form>
              </div>

              <div className="w-1/2 bg-slate-50">
                <LivePreviewPanel title="Course Card Preview">
                  <div className="p-6">
                    <CourseCardPreview formData={formData} />
                  </div>
                </LivePreviewPanel>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ConfirmDialog
        open={Boolean(courseToDelete)}
        title="Delete this course?"
        description={
          courseToDelete
            ? `This will permanently remove "${courseToDelete.title}" from both admin and public views.`
            : ""
        }
        confirmLabel="Delete course"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => {
          if (!deleting) setCourseToDelete(null);
        }}
      />

      <style jsx global>{`
        .input-premium {
          @apply w-full rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-primary/20 focus:border-accent;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const Tag = textarea ? "textarea" : "input";

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/40">
        {label}
      </label>
      <Tag
        type="text"
        required={required}
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          onChange(event.target.value)
        }
        className={`input-premium ${textarea ? "min-h-[100px] py-4" : ""}`}
        placeholder={placeholder}
      />
    </div>
  );
}
