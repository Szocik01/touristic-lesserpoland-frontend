import { Paper } from "@mui/material";
import ContentLoading from "./ContentLoading";

type ContentPanelProps = {
  isLoading?: boolean;
  cssClass?: string;
};

const ContentPanel = (props: React.PropsWithChildren<ContentPanelProps>) => {
  const { children, isLoading, cssClass } = props;

  return (
    <Paper
      square={false}
      className={`content-panel ${cssClass ? cssClass : ""}`}
      elevation={3}
    >
      {isLoading && <ContentLoading blurOverlay coverParent />}
      {children}
    </Paper>
  );
};

export default ContentPanel;
