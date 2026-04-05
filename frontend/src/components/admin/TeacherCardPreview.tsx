"use client";

import { resolveMediaUrl } from "@/lib/media";

type Props = {
  formData: {
    name: string;
    subject: string;
    qualification: string;
    bio: string;
    photo_url: string;
    is_active: boolean;
  };
};

export default function TeacherCardPreview({ formData }: Props) {
  const photoUrl = resolveMediaUrl(formData.photo_url);

  return (
    <div className="max-w-xs mx-auto">
      <p className="text-[10px] font-bold text-center text-gray-400 uppercase tracking-widest mb-4">
        As seen on /teachers
      </p>
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center relative">
        {!formData.is_active && (
          <div className="absolute top-3 right-3 rounded-full bg-black px-2 py-1 text-[9px] font-bold uppercase text-white">
            Hidden
          </div>
        )}

        {/* Photo */}
        <div
          className="mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white shadow-inner overflow-hidden"
          style={{
            width: 112,
            height: 112,
            borderRadius: "9999px",
            background: photoUrl
              ? undefined
              : "linear-gradient(135deg, #111111, #5a5a5a)",
          }}
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={formData.name}
              className="w-full h-full object-cover"
            />
          ) : (
            (formData.name || "T").charAt(0)
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {formData.name || "Instructor Name"}
        </h3>
        <p className="mb-1 text-sm font-semibold text-slate-600">
          {formData.subject || "Subject Area"}
        </p>
        {formData.qualification && (
          <p className="text-slate-400 text-xs mb-3 font-medium">
            {formData.qualification}
          </p>
        )}
        <p className="text-slate-500 text-sm leading-relaxed">
          {formData.bio || "Instructor bio will appear here..."}
        </p>
      </div>
    </div>
  );
}
