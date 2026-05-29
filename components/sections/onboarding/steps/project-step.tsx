"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type ProjectForm = {
  name: string;
  description?: string;
  location?: string;
};

interface Props {
  defaultValues?: ProjectForm;
  onNext: (data: ProjectForm) => void;
}

export function ProjectStep({ defaultValues, onNext }: Props) {
  const { register, handleSubmit } = useForm<ProjectForm>({
    defaultValues,
  });

  return (
    <Card className="max-w-4xl py-10 px-6 mx-auto bg-white border border-slate-200">
      <CardContent className="space-y-6 p-10">
        <div className="text-center">
          <h1 className="text-2xl text-slate-900 font-bold">Project Setup</h1>
          <p className="text-muted mt-2">
            Define the workspace where assets will be tracked.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Project Name"
            className="text-muted border border-muted-foreground/50"
            {...register("name", { required: true })}
          />
          <Textarea
            rows={3}
            placeholder="Description"
            className="text-muted border border-muted-foreground/50"
            {...register("description")}
          />
          <Input
            placeholder="Primary Location"
            {...register("location")}
            className="text-muted border border-muted-foreground/50"
          />
        </div>
      </CardContent>

      <CardFooter className="justify-end p-6">
        <Button className="text-white" onClick={handleSubmit(onNext)}>
          Next: Categories
        </Button>
      </CardFooter>
    </Card>
  );
}
