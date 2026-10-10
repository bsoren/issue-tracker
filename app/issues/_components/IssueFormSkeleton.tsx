import Skeleton from "@/app/components/Skeleton";
import { Box } from "@radix-ui/themes";

const IssueFormSkeleton = () => {
  return (
    <Box className="max-w-xl ">
      <Skeleton baseColor="grey" height="3rem" />
      <Skeleton baseColor="grey" height="20rem" />
    </Box>
  );
};

export default IssueFormSkeleton;
