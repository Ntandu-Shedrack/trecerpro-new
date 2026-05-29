"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type FAQ = {
  id: string;
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    id: "switch-plans",
    question: "Can I switch plans later?",
    answer:
      "Yes. You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades apply at the end of your billing cycle.",
  },
  {
    id: "what-is-asset",
    question: 'What counts as an "asset"?',
    answer:
      "An asset is any unique item tracked in the system, such as laptops, furniture, vehicles, or industrial equipment. Archived assets do not count toward your plan limit.",
  },
  {
    id: "nonprofit-discount",
    question: "Do you offer discounts for non-profits?",
    answer:
      "Yes. We offer a 30% discount for registered non-profit organizations. Contact our support team with verification documents to apply.",
  },
  {
    id: "data-security",
    question: "Is my data secure?",
    answer:
      "TracerPro uses bank-level AES-256 encryption. All data is backed up hourly and replicated across multiple secure regions to ensure high availability and safety.",
  },
];

export default function FAQSection() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="py-24 relative overflow-hidden bg-dot-grid">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>

          <p className="text-base md:text-lg text-muted-foreground font-medium">
            Everything you need to know about TracerPro.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = active === i;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="glass-card border border-border/40 rounded-3xl shadow-sm hover:shadow-md transition duration-300"
              >
                <button
                  onClick={() => setActive(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <h4 className="text-sm md:text-base font-bold text-foreground">
                    {faq.question}
                  </h4>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-xs md:text-sm text-muted-foreground leading-relaxed font-semibold">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-14 text-center">
          <p className="text-sm text-muted-foreground font-semibold">
            Still have questions?{" "}
            <a href="#" className="text-primary font-bold hover:underline">
              Chat with our team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
