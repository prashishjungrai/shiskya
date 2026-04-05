"use client";

import { Star } from "lucide-react";

type Props = {
  formData: {
    student_name: string;
    content: string;
    rating: number;
    course: string;
    is_active: boolean;
  };
};

export default function TestimonialPreview({ formData }: Props) {
  return (
    <div className="max-w-sm mx-auto">
      <p className="text-[10px] font-bold text-center text-gray-400 uppercase tracking-widest mb-4">
        As seen on Homepage
      </p>
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative">
        {!formData.is_active && (
          <div className="absolute top-3 right-3 rounded-full bg-black px-2 py-1 text-[9px] font-bold uppercase text-white">
            Hidden
          </div>
        )}

        {/* Stars */}
        <div className="mb-6 flex items-center gap-1 text-slate-900">
          {Array(Math.min(Math.max(formData.rating || 0, 0), 5))
            .fill(0)
            .map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          {Array(5 - Math.min(Math.max(formData.rating || 0, 0), 5))
            .fill(0)
            .map((_, i) => (
              <Star key={`e-${i}`} className="w-5 h-5 text-slate-200" />
            ))}
        </div>

        {/* Quote */}
        <p className="text-slate-600 text-lg leading-relaxed mb-8 italic">
          &ldquo;{formData.content || "Student feedback will appear here..."}&rdquo;
        </p>

        {/* Student Info */}
        <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black font-bold text-white">
            {(formData.student_name || "S").charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-slate-900">{formData.student_name || "Student Name"}</h4>
            <span className="text-sm text-slate-500">
              {formData.course || "Course"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
