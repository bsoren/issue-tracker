import { Flex, Grid } from "@radix-ui/themes";
import IssueBarChart from "./IssueBarChart";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const open = await prisma.issue.count({
    where: {
      status: "OPEN",
    },
  });

  const inProgress = await prisma.issue.count({
    where: {
      status: "IN_PROGRESS",
    },
  });

  const closed = await prisma.issue.count({
    where: {
      status: "CLOSED",
    },
  });

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Flex direction="column" gap="5" justify="between">
        <IssueSummary open={open} inProgress={inProgress} closed={closed} />
        <IssueBarChart open={open} inProgress={inProgress} closed={closed} />
      </Flex>
      <LatestIssues />
    </Grid>
  );
}

export const metadata: Metadata = {
  title: "Issue Tracker - Dashborad",
  description: "View summary of project issues",
};
