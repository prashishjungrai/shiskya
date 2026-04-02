import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Calendar, ArrowLeft } from "lucide-react";

// Server-side Data Fetcher
async function getCourse(id: string) {
  const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/public/courses`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } }); // Cache ISR 60s
    if (!res.ok) return null;
    const courses = await res.json();
    return courses.find((c: any) => c._id === id) || null;
  } catch (e) {
    return null;
  }
}

// 1. DYNAMIC NEXT.JS URL PARAMS SEO INJECTION
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const course = await getCourse(params.id);
  if (!course) return { title: "Course Not Found" };

  return {
    title: `${course.title} | Expert Tuition in Nepal`,
    description: course.description?.substring(0, 160) || `Enroll in ${course.title} with the best educators in Nepal. Perfect for students seeking premium tuition.`,
    keywords: [course.title, `tuition for ${course.title} nepal`, "best tuition nepal", "exam preparation"],
    openGraph: {
      title: `${course.title} | Premium Course`,
      description: `Join our accelerated ${course.title} program in Nepal. Enroll today.`,
      type: "article",
    }
  };
}

// 2. SERVER COMPONENT ENABLING SERVER-SIDE RENDERING & JSON-LD
export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);

  if (!course) return <div className="min-h-screen pt-32 text-center text-red-500">Course not found.</div>;

  // 3. JSON-LD STRUCTURED DATA INJECTION FOR GOOGLE RICH SNIPPETS
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description || `Premium ${course.title} tuition class in Nepal.`,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "TuitionHub Nepal",
      "sameAs": "https://www.tuitionhubnepal.com"
    },
    "offers": {
      "@type": "Offer",
      "price": course.price || 0,
      "priceCurrency": "USD", // Assumed, could be NPR
      "category": "Tuition Service"
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-24">
      {/* Invisible Schema Data payload */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className="bg-slate-900 border-t border-slate-800 pt-16 pb-24 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link href="/courses" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
          <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
            <div className="max-w-3xl">
              <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-bold uppercase tracking-wider rounded border border-blue-500/30 mb-6">
                Premium Program
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                {course.title}
              </h1>
              <p className="text-xl text-slate-400 font-light max-w-2xl text-balance">
                Accelerate your career trajectory and deeply master the core fundamentals with our top-rated syllabus.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 self-stretch md:self-auto flex flex-col justify-center w-full md:w-80 min-w-[300px]">
              <div className="text-sm font-medium text-slate-300 mb-1">Tuition Fee</div>
              <div className="text-5xl font-black text-white mb-6 tracking-tight">
                {course.price ? `$${course.price}` : "Free"}
              </div>
              <Link href="/contact" className="w-full text-center px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50 transition duration-300">
                Enroll Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Course Overview</h2>
          <div className="prose prose-lg prose-slate max-w-none mb-12">
            <p className="whitespace-pre-wrap leading-relaxed text-slate-600">
              {course.description || "Detailed syllabus coming soon. Contact admissions for the curriculum brochure."}
            </p>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-6">What you will learn</h3>
          <ul className="grid sm:grid-cols-2 gap-4">
            {['Master the foundational concepts thoroughly', 'Hands-on practical assessments', 'Weekly 1-on-1 mentorship sessions', 'Lifetime access to course materials'].map((bullet, i) => (
              <li key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                <span className="text-slate-700 font-medium">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Facts</h3>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><Clock /></div>
              <div><div className="text-sm text-slate-500 font-semibold">Duration</div><div className="font-bold text-slate-900">{course.duration || "Self-paced"}</div></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"><Calendar /></div>
              <div><div className="text-sm text-slate-500 font-semibold">Next Batch</div><div className="font-bold text-slate-900">Enrolling constantly</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
