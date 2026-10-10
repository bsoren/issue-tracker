"use client";

import { Button, Callout, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
// import SimpleMDE from "react-simplemde-editor";
import dynamic from "next/dynamic";

import CreateIssueSchema from "@/app/api/issues/schema";
import ErrorMessage from "@/app/components/ErrorMessage";
import InlineSpinner from "@/app/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { Issue } from "@/generated/prisma/client";
import delay from "delay";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type IssueFormData = z.infer<typeof CreateIssueSchema>;

const IssueForm = ({ issue }: { issue?: Pick<Issue, "id" | "title" | "description"> }) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(CreateIssueSchema),
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    console.log(`Submitting data ${data}`);

    try {
      setIsSubmitting(true);
      await delay(500);

      if (issue) {
        await axios.patch(`/api/issues/${issue.id}`, JSON.stringify(data));
      } else {
        await axios.post("/api/issues", JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      }
      router.push("/issues");
      router.refresh();
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="flex-row space-y-6" onSubmit={onSubmit}>
        <TextField.Root
          placeholder="Enter title..."
          defaultValue={issue?.title}
          {...register("title")}
        ></TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller
          name="description"
          control={control}
          defaultValue={issue?.description}
          render={({ field }) => (
            <SimpleMDE placeholder="Enter description..." {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button disabled={isSubmitting}>
          {issue ? "Update Issue" : "Submit New Issue "}{" "}
          {<InlineSpinner isSubmitting={isSubmitting} />}
        </Button>
      </form>
    </div>
  );
};

export default IssueForm;
