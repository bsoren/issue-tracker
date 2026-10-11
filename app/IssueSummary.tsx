import { Status } from "@/generated/prisma/enums";
import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";

interface Props {
  open: number;
  inProgress: number;
  closed: number;
}

const IssueSummary = ({ open, inProgress, closed }: Props) => {
  const issues: { label: string; value: number; status: Status }[] = [
    { label: "Open", value: open, status: "OPEN" },
    { label: "In Progress", value: inProgress, status: "IN_PROGRESS" },
    { label: "Closed", value: closed, status: "CLOSED" },
  ];
  return (
    <Flex gap="6">
      {issues.map((issue) => (
        <Card className="border-2 border-gray-300 w-50">
          <Flex direction="column">
            <Link
              className="font-medium text-sm"
              href={`/issues?status=${issue.status}`}
            >
              {issue.label}
            </Link>
            <Text size="5" weight="bold">
              {issue.value}
            </Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default IssueSummary;
