import { MainChart } from "../chart/MainChart"
import { SecondaryChart } from "../chart/SecondaryChart"
import { RadarChartComponent } from "../chart/RadarChart"

export const Analytics = () => {
  return (
    <div className="flex flex-col h-full gap-4 p-4 overflow-auto">
      <MainChart />
      <div className="flex flex-row gap-4">
        <SecondaryChart />
        <RadarChartComponent />
      </div>
    </div>
  )
}
