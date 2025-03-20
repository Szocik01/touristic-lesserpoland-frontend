import { Close, CommentRounded, Delete, Done, Edit } from "@mui/icons-material";
import { TripCommentDTO } from "../../types/api/trips";
import SelectableButton from "../shared/SelectableButton";
import { TextField } from "@mui/material";

type CommentProps = {
  comment: TripCommentDTO;
  userId?: string;
  editMode?: boolean;
  onDeleteButtonClick?: (id: string) => void;
  editValue?: string;
  onConfirmEdit?: (id: string, value: string) => void;
  onCloseEdit?: () => void;
  onEditModeButtonClick?: (value: string) => void;
  onEditValueChange?: (value: string) => void;
};

const Comment = (props: CommentProps) => {
  const {
    comment,
    userId,
    editMode,
    onDeleteButtonClick,
    editValue,
    onEditModeButtonClick,
    onEditValueChange,
    onConfirmEdit,
    onCloseEdit,
  } = props;
  return (
    <>
      {!editMode && (
        <li key={comment.id} className="comment">
          {userId == comment.userId && (
            <div className="edit-buttons">
              <SelectableButton
                icon={<Delete fontSize="small" />}
                elevated
                cssClass="delete-button"
                onClick={() => {
                  onDeleteButtonClick?.(comment.id);
                }}
              />
              <SelectableButton
                icon={<Edit fontSize="small" />}
                elevated
                cssClass="edit-button"
                onClick={() => {
                  onEditModeButtonClick?.(comment.id);
                }}
              />
            </div>
          )}
          <div className="comment-header">
            <div className="comment-author">{comment.userName}</div>
            <div className="comment-date">
              <CommentRounded /> dodano: {comment.dateAdd.split("T")[0]}
            </div>
          </div>
          <div className="comment-content">{comment.content}</div>
        </li>
      )}
      {editMode && (
        <li className="comment edit-comment">
          <div className="edit-buttons">
            <SelectableButton
              disabled={!editValue}
              icon={<Done fontSize="small" />}
              cssClass="confirm-button"
              elevated
              onClick={() => {
                if (!editValue) return;
                onConfirmEdit?.(comment.id, editValue);
              }}
            />
            <SelectableButton
              icon={<Close fontSize="small" />}
              elevated
              cssClass="cancel-button"
              onClick={() => {
                onCloseEdit?.();
              }}
            />
          </div>
          <div className="comment-header">
            <div className="comment-author">{comment.userName}</div>
            <div className="comment-date">
              <CommentRounded /> dodano: {comment.dateAdd.split("T")[0]}
            </div>
          </div>
          <TextField
            multiline
            rows={2}
            fullWidth
            value={editValue}
            onChange={(event) => {
              onEditValueChange?.(event.target.value);
            }}
            defaultValue={comment.content}
            variant="outlined"
            label="Edytuj komentarz"
          />
        </li>
      )}
    </>
  );
};

export default Comment;
