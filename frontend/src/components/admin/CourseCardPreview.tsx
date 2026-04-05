"use client";

import { BookOpen, Clock } from "lucide-react";

type Props = {
  formData: {
    title: string;
    description: string;
    image_url: string;
    fee: number;
    duration: string;
    target_group: string;
    syllabus: string;
    is_active: boolean;
  };
};

export default function CourseCardPreview({ formData }: Props) {
  return (
    <div className="max-w-sm mx-auto">
      <p className="text-[10px] font-bold text-center text-gray-400 uppercase tracking-widest mb-4">
        As seen on /courses
      </p>
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
        {/* Image area */}
        <div
          className="h-44 relative overflow-hidden"
          style={{
            background: formData.image_url
              ? `url(${formData.image_url}) center/cover`
              : "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
          }}
        >
          {!formData.image_url && (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-slate-300" />
            </div>
          )}
          {!formData.is_active && (
            <div className="absolute top-3 right-3 rounded-full bg-black text-[9px] font-bold uppercase text-white px-2 py-1">
              Hidden
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {formData.target_group && (
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
              {formData.target_group}
            </span>
          )}
          <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
            {formData.title || "Course Title"}
          </h3>
          <p className="text-slate-500 text-sm mb-4 line-clamp-3">
            {formData.description || "Course description will appear here..."}
          </p>

          {formData.syllabus && (
            <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Syllabus</p>
              <p className="text-xs text-slate-600 line-clamp-2 whitespace-pre-wrap">{formData.syllabus}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 text-sm font-semibold bg-slate-100 px-3 py-1 rounded-full text-slate-700">
              <Clock className="w-4 h-4 text-slate-600" />
              {formData.duration || "N/A"}
            </div>
            <span className="text-xl font-black text-slate-900">
              {formData.fee ? `$${formData.fee}` : "Free"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
