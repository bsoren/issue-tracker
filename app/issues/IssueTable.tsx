import { Table } from "@radix-ui/themes/components/index";
import NextLink from "next/link";
import { CustomLink, IssueStatusBadge } from "../components";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Issue, Status } from "@/generated/prisma/client";

const columns: { label: string; value: keyof Issue; className?: string }[] = [
  { label: "Title", value: "title" },
  { label: "Status", value: "status", className: "hidden md:table-cell" },
  {
    label: "Created At",
    value: "createdAt",
    className: "hidden md:table-cell",
  },
  {
    label: "Updated At",
    value: "updatedAt",
    className: "hidden md:table-cell",
  },
];

export const columnNames = columns.map((column) => column.value);

interface Props {
  searchParams: { status: Status; orderBy: keyof Issue; currentPage: string };
  issues: Issue[];
}

const IssueTable = ({ searchParams, issues }: Props) => {
  const { orderBy } = searchParams;
  return (
    <Table.Root size="1" variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell
              key={column.value}
              className={column.className}
            >
              <NextLink
                href={{
                  query: { ...searchParams, orderBy: column.value },
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
            <Table.Cell className="hidden md:table-cell">
              {issue.updatedAt.toLocaleString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default IssueTable;
