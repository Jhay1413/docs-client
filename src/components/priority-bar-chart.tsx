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
const chartData = [
  { application: "ECC", value: 186, mobile: 80 },
  { application: "DP", value: 305, mobile: 200 },
  { application: "PCO", value: 237, mobile: 120 },
  { application: "HWID", value: 73, mobile: 190 },
  { application: "CNC", value: 209, mobile: 130 },
  { application: "PO", value: 214, mobile: 140 },
]
const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
 
} satisfies ChartConfig
export function PriorityBarChart() {
  return (
    <Card className=" absolute inset-0 flex flex-col">
      <CardHeader>
        <CardTitle>Application</CardTitle>
       
      </CardHeader>
      <CardContent className="flex-grow w-full relative h-full">
        <ChartContainer config={chartConfig} className="absolute h-full w-full  ">
          <BarChart accessibilityLayer data={chartData} margin={{
              right: 40, // Increase the right margin to accommodate labels
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="application"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="value"
              stackId="a"
              fill="var(--color-value)"
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