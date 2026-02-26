"use client";

import { useState } from "react";
import { OnboardingProgress } from "@/components/sections/onboarding/onboarding-progress";
import { ProjectStep } from "@/components/sections/onboarding/steps/project-step";
import { CategoriesStep } from "@/components/sections/onboarding/steps/categories-step";
import { AttributesStep } from "@/components/sections/onboarding/steps/attributes-step";

export type ProjectFormData = {
  name: string;
  description?: string;
  location?: string;
};

export function OnboardingFlow() {
  const [step, setStep] = useState(1);

  const [projectData, setProjectData] = useState<ProjectFormData | null>(null);

  const [categories, setCategories] = useState<string[]>([]);

  return (
    <div className="container mx-auto">
      <OnboardingProgress
        currentStep={step}
        steps={[
          { label: "General" },
          { label: "Categories" },
          { label: "Attributes" },
        ]}
      />

      {step === 1 && (
        <ProjectStep
          defaultValues={projectData || undefined}
          onNext={(data) => {
            setProjectData(data);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <CategoriesStep
          initialCategories={categories}
          onBack={() => setStep(1)}
          onNext={(cats) => {
            setCategories(cats);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <AttributesStep
          categories={categories}
          onBack={() => setStep(2)}
          onComplete={() => {
            console.log("Final payload:", {
              projectData,
              categories,
            });
          }}
        />
      )}
    </div>
  );
}
