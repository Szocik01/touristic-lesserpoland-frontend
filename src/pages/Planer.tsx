import { MapProvider } from "react-map-gl/maplibre";
import OnMapPanel from "../components/planer/OnMapPanel";
import PlanerMap from "../components/planer/PlanerMap";
import MapButtons from "../components/shared/MapButtons";

const Planer = () => {

  return (
    <MapProvider>
      <div className="planer-container">
        <MapButtons/>
        <OnMapPanel/>
        <PlanerMap/>
      </div>
    </MapProvider>
  );
};

export default Planer;
