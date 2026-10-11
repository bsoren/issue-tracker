import { Issue } from "@/generated/prisma/client";
import { Status } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { Flex } from "@radix-ui/themes";
import IssueActions from "./IssueActions";

import Pagination from "./_components/Pagination";
import IssueTable, { columnNames } from "./IssueTable";

interface Props {
  searchParams: Promise<{
    status: Status;
    orderBy: keyof Issue;
    currentPage: string;
  }>;
}

const IssuePage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const status = Object.values(Status).includes(params.status)
    ? params.status
    : undefined;

  const orderBy = columnNames.includes(params.orderBy)
    ? params.orderBy
    : undefined;

  const pageSize = 5;
  const currentPage = parseInt(params.currentPage) || 1;

  const issuesCount = await prisma.issue.count({
    where: {
      status,
    },
  });

  const issues = await prisma.issue.findMany({
    where: {
      status,
    },
    ...(orderBy !== undefined
      ? { orderBy: { [orderBy]: "asc" } }
      : { orderBy: { title: "asc" } }),
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return (
    <Flex direction="column" gap="3" className="mx-4">
      <IssueActions />
      <IssueTable searchParams={params} issues={issues} />
      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        itemsCount={issuesCount}
      />
    </Flex>
  );
};

export default IssuePage;
