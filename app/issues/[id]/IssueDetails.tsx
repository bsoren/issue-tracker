import { IssueStatusBadge } from "@/app/components";
import { Issue } from "@/generated/prisma/client";
import { Heading, Flex, Card, Text, Box } from "@radix-ui/themes";
import ReactMarkDown from "react-markdown";

const IssueDetails = ({ issue }: { issue: Issue }) => {
  return (
    <Box className="border-2">
      <Heading>{issue.title}</Heading>
      <Flex gap="4" my="2">
        <IssueStatusBadge status={issue.status} />
        <Text>{issue?.createdAt.toLocaleString()}</Text>
      </Flex>

      <Card className="prose" mt="5">
        <ReactMarkDown>{issue.description}</ReactMarkDown>
      </Card>
    </Box>
  );
};

export default IssueDetails;
