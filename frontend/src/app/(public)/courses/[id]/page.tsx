import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Calendar, ArrowLeft, Medal, Shield } from "lucide-react";
import { Course } from "@/lib/types";

// Server-side Data Fetcher
async function getCourse(slug: string): Promise<Course | null> {
  const url = `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"}/public/courses/${slug}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
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
      "price": course.fee || 0,
      "priceCurrency": "USD", // Assumed, could be NPR
      "category": "Tuition Service"
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Invisible Schema Data payload */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1. PREMIUM HERO SECTION */}
      <section className="relative pt-48 pb-32 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-accent/5 opacity-10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link href="/courses" className="inline-flex items-center gap-3 text-white/40 hover:text-accent mb-12 transition-colors group text-[10px] uppercase font-bold tracking-widest">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Curriculum Catalog
          </Link>
          
          <div className="grid lg:grid-cols-12 gap-16 items-end">
            <div className="lg:col-span-8">
              <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-6 block">
                 {course.target_group || "Premium Program"}
              </span>
              <h1 className="text-5xl md:text-8xl font-serif font-bold text-white tracking-tight leading-[1.1] mb-8">
                {course.title}
              </h1>
              <p className="text-xl text-white/50 font-light max-w-2xl leading-relaxed">
                 Accelerate your academic trajectory and master core fundamentals with our top-rated, boutique syllabus led by industry pioneers.
              </p>
            </div>
            
            <div className="lg:col-span-4 w-full">
               <div className="bg-white/5 backdrop-blur-xl p-12 rounded-[40px] border border-white/10 shadow-premium">
                  <span className="text-[10px] uppercase font-bold text-accent tracking-[0.2em] mb-4 block">Institutional Enrollment Fee</span>
                  <div className="text-6xl font-serif font-bold text-white mb-10 italic">
                    {course.fee ? `$${course.fee}` : "Free"}
                  </div>
                  <Link href="/contact" className="block w-full py-6 bg-accent text-primary text-center font-bold rounded-2xl uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-all shadow-xl">
                    Begin Enrollment
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURRICULUM DETAILS */}
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-24 py-32">
        <div className="lg:col-span-2">
          <div className="mb-20">
             <span className="text-accent font-bold uppercase tracking-widest text-[10px] mb-4 block">Course Overview</span>
             <h2 className="text-4xl font-serif font-bold text-primary tracking-tight mb-10">Detailed Syllabus & Pedagogy</h2>
             <div className="prose prose-xl prose-primary max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed text-primary/60 font-light italic text-xl border-l-4 border-accent pl-8 py-2">
                  {course.description || "Our detailed syllabus is being meticulously refined for the upcoming session. Please contact the academic office for a full brochure."}
                </p>
             </div>
          </div>
          
          <div className="bg-[#fcfcfc] p-16 rounded-[Recp-48] border border-primary/5 shadow-premium">
             <h3 className="text-2xl font-serif font-bold text-primary mb-12 flex items-center gap-4">
                <Medal className="w-8 h-8 text-accent"/> Academic Learning Outcomes
             </h3>
             <ul className="grid sm:grid-cols-1 gap-6">
               {[
                 'Advanced mastery of core conceptual frameworks through rigorous testing.',
                 'Exclusive hands-on practical assessments designed for industrial application.',
                 'Personalized weekly 1-on-1 mentorship with distinguished faculty members.',
                 'Permanent institutional access to premium digital resources and alumni network.'
               ].map((bullet, i) => (
                 <li key={i} className="flex items-start gap-6 group">
                   <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-accent group-hover:text-primary transition-colors" />
                   </div>
                   <span className="text-primary/70 font-light text-lg leading-relaxed">{bullet}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>

        <div className="space-y-12">
          <div>
             <h3 className="text-[10px] uppercase font-bold text-primary/30 tracking-[0.3em] mb-10">Institutional Facts</h3>
             <div className="bg-white p-10 rounded-[40px] border border-primary/5 shadow-premium space-y-10">
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-accent"><Clock className="w-6 h-6"/></div>
                 <div>
                    <div className="text-[10px] text-primary/40 uppercase font-bold tracking-widest mb-1">Duration</div>
                    <div className="font-serif font-bold text-xl text-primary">{course.duration || "Accelerated Pace"}</div>
                 </div>
               </div>
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-accent"><Calendar className="w-6 h-6"/></div>
                 <div>
                    <div className="text-[10px] text-primary/40 uppercase font-bold tracking-widest mb-1">Admissions State</div>
                    <div className="font-serif font-bold text-xl text-primary">Open Enrollment</div>
                 </div>
               </div>
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-accent"><Shield className="w-6 h-6"/></div>
                 <div>
                    <div className="text-[10px] text-primary/40 uppercase font-bold tracking-widest mb-1">Certification</div>
                    <div className="font-serif font-bold text-xl text-primary">Academy Verified</div>
                 </div>
               </div>
             </div>
          </div>

          <div className="p-10 bg-accent rounded-[40px] text-primary shadow-premium">
             <h4 className="font-serif font-bold text-xl mb-4">Request Brochure</h4>
             <p className="text-sm font-medium mb-8 leading-relaxed">Get the complete curriculum breakdown and schedule delivered to your inbox.</p>
             <Link href="/contact" className="w-full py-4 bg-primary text-white text-center font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-colors block">
                Inquire Now
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
