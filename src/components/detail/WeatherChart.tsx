import {
  Area,
  AreaChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PointWeatherDTO } from "../../types/api/trips";
import { useMemo } from "react";
import { weatherIdMap } from "../../utils/weatherUtils";

type WeatherChartProps = {
  height?: number;
  hourlyWeather: PointWeatherDTO[];
};

const CustomWeatherTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    console.log("payload", payload);
    return (
      <div className="custom-tooltip weather-tooltip">
        <div className="weather-icon-container">
            <img src={weatherIdMap[payload[0].payload.weatherCode]} alt="" />
        </div>
        <div className="x-value">Data: {`${label}`}</div>
        <div className="y-value">
          Temperatura: {`${payload[0].payload.temperature}`}&deg;C
        </div>
        <div className="y-value">
          Suma opadów: {`${payload[0].payload.precipitationSum}`}mm
        </div>
        <div className="y-value">
          Prędkość wiatru: {`${payload[0].payload.windSpeed}`}km/h
        </div>
      </div>
    );
  }

  return null;
};

const WeatherChart = (props: WeatherChartProps) => {
  const { height, hourlyWeather } = props;

  const mappedData = useMemo(() => {
      return hourlyWeather.map((weather) => ({
        date: [weather.date, weather.hour].join(" "),
        temperature: parseFloat(weather.temperature.toFixed(1)),
        weatherCode: weather.weatherCode,
        precipitationSum: parseFloat(weather.precipitationSum.toFixed(2)),
        windSpeed: weather.windSpeed.toFixed(1),
      }))
  }, [hourlyWeather]);


  return (
    <ResponsiveContainer className={"weather-responsive-chart-container"} width="100%" height={height || 200}>
      <ComposedChart
        data={mappedData}
        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="weather-color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fcdf03" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#fcdf03" stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis yAxisId="left" unit={"°C"} domain={["dataMin", "auto"]} />
        <YAxis yAxisId="right" orientation="right" />
        <XAxis interval={"preserveStartEnd"} dy={10} minTickGap={130} dataKey="date" />
        <Tooltip content={<CustomWeatherTooltip />} />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="precipitationSum"
          stroke="#8884d8"
          dot={false}
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="temperature"
          stroke="#fcdf03"
          fillOpacity={1}
          fill="url(#weather-color)"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default WeatherChart;
