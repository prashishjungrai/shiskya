"use client";

import { resolveMediaUrl } from "@/lib/media";

type Props = {
  formData: {
    title: string;
    subtitle: string;
    image_url: string;
    is_active: boolean;
  };
};

export default function BannerPreview({ formData }: Props) {
  const previewUrl = resolveMediaUrl(formData.image_url);

  return (
    <div>
      <p className="text-[10px] font-bold text-center text-gray-400 uppercase tracking-widest mb-4">
        As seen in Hero Carousel
      </p>
      <div className="relative h-64 rounded-2xl overflow-hidden">
        {/* Background */}
        {previewUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${previewUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-neutral-700" />
        )}

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          {!formData.is_active && (
            <span className="mb-3 rounded-full bg-black px-2 py-1 text-[9px] font-bold uppercase text-white">
              Hidden — Won&apos;t appear on site
            </span>
          )}
          <h2 className="text-2xl font-extrabold tracking-tight mb-2 drop-shadow-lg">
            {formData.title || "Banner Title"}
          </h2>
          <p className="text-sm text-white/70 max-w-xs">
            {formData.subtitle || "Subtitle text will appear here..."}
          </p>
          <button className="mt-4 rounded-full bg-white px-6 py-2 text-sm font-bold text-black transition hover:bg-neutral-200">
            Explore Courses
          </button>
        </div>
      </div>
    </div>
  );
}
