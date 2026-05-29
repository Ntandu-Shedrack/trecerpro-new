"use client";

import MappingStep from "@/components/dashboard/bulk-upload/mapping-step";
import ReviewStep from "@/components/dashboard/bulk-upload/review-step";
import UploadStep from "@/components/dashboard/bulk-upload/upload-step";
import ValidationStep from "@/components/dashboard/bulk-upload/validation-step";
import { useState } from "react";

export default function BulkUploadPage() {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="mx-auto py-10 px-6">
      {step === 1 && <UploadStep next={next} />}
      {step === 2 && <MappingStep next={next} prev={prev} />}
      {step === 3 && <ValidationStep next={next} prev={prev} />}
      {step === 4 && (
        <ReviewStep
          prev={prev}
          next={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </div>
  );
}
