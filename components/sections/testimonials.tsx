"use client";

import avatar1 from "@/components/icons/avatar-1.png";
import avatar2 from "@/components/icons/avatar-2.png";
import avatar3 from "@/components/icons/avatar-3.png";
import avatar4 from "@/components/icons/avatar-4.png";
import avatar5 from "@/components/icons/avatar-5.png";
import avatar6 from "@/components/icons/avatar-6.png";
import avatar7 from "@/components/icons/avatar-7.png";
import avatar8 from "@/components/icons/avatar-8.png";
import avatar9 from "@/components/icons/avatar-9.png";
import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";

type Testimonial = {
  text: string;
  imageSrc: string;
  name: string;
  username: string;
};

const testimonials: Testimonial[] = [
  {
    text: "As a seasoned designer always on the lookout for innovative tools, TracerPro instantly grabbed my attention.",
    imageSrc: avatar1.src,
    name: "Jamie Rivera",
    username: "@jamietechguru00",
  },
  {
    text: "Our team's productivity has skyrocketed since we started using this tool.",
    imageSrc: avatar2.src,
    name: "Josh Smith",
    username: "@jjsmith",
  },
  {
    text: "This app has completely transformed how I manage my projects and deadlines.",
    imageSrc: avatar3.src,
    name: "Morgan Lee",
    username: "@morganleewhiz",
  },
  {
    text: "I was amazed at how quickly we were able to integrate this app into our workflow.",
    imageSrc: avatar4.src,
    name: "Casey Jordan",
    username: "@caseyj",
  },
  {
    text: "Planning and executing events has never been easier. This app helps me keep track of all the moving parts.",
    imageSrc: avatar5.src,
    name: "Taylor Kim",
    username: "@taylorkimm",
  },
  {
    text: "The customizability and integration capabilities of this app are top-notch.",
    imageSrc: avatar6.src,
    name: "Riley Smith",
    username: "@rileysmith1",
  },
  {
    text: "Adopting this app for our team has streamlined our project management and improved communication.",
    imageSrc: avatar7.src,
    name: "Jordan Patels",
    username: "@jpatelsdesign",
  },
  {
    text: "With this app, we can easily assign tasks, track progress, and manage documents all in one place.",
    imageSrc: avatar8.src,
    name: "Sam Dawson",
    username: "@dawsontechtips",
  },
  {
    text: "Its user-friendly interface and robust features support our diverse needs perfectly.",
    imageSrc: avatar9.src,
    name: "Casey Harper",
    username: "@casey09",
  },
];

const TestimonialCard = ({ text, imageSrc, name, username }: Testimonial) => (
  <div className="flex-shrink-0 w-[320px] md:w-[380px] p-6 rounded-3xl bg-card/40 backdrop-blur-md border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
    <div className="flex gap-0.5 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <p className="text-foreground/80 leading-relaxed mb-6 font-medium tracking-tight">
      "{text}"
    </p>
    <div className="flex items-center gap-3">
      <div className="relative">
        <Image
          src={imageSrc}
          alt={name}
          width={44}
          height={44}
          className="rounded-full grayscale group-hover:grayscale-0 transition-all duration-500 border-2 border-border/50"
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background flex items-center justify-center">
          <svg className="w-2 h-2 text-primary-foreground fill-current" viewBox="0 0 20 20">
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-sm text-foreground tracking-tight">{name}</span>
        <span className="text-xs text-muted-foreground font-medium">{username}</span>
      </div>
    </div>
  </div>
);

const MarqueeRow = ({
  testimonials,
  direction = "left",
  speed = 40,
}: {
  testimonials: Testimonial[];
  direction?: "left" | "right";
  speed?: number;
}) => (
  <div className="flex overflow-hidden py-4">
    <motion.div
      className="flex gap-6 pr-6"
      animate={{
        x: direction === "left" ? [0, -1920] : [-1920, 0],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{ width: "fit-content" }}
    >
      {[...Array(4)].map((_, i) => (
        <React.Fragment key={i}>
          {testimonials.map((t, idx) => (
            <TestimonialCard key={`${t.username}-${i}-${idx}`} {...t} />
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  </div>
);

export const Testimonials = () => {
  return (
    <section className="bg-background py-32 overflow-hidden relative">
      <div className="container mx-auto px-4 mb-20 relative z-20">
        <div className="max-w-[700px] mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary mb-8"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Testimonials
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-8 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent leading-[1.1]"
          >
            What our amazing users say about us
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground leading-relaxed max-w-[600px] mx-auto"
          >
            From intuitive design to powerful features, our app has become an
            essential tool for users around the world.
          </motion.p>
        </div>
      </div>

      <div className="relative mt-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />
        
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background via-background/80 to-transparent z-30 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background via-background/80 to-transparent z-30 pointer-events-none" />
        
        <div className="flex flex-col gap-6 relative z-20">
          <MarqueeRow testimonials={testimonials.slice(0, 3)} direction="left" speed={45} />
          <MarqueeRow testimonials={testimonials.slice(3, 6)} direction="right" speed={55} />
          <MarqueeRow testimonials={testimonials.slice(6, 9)} direction="left" speed={50} />
        </div>
      </div>
    </section>
  );
};
