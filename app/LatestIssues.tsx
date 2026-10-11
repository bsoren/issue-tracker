import { Status } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { Avatar, Card, Flex, Heading, Table, Text } from "@radix-ui/themes";
import { IssueStatusBadge } from "./components";
import Link from "next/link";

const LatestIssues = async () => {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: "asc" },
    take: 5,
    include: {
      assignedToUser: true,
    },
  });

  return (
    <Card>
      <Heading mb="5">Latest issues</Heading>
      <Table.Root>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row>
              <Table.Cell>
                <Flex justify="between">
                  <Flex direction="column">
                    <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                    <IssueStatusBadge status={Status.OPEN} />
                  </Flex>
                  <Avatar
                    src={issue.assignedToUser?.image ?? undefined}
                    fallback="?"
                    radius="full"
                    size="2"
                  />
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default LatestIssues;
