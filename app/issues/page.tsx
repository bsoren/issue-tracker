import { prisma } from "@/lib/prisma";
import { Table } from "@radix-ui/themes";
import delay from "delay";
import IssueActions from "./IssueActions";
import { CustomLink, IssueStatusBadge } from "@/app/components";
import { Status } from "@/generated/prisma/enums";
import { Issue } from "@/generated/prisma/client";
import NextLink from "next/link";
import { ArrowUpIcon } from "@radix-ui/react-icons";

interface Props {
  searchParams: Promise<{ status: Status; orderBy: keyof Issue }>;
}

const IssuePage = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const status = Object.values(Status).includes(params.status)
    ? params.status
    : undefined;

  const columns: { label: string; value: keyof Issue; className?: string }[] = [
    { label: "Title", value: "title" },
    { label: "Status", value: "status", className: "hidden md:table-cell" },
    { label: "Created At", value: "createdAt" },
  ];

  const orderBy = columns.map((column) => column.value).includes(params.orderBy)
    ? params.orderBy
    : undefined;

  const issues = await prisma.issue.findMany({
    where: {
      status,
    },
    ...(orderBy !== undefined ? { orderBy: { [orderBy]: "asc" } } : {}),
  });

  return (
    <div className="mx-4">
      <IssueActions />
      <Table.Root size="1" variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell key={column.value}>
                <NextLink
                  href={{
                    query: { ...params, orderBy: column.value },
                  }}
                >
                  {column.label}
                </NextLink>
                {column.value === orderBy && <ArrowUpIcon className="inline" />}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.RowHeaderCell>
                <CustomLink href={`/issues/${issue.id}`}>
                  {issue.title}
                </CustomLink>
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.RowHeaderCell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toLocaleString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default IssuePage;
