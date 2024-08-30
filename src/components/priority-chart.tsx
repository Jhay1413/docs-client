import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  {
    title: "BALAMBAN SEPTIC TANK AND WASTE COLLECTION SERVICES",
    id: "ECC-2024-0001",
    percentage: 80,
  },
  {
    title:
      "PROPOSED PIGGERY WITH WAREHOUSE & BIOGAS DIGESTER PROJECT EXECUTIVE SUMMARY THE PROPOSED PROJECT INVOLVES THE ESTABLISHMENT OF A MOD",
    id: "ECC-2024-0001",
    percentage: 100,
  },
  {
    title: "NC HARDROCK TRADING COMPANY",
    id: "ECC-2024-0001",
    percentage: 100,
  },
  {
    title: "NC HARDROCK TRADING COMPANY",
    id: "ECC-2024-0001",
    percentage: 100,
  },
  { title: "SHIPYARD PROJECT", id: "ECC-2024-0001", percentage: 100 },
  {
    title: "NC HARDROCK TRADING COMPANY",
    id: "ECC-2024-0001",
    percentage: 100,
  },
  {
    title: "NC HARDROCK TRADING COMPANY",
    id: "ECC-2024-0001",
    percentage: 100,
  },
  {
    title: "NC HARDROCK TRADING COMPANY",
    id: "ECC-2024-0001",
    percentage: 100,
  },
  {
    title: "NC HARDROCK TRADING COMPANY",
    id: "ECC-2024-0001",
    percentage: 100,
  },
  { title: "NC HARDROCK TRADING COMPANY", id: "ECC-2024-0001", percentage: 40 },
  {
    title: "NC HARDROCK TRADING COMPANY",
    id: "ECC-2024-0001",
    percentage: 100,
  },
];

const chartConfig = {
  id: {
    label: "ID",
    color: "hsl(var(--chart-1))",
  },
  percentage: {
    label: "Percentage",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function PriorityChart() {
  return (
    <Card className="absolute inset-0 flex flex-col">
      <CardHeader>
        <CardTitle>Priority</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex-grow w-full relative h-full">
        <ChartContainer config={chartConfig} className="absolute h-full w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 100, // Increase the right margin to accommodate labels
            }}
          >
            <YAxis
              dataKey="title"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 12)}
              hide
            />
            <XAxis dataKey="percentage" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="percentage"
              layout="vertical"
              fill="var(--color-id)"
              radius={4}
            >
              <LabelList
                dataKey="id"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="percentage"
                position="right"
                offset={10} // Adjust offset to space out labels from the end of the bars
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground mt-4 font-semibold">
          Showing transaction priority
        </div>
      </CardFooter>
    </Card>
  );
}
