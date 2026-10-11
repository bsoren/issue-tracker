"use client";

import { Status } from "@/generated/prisma/enums";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  open: number;
  inProgress: number;
  closed: number;
}

const IssueBarChart = ({ open, inProgress, closed }: Props) => {
  const data: { label: string; value: number; status: Status }[] = [
    { label: "Open", value: open, status: "OPEN" },
    { label: "In Progress", value: inProgress, status: "IN_PROGRESS" },
    { label: "Closed", value: closed, status: "CLOSED" },
  ];

  return (
    <BarChart
      style={{
        width: "100%",
        maxWidth: "700px",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid />
      <XAxis dataKey="label" />
      <YAxis width="auto" />
      <Tooltip />
      {/* <Legend /> */}
      <Bar
        dataKey="value"
        radius={[10, 10, 0, 0]}
        barSize={60}
        style={{ fill: "var(--accent-10)" }}
      />
    </BarChart>
  );
};

export default IssueBarChart;
