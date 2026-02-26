"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HeroSection() {
  return (
    <section className="w-full bg-white md:px-20 py-24">
      <div className="container px-6 md:12 mx-auto flex items-center justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full w-fit">
              <span className="text-xs font-bold uppercase tracking-wider">
                New: AI Auto-Categorization
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-800 leading-[1.1] tracking-tight">
              Precision Asset Management.
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted leading-relaxed max-w-lg">
              Streamline your enterprise inventory with TracerPro&apos;s
              professional barcode tracking system. Reduce loss, eliminate
              errors, and improve accuracy today.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="px-8 py-6 text-lg font-bold shadow-xl shadow-primary/25"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-6 text-lg font-bold"
              >
                Request Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                <Avatar className="border-2 border-background h-10 w-10">
                  <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP_5VxELdg13CrJzQ7MRn2ovGG1RsHrUmAyK60h78fPToad9o5oT3KPIP0VxY0q6dT_j5eBWrkH8EX4GuyCT5CZkKyv3MkZxkkJ-dvPSgJesO0heiDfwmDkhKaa9zgEhQuJ5vzOuFJr-vf_DxzoJ26IXLqsYrenckI8ZPoDeNkId6Qxhdi7ptkt7g9DIjmetwZ7ff50BamzC3l-vhVHzVWxBcLe3Fms9sxPDr_xEoJgDaIfh0sUMZBQJjj6EdXWi4JjxbBOmkzqfo" />
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>

                <Avatar className="border-2 border-background h-10 w-10">
                  <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfNbuXV0Sj1v6amBPRR36KOn__KuAYvledxcCpm-rs2fIYwaUBBZnwDasqUf6Z6oCDDUS2twAYQxCeyAxre64aaNpwee_0lUHWyci-N1_h4Z2qY-RuLxDk4T8SkQvHiKNdOsyGlbPH7BsCLvOHQTtqRXzEzcQhtkBsfKgTvBDsb1gxKyMpSA_FOZfl7J3V8d2YAHttLkKmrhqTOlxMCdlf4k9-V-RcBJTC8pqeefDEAg3Gex77N8k68JfDv2j8t3ZPt8xTFBXzKcQ" />
                  <AvatarFallback>U2</AvatarFallback>
                </Avatar>

                <Avatar className="border-2 border-background h-10 w-10">
                  <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyXmbX7TY9yz8rdQ8qi1n0AKCYnqhYSqwGPVpKTk8gFY0Zhkud-J97RNt8OUYzTxtFo0WuxbqYsGTS-hpx5cD-_e_QmK4paL2fBn6OU02-JaqsasLnpkfGfyqbflnRqzenzk7fRlD34vouEWY1VEK-CYXFi5_rkCJHBl6LR8HHWbvYLfmQaGtCXdTd0hgeKqfano2COSEenLTyObdY6zG6DTJ5XgkvwbQamgo-vlUXaI3sUlOMDV0U-pyxMrl0qUgLGxw2WzEFY4E" />
                  <AvatarFallback>U3</AvatarFallback>
                </Avatar>
              </div>

              <p className="text-sm font-medium text-muted">
                Trusted by 500+ global enterprises
              </p>
            </div>
          </div>

          {/* RIGHT – Preview */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 rounded-[2rem] blur-3xl group-hover:bg-primary/30 transition-all duration-500" />

            <div className="relative rounded-2xl border shadow-2xl overflow-hidden bg-card">
              {/* Fake window chrome */}
              <div className="h-8 bg-muted flex items-center gap-1.5 px-4">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>

              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA49mLpvkou9uqeBG2s8cHpbUKOr_38q5455mf2XyQdLtbg_R7MZYtm8mz0_Fm5gpshREfqpzdfayZ21w66qroWyZ7yO9pf79pAPzgVbQJEa6BzHdpUgW_bpJBpPiog3Tv816AIl9vzGd0jLzSVEH40GLKv8LOvtU9ZUG9ieKMmnX7-_4BjUt9t4GfmuCzM8bjByRpPIRd5QuL-ZZ5IGwm7ZAc0FW_0jlQCFQHK2Qk8k7DWwAihMQwG8Il5toIYXcGeFyVWt2LtmFs"
                alt="TracerPro Dashboard"
                width={1200}
                height={675}
                className="w-full aspect-video object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
