import { Close } from "@mui/icons-material";
import { Button, Dialog, Fab } from "@mui/material";
import { PropsWithChildren } from "react";
import ContentLoading from "./ContentLoading";

type DefaultDialogProps = {
  title?: string;
  open: boolean;
  onClose: () => void;
  fullWidth?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
};

const DefaultDialog = (props: PropsWithChildren<DefaultDialogProps>) => {
  const { children, title, open, onClose, fullWidth, maxWidth, loading } =
    props;
  return (
    <Dialog
      className="default-dialog"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
    >
      {loading && <ContentLoading blurOverlay coverParent />}

      <div className="inner-dialog">
        <Button variant="text" onClick={onClose} className="close-button">
          <Close />
        </Button>
        {title && <div className="dialog-header">{title}</div>}
        <div className="dialog-body">{children}</div>
      </div>
    </Dialog>
  );
};

export default DefaultDialog;
