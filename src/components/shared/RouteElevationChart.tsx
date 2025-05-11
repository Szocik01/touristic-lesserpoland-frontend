import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LatLng, LatLngAlt } from "../../types/api/trips";
import distance from "@turf/distance";
import { CategoricalChartState } from "recharts/types/chart/types";

type RouteElevationChartProps = {
  coordinates: LatLngAlt[];
  onMouseLeave?: () => void;
  onMouseMove?: (event: CategoricalChartState) => void;
  height?: number;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="x-value">Kilometr na trasie: {`${label} km`}</div>
        <div className="y-value">Przewyższenie:{`${payload[0].value} m`}</div>
      </div>
    );
  }

  return null;
};

const RouteElevationChart = (props: RouteElevationChartProps) => {
  const { coordinates, onMouseLeave, onMouseMove, height } = props;

  let currentCumulativeDistanceFromBeggining = 0;

  const data = coordinates.filter((coordinate) => {
    return coordinate.length > 2;
  });

  const mappedData = data.map((coordinate, index, coordinates) => {
    currentCumulativeDistanceFromBeggining +=
      index === 0
        ? 0
        : distance(
            coordinates[index - 1].slice(0, 2) as LatLng,
            coordinate.slice(0, 2) as LatLng,
            { units: "kilometers" }
          );
    return {
      lat: coordinate[0],
      lng: coordinate[1],
      alt: coordinate[2],
      distanceFromBeginning: currentCumulativeDistanceFromBeggining.toFixed(2),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={height || 200}>
      <AreaChart
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        data={mappedData}
        margin={{ top: 10, right: 25, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00B86E" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#00B86E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis unit={"m"} domain={["dataMin", "auto"]} />
        <XAxis
          unit={"km"}
          interval={"preserveEnd"}
          minTickGap={20}
          dataKey="distanceFromBeginning"
          dy={10}
        />
        <Tooltip content={<CustomTooltip />} />
        <CartesianGrid strokeDasharray="8 8" />
        <Area
          type="monotone"
          dataKey="alt"
          stroke="#00B86E"
          fillOpacity={1}
          fill="url(#color)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RouteElevationChart;
