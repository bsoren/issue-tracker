import IssueStatusBadge from "@/app/components/IssueStatusBadge";
import { prisma } from "@/lib/prisma";
import { Box, Button, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import delay from "delay";
import { notFound } from "next/navigation";
import ReactMarkDown from "react-markdown";
import { Pencil2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Issue } from "@/generated/prisma/client";

const IssueDetailsPage = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}) => {
    const { id } = await params;

    // fetch issue
    const issue = await prisma.issue.findUnique({
        where: { id: parseInt(id) },
    });

    if (!issue) notFound();

    await delay(500);

    return (
        <Grid columns={{ initial: "1", md: "2" }} gap="4">
            <Box>
                <Heading>{issue.title}</Heading>
                <Flex gap="4" my="2">
                    <IssueStatusBadge status={issue.status} />
                    <Text>{issue?.createdAt.toLocaleString()}</Text>
                </Flex>

                <Card className="prose" mt="5">
                    <ReactMarkDown>{issue.description}</ReactMarkDown>
                </Card>
            </Box>
            <Box>
                <Button>
                    <Pencil2Icon />
                    <Link href={`/issues/${issue.id}/edit`}>Edit Issue</Link>
                </Button>
            </Box>
        </Grid>
    );
};

export default IssueDetailsPage;
