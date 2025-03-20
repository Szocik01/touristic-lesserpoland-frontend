import { Button, TextField } from "@mui/material";
import useHttp from "../../hooks/useHttp";
import { API_CALL_URL_BASE } from "../../utils/constants";
import { useState } from "react";
import { AddTripCommentBody, TripCommentDTO } from "../../types/api/trips";
import { Add } from "@mui/icons-material";

type AddCommentProps = {
  onAddComment: (comment: TripCommentDTO) => void;
  token: string;
  tripId: string;
};

const AddComment = (props: AddCommentProps) => {
  const [comment, setComment] = useState("");

  const { onAddComment, token, tripId } = props;

  const [sendCommentRequest] = useHttp(
    `${API_CALL_URL_BASE}/add-trip-comment`,
    false
  );

  function handleCommentResponse(response: Response) {
    if (!response.ok) {
      throw new Error("Nie udało się dodać komentarza");
    }
    return response.json().then((data: TripCommentDTO) => {
      onAddComment(data);
      setComment("");
    });
  }

  function handleCommentError(error: Error) {
    console.error(error);
  }

  return (
    <div className="add-comment">
      <TextField
        label="Twój komentarz"
        fullWidth
        multiline
        rows={3}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      <Button
        sx={{ flexShrink: 0 }}
        variant="contained"
        disabled={comment === ""}
        type="button"
        onClick={() => {
          if (comment === "") return;
          const commentBody: AddTripCommentBody = {
            tripId,
            content: comment,
          };
          sendCommentRequest(handleCommentResponse, handleCommentError, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify(commentBody),
          });
        }}
        startIcon={<Add />}
      >
        dodaj komentarz
      </Button>
    </div>
  );
};

export default AddComment;
