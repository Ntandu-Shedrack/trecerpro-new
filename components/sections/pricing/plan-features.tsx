/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { CheckCircle, Minus, ShieldCheck, UserCheck, Key } from "lucide-react";

const rows = [
  {
    group: "Asset Management",
    items: [
      ["Asset Limit", "500", "5,000", "Unlimited"],
      ["Active Projects", "1", "10", "Unlimited"],
      ["Bulk Import / Export", false, true, true],
      ["Custom Fields", "Up to 3", "Unlimited", "Unlimited"],
    ],
  },
  {
    group: "Security & Compliance",
    items: [
      ["Audit Logs", "7 days", "30 days", "Full History"],
      ["SSO (SAML / OIDC)", false, false, "icon:sso"],
      ["Role-Based Permissions", "Basic", "Advanced", "Custom Roles"],
      ["IP Whitelisting", false, false, true],
    ],
  },
  {
    group: "Advanced Connectivity",
    items: [
      ["API Access", false, "5k req/day", "Unlimited"],
      ["Webhook Integration", false, true, true],
    ],
  },
  {
    group: "Support & Services",
    items: [
      ["Support Channels", "Email", "Priority Email", "24/7 Phone & Slack"],
      ["SLA Guarantee", false, "99.9%", "99.99% Custom"],
      ["Response Time", "48h", "12h", "< 1h"],
      ["Account Manager", false, false, "icon:manager"],
    ],
  },
];

function renderCell(value: any) {
  if (value === true)
    return <CheckCircle className="w-5 h-5 text-primary mx-auto" />;

  if (value === false)
    return <Minus className="w-5 h-5 text-slate-300 mx-auto" />;

  if (value === "icon:sso")
    return <ShieldCheck className="w-5 h-5 text-primary mx-auto" />;

  if (value === "icon:manager")
    return <UserCheck className="w-5 h-5 text-primary mx-auto" />;

  return <span>{value}</span>;
}

export default function FeatureComparison() {
  return (
    <section className="py-24 md:px-20 bg-white">
      <div className="container px-6 mx-auto">
        {/* header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">
            Detailed Comparison
          </h2>
          <p className="text-slate-600 text-lg">
            Everything you need to manage assets at scale.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-sm">
            {/* header */}
            <thead>
              <tr className="text-slate-900 text-sm font-bold">
                <th className="sticky left-0 bg-white py-6 px-6 border-b border-slate-200 min-w-[260px] text-left">
                  Features
                </th>

                <th className="py-6 px-4 border-b border-slate-200 text-center">
                  Starter
                </th>

                <th className="py-6 px-4 text-center border-b-2 border-primary bg-primary/5">
                  Professional
                </th>

                <th className="py-6 px-4 border-b border-slate-200 text-center">
                  Enterprise
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((group, gIndex) => (
                <>
                  {/* group title */}
                  <tr key={gIndex} className="bg-slate-50">
                    <td
                      colSpan={4}
                      className="py-4 px-6 text-xs font-bold tracking-wider uppercase text-slate-500"
                    >
                      {group.group}
                    </td>
                  </tr>

                  {group.items.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                      className="group hover:bg-slate-50 transition"
                    >
                      {/* feature name */}
                      <td className="sticky left-0 bg-white py-4 px-6 border-b border-slate-100 font-medium text-slate-700">
                        {row[0]}
                      </td>

                      {/* starter */}
                      <td className="py-4 px-4 border-b border-slate-100 text-center text-slate-600">
                        {renderCell(row[1])}
                      </td>

                      {/* professional highlight */}
                      <td className="py-4 px-4 border-b border-slate-100 text-center font-semibold bg-primary/5 text-slate-900">
                        {renderCell(row[2])}
                      </td>

                      {/* enterprise */}
                      <td className="py-4 px-4 border-b border-slate-100 text-center text-slate-700">
                        {renderCell(row[3])}
                      </td>
                    </motion.tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
