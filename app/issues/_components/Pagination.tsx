"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  pageSize: number;
  itemsCount: number;
  currentPage: number;
}

const Pagination = ({ currentPage, pageSize, itemsCount }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const totalPage = Math.ceil(itemsCount / pageSize);

  const changePage = (currentPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("currentPage", currentPage.toString());
    router.push("?" + params.toString());
  };

  return (
    <Flex align="center" gap="1">
      <Button
        color="gray"
        variant="soft"
        disabled={currentPage === 1}
        onClick={() => changePage(1)}
      >
        <DoubleArrowLeftIcon />
      </Button>
      <Button
        color="gray"
        variant="soft"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
      >
        <ChevronLeftIcon />
      </Button>
      <Text size="2">
        {currentPage} / {totalPage}
      </Text>
      <Button color="gray" variant="soft" disabled={currentPage === totalPage}>
        <ChevronRightIcon onClick={() => changePage(currentPage + 1)} />
      </Button>
      <Button color="gray" variant="soft" disabled={currentPage === totalPage}>
        <DoubleArrowRightIcon onClick={() => changePage(totalPage)} />
      </Button>
    </Flex>
  );
};

export default Pagination;
