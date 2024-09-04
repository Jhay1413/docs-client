import { DatabaseBackup, TrendingUp } from "lucide-react";
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
import { z } from "zod";
import { PrioritySchema } from "@/features/dashboard/schema/dashboardSchema";

const chartConfig = {
  transactionId: {
    label: "ID",
    color: "#8CBF3F",
  },
  percentage: {
    label: "Percentage",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function PriorityChart({
  data,
}: {
  data: z.infer<typeof PrioritySchema> | undefined;
}) {
  const convertedData = data?.data.map((item) => ({
    ...item,
    percentage: parseInt(item.percentage, 10), // Convert to integer
  }));

  if (convertedData?.length === 0) {
    return (
      <div className=" gap-12 flex-col w-full h-full flex items-center  bg-white rounded-md">
        <div className="flex w-full p-4">
          <h1 className="text-2xl font-bold">Priority</h1>
        </div>

        <DatabaseBackup size={48} className="text-muted-foreground" />
        <h1 className="text-4xl text-muted-foreground">No Data</h1>
      </div>
    );
  }

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
            data={convertedData}
            layout="vertical"
            margin={{
              right: 100,
              // Increase the right margin to accommodate labels
            }}
          >
            <YAxis
              dataKey="projectName"
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
              fill="var(--color-transactionId)"
              radius={4}
            >
              <LabelList
                dataKey="transactionId"
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
