import { useState } from "react";
import { TripWeatherDTO } from "../../types/api/trips";
import { Button } from "@mui/material";
import { weatherIdMap } from "../../utils/weatherUtils";
import { Air, ChevronRight, WaterDrop } from "@mui/icons-material";
import IconBadge from "../shared/IconBadge";
import DefaultDialog from "../utils/DefaultDialog";
import WeatherChart from "./WeatherChart";

type WeatherProps = {
  weatherForecast: TripWeatherDTO;
};

const dayNames = ["dziś", "jutro", "pojutrze"];

export const Weather = (props: WeatherProps) => {
  const { weatherForecast } = props;

  const [openedDay, setOpenedDay] = useState<number>(0);
  const [openWeatherDialog, setOpenWeatherDialog] = useState<boolean>(false);

  return (
    <>
      <div className="weather-container">
        <h2 className="weather-title">Sprawdź pogodę na trasie</h2>
        <div className="weather-tabs">
          {weatherForecast.daily.map((_, index) => {
            return (
              <Button
                key={index}
                onClick={() => {
                  setOpenedDay(index);
                }}
                className={`${openedDay === index ? "active" : ""}`}
                variant="contained"
              >
                Punkt {String.fromCharCode(65 + index)}
              </Button>
            );
          })}
          <Button
            variant="outlined"
            endIcon={<ChevronRight />}
            onClick={() => setOpenWeatherDialog(true)}
          >
            Szczegóły
          </Button>
        </div>
        <div className="weather-tab-contents-container">
          {weatherForecast?.daily.map((day, index) => {
            return (
              <div
                key={`${index}-tab-content`}
                className={`weather-tab-content ${
                  openedDay === index ? "active" : ""
                }`}
              >
                {day.map((dayWeather, dayIndex) => {
                  return (
                    <div
                      className="weather-card"
                      key={`${dayIndex}-weather-card`}
                    >
                      <IconBadge
                        size="small"
                        cssClass="point-badge"
                        icon={String.fromCharCode(65 + index)}
                      />
                      <div className="temperature">
                        {Math.round(dayWeather.temperature)}&deg;C
                      </div>
                      <img
                        src={weatherIdMap[dayWeather.weatherCode.toString()]}
                      />
                      <div className="date">
                        <span>{dayWeather.date}</span> {dayNames[dayIndex]}
                      </div>
                      <div className="weather-param">
                        <WaterDrop />
                        {dayWeather.precipitationSum.toFixed(1)} mm
                      </div>
                      <div className="weather-param">
                        <Air />
                        {dayWeather.windSpeed.toFixed(1)} km/h
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <DefaultDialog
        title="Szczegóły pogody"
        fullWidth
        maxWidth="md"
        onClose={() => {
          setOpenWeatherDialog(false);
        }}
        open={openWeatherDialog}
      >
        <div className="weather-detail-dialog-body">
          {weatherForecast.hourly.map((hourlyWeatherForDay, index) => {
            return (
              <>
                <div className="weather-detail-dialog-header-container">
                  <IconBadge
                    size="small"
                    cssClass="point-badge"
                    icon={String.fromCharCode(65 + index)}
                  />
                  <h3>Pogoda w punkcie {String.fromCharCode(65 + index)}</h3>
                </div>
                <WeatherChart
                  height={170}
                  hourlyWeather={hourlyWeatherForDay}
                />
              </>
            );
          })}
        </div>
      </DefaultDialog>
    </>
  );
};
