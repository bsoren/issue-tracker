"use client";

import type { Issue } from "@/generated/prisma/client";
import axios from "axios";
import dynamic from "next/dynamic";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import IssueFormSkeleton from "../../_components/IssueFormSkeleton";

const IssueForm = dynamic(() => import("../../_components/IssueForm"), {
  ssr: false,
  loading: () => <IssueFormSkeleton />,
});

type EditableIssue = Pick<Issue, "id" | "title" | "description">;
type LoadState =
  | { id: string; status: "loading" | "not-found" | "error" }
  | { id: string; status: "loaded"; issue: EditableIssue };

const EditIssuePage = () => {
  const { id } = useParams<{ id: string }>();
  const [loadState, setLoadState] = useState<LoadState>({ id, status: "loading" });

  useEffect(() => {
    if (!Number.isInteger(Number(id)) || Number(id) < 1) {
      setLoadState({ id, status: "not-found" });
      return;
    }

    const controller = new AbortController();
    setLoadState({ id, status: "loading" });

    axios
      .get<EditableIssue>(`/api/issues/${encodeURIComponent(id)}`, {
        signal: controller.signal,
      })
      .then(({ data }) => setLoadState({ id, status: "loaded", issue: data }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setLoadState({
          id,
          status:
            axios.isAxiosError(error) && error.response?.status === 404
              ? "not-found"
              : "error",
        });
      });

    return () => controller.abort();
  }, [id]);

  if (loadState.id !== id || loadState.status === "loading")
    return <IssueFormSkeleton />;
  if (loadState.status === "not-found") notFound();
  if (loadState.status === "error")
    return <div role="alert">Unable to load issue. Please try again.</div>;
  if (loadState.status !== "loaded") return <IssueFormSkeleton />;

  return <IssueForm issue={loadState.issue} />;
};

export default EditIssuePage;
