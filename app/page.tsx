import { Flex, Grid } from "@radix-ui/themes";
import IssueBarChart from "./IssueBarChart";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./LatestIssues";

export default function Home() {
  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Flex direction="column" gap="5" justify="between">
        <IssueSummary open={10} inProgress={20} closed={30} />
        <IssueBarChart open={10} inProgress={20} closed={30} />
      </Flex>
      <LatestIssues />
    </Grid>
  );
}
