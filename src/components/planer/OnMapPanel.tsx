import { Tab, Tabs } from "@mui/material";
import ContentPanel from "../utils/ContentPanel";
import { ChevronRight, Route, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import PlanTrip from "./PlanTrip";
import SearchTrip from "./SearchTrip";
import { useMap } from "react-map-gl/maplibre";

const OnMapPanel = () => {
  const [tabActive, setTabActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const { "planer-map": planerMap } = useMap();
  return (
    <ContentPanel cssClass={`on-map-panel ${expanded ? "expanded" : ""}`}>
      <button
        className={`expand-panel-button`}
        onClick={() => {
          setExpanded((prevValue) => !prevValue);
        }}
      >
        <ChevronRight className="icon" />
      </button>
      <Tabs
        sx={{ padding: "1rem", flexShrink: 0,  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.125)"}}
        value={tabActive}
        variant="fullWidth"
        onChange={(_, value) => {
          setTabActive(value);
        }}
      >
        <Tab icon={<Route />} iconPosition="start" label="Zaplanuj" value={0} />
        <Tab
          icon={<Search />}
          iconPosition="start"
          label="Wyszukaj"
          value={1}
        />
      </Tabs>
      <div className="on-map-panel-content">
        {tabActive === 0 && <PlanTrip map={planerMap} />}
        {tabActive === 1 && <SearchTrip map={planerMap} />}
      </div>
    </ContentPanel>
  );
};

export default OnMapPanel;
