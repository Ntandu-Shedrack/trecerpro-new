"use client";

const stats = [
  { value: "99.9%", label: "Tracking Accuracy" },
  { value: "1M+", label: "Assets Managed" },
  { value: "500+", label: "Global Institutions" },
  { value: "15s", label: "Avg. Audit Time" },
];

export default function StatsBar() {
  return (
    <section className="py-12 bg-white md:px-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col gap-1">
              <span className="text-3xl font-black text-primary">
                {stat.value}
              </span>
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
