import { Button, Flex, Skeleton } from "@radix-ui/themes";
import Link from "next/link";
import { Suspense } from "react";
import IssueFilter from "./IssueFilter";

const IssueActions = () => {
  return (
    <Flex justify="between">
      <Suspense fallback={<Skeleton width="140px" height="32px" />}>
        <IssueFilter />
      </Suspense>
      <Button>
        <Link href="/issues/new">New Issue</Link>
      </Button>
    </Flex>
  );
};

export default IssueActions;
