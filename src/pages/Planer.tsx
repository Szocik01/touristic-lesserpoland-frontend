import { MapProvider } from "react-map-gl/maplibre";
import OnMapPanel from "../components/planer/OnMapPanel";
import PlanerMap from "../components/planer/PlanerMap";

const Planer = () => {

  return (
    <MapProvider>
      <div className="planer-container">
        <OnMapPanel/>
        <PlanerMap/>
      </div>
    </MapProvider>
  );
};

export default Planer;
