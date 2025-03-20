
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import React, { FC } from "react";

type ConfirmDialogProps = {
  isVisible: boolean;
  title: string;
  description: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCancel: () => void;
  onClose: () => void;
};

const ConfirmDialog: FC<ConfirmDialogProps> = (props) => {
  const {
    isVisible,
    title,
    description,
    onConfirm,
    onCancel,
    onClose,
    cancelButtonText,
    confirmButtonText,
  } = props;

  return (
    <div>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        open={isVisible}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isVisible}>
          <div className="confirm-modal">
            <h4 className="modal-title" id="modal-title">
              {title}
            </h4>
            <div id="modal-description" className="modal-description">
              {description}
            </div>
            <div className="button-container">
              <Button variant="contained" color="success" onClick={onConfirm}>
                {confirmButtonText}
              </Button>
              <Button variant="contained" color="error" onClick={onCancel}>
                {cancelButtonText}
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default ConfirmDialog;


