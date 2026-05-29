import { motion } from "framer-motion";

const stats = [
  { value: "99.9%", label: "Tracking Accuracy" },
  { value: "1.2M+", label: "Assets Managed" },
  { value: "500+", label: "Global Clients" },
  { value: "0.4s", label: "Ping Latency" },
];

export default function StatsBar() {
  return (
    <section className="w-full px-4 md:px-6 py-8 bg-dot-grid">
      <div className="max-w-7xl mx-auto glass-card rounded-3xl p-8 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
              className="flex flex-col gap-1.5"
            >
              <span className="text-2xl md:text-4xl font-black text-primary tracking-tight">
                {stat.value}
              </span>
              <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
