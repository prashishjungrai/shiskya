"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, ImageIcon, MessageSquare, TrendingUp } from "lucide-react";
import api from "@/lib/api";

type DashboardStats = {
  courses: number;
  teachers: number;
  banners: number;
  testimonials: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [redditTrends, setRedditTrends] = useState<any[]>([]);

  useEffect(() => {
    // We would normally have a /api/admin/metrics endpoint, 
    // but we can just fetch lists and measure length for now since data is small
    const fetchMetrics = async () => {
      try {
        const [c, t, b, tes, r] = await Promise.all([
          api.get("/public/courses"),
          api.get("/public/teachers"),
          api.get("/public/banners"),
          api.get("/public/testimonials"),
          api.get("/public/reddit/engineering-trends")
        ]);
        
        setStats({
          courses: c.data.length || 0,
          teachers: t.data.length || 0,
          banners: b.data.length || 0,
          testimonials: tes.data.length || 0
        });

        setRedditTrends(r.data.data || []);
      } catch (err) {
        console.error("Failed to load metrics", err);
      }
    };
    fetchMetrics();
  }, []);

  if (!stats) return <div className="text-gray-500 animate-pulse">Loading overview...</div>;

  const statCards = [
    { title: "Active Courses", value: stats.courses, icon: BookOpen, color: "bg-blue-500" },
    { title: "Instructors", value: stats.teachers, icon: Users, color: "bg-green-500" },
    { title: "Site Banners", value: stats.banners, icon: ImageIcon, color: "bg-purple-500" },
    { title: "Testimonials", value: stats.testimonials, icon: MessageSquare, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard Overview</h2>
        <p className="text-gray-500">Welcome back. Here is what is happening with your institute today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1">
            <div className={`p-4 rounded-xl text-white ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Reddit Trends Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-orange-500" />
          <h3 className="text-xl font-bold">Trending in Engineering (/r/EngineeringStudents)</h3>
        </div>
        
        {redditTrends.length === 0 ? (
          <p className="text-gray-500 text-sm">No trending data available at the moment.</p>
        ) : (
          <div className="space-y-4">
            {redditTrends.map((trend, i) => (
              <a 
                key={i} 
                href={trend.url} 
                target="_blank" 
                rel="noreferrer"
                className="block p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-colors"
              >
                <h4 className="font-semibold text-gray-800 mb-1">{trend.title}</h4>
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1 text-orange-600">
                    ▲ {trend.score}
                  </span>
                  <span>{trend.num_comments} comments</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
