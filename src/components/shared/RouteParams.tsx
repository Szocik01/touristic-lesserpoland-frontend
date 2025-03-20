import { AccessTime, ArrowDownward, ArrowUpward, Timeline } from "@mui/icons-material";
import RouteUnitConverter from "../../utils/routeUnitsConverter";

type RouteParamsProps = {
    distance: number
    time: number
    ascend: number
    descend: number
}

const RouteParams = (props: RouteParamsProps) => {

    const { distance, time, ascend, descend } = props

  return (
    <div className="route-params">
      <div className="route-params-entry">
        <Timeline /> <span>Długość trasy:</span>
        {RouteUnitConverter.convertMetersToKilometers(distance)} km
      </div>
      <div className="route-params-entry">
        <AccessTime /> <span>Czas na przebycie trasy:</span>
        {RouteUnitConverter.convertTimeToString(time)}
      </div>
      <div className="route-params-entry">
        <ArrowUpward /> <span>Suma wzniesień:</span> {ascend.toFixed(2)} m
      </div>
      <div className="route-params-entry">
        <ArrowDownward /> <span>Suma spadków:</span> {descend.toFixed(2)}{" "}
        m
      </div>
    </div>
  );
};


export default RouteParams;