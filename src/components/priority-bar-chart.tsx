import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { z } from "zod"
import { PerApplication } from "@/features/dashboard"

const chartConfig = {
  count: {
    label: "Projects",
    color: "#8CBF3F",
  },
 
} satisfies ChartConfig
const extractAbbreviation = (text: string): string | null => {
  // Match the text inside the first set of parentheses
  const match = text.match(/\(([^)]+)\)/);
  return match ? match[1] : null;
};
export function PriorityBarChart({ data }: { data: z.infer<typeof PerApplication>| undefined }) {


  const transformedArray = data?.data.map(item => ({
    ...item,
    categoryName: extractAbbreviation(item.categoryName) || item.categoryName, // Replace with abbreviation or keep original
  }));
  console.log(transformedArray)
  
  return (
    <Card className=" absolute inset-0 flex flex-col ">
      <CardHeader>
        <CardTitle>Application</CardTitle>
       
      </CardHeader>
      <CardContent className="flex-grow w-full relative h-full ">
        <ChartContainer config={chartConfig} className="absolute h-full w-full ">
          <BarChart accessibilityLayer data={transformedArray}  margin={{
              right: 50,
             // Increase the right margin to accommodate labels
            }}
            className="absolute w-full h-full">
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="categoryName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0,4)}
              
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="count"
              stackId="a"
              fill="var(--color-count)"
              radius={[0, 0, 4, 4]}
            />
            
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
       
        <div className="leading-none text-muted-foreground">
          Showing total each application
        </div>
      </CardFooter>
    </Card>
  )
}