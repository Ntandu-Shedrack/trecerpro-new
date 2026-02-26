"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";

export type OnboardingStep = {
  label: string;
};

interface OnboardingProgressProps {
  steps: OnboardingStep[];
  currentStep: number; // 1-based index
  className?: string;
}

export function OnboardingProgress({
  steps,
  currentStep,
  className,
}: OnboardingProgressProps) {
  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("w-full py-20 px-6 max-w-4xl mx-auto", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-primary">
          Onboarding Progress
        </span>
        <span className="text-sm font-medium text-muted">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="h-2" />

      {/* Step Indicators */}
      <div className="flex justify-between mt-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={step.label} className="flex flex-col items-center flex-1">
              {/* Circle */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all",
                  isCompleted && "bg-primary/20 text-primary",
                  isActive && "bg-primary text-white",
                  !isCompleted && !isActive && "bg-muted text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-semibold">{stepNumber}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive ? "text-primary font-bold" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
