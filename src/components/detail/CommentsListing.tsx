import { useEffect, useState } from "react";
import { EditTripCommentBody, TripCommentDTO } from "../../types/api/trips";
import Comment from "./Comment";
import useHttp from "../../hooks/useHttp";
import { API_CALL_URL_BASE } from "../../utils/constants";

type CommentsProps = {
  comments: TripCommentDTO[];
  userId?: string;
  onSuccessfulEdit?: (comment: TripCommentDTO) => void;
  onSuccessfulDelete?: (commentId: string) => void;
  token: string;
};

const CommentsListing = (props: CommentsProps) => {
  const { comments, userId, onSuccessfulEdit, token, onSuccessfulDelete } =
    props;

  const [commentEditValue, setCommentEditValue] = useState("");
  const [commentUnderEditId, setCommentUnderEditId] = useState<string | null>(
    null
  );

  const [sendEditRequest] = useHttp(`${API_CALL_URL_BASE}/edit-trip-comment`);
  const [sendDeleteRequest] = useHttp(
    `${API_CALL_URL_BASE}/delete-trip-comment`
  );

  function handleDeleteCommentResponse(response: Response) {
    if (!response.ok) {
      throw new Error("Nie udało się usunąć komentarza");
    }
    return response.json().then((data:{id: string}) => {
      onSuccessfulDelete?.(data.id);
    });
  }

  function handleDeleteCommentError(error: Error) {
    console.error(error);
  }

  function handleEditCommentResponse(response: Response) {
    if (!response.ok) {
      throw new Error("Nie udało się edytować komentarza");
    }

    return response.json().then((data: TripCommentDTO) => {
      onSuccessfulEdit?.(data);
      setCommentUnderEditId(null);
    });
  }

  function handleEditCommentError(error: Error) {
    console.error(error);
  }

  useEffect(() => {
    const commentValue = comments.find(
      (comment) => comment.id === commentUnderEditId
    )?.content;
    if (commentValue) {
      setCommentEditValue(commentValue);
    }
    return () => {
      setCommentEditValue("");
    };
  }, [commentUnderEditId]);

  return (
    <>
      {comments.length > 0 ? (
        <ul className="comments-list">
          {comments.map((data) => {
            return (
              <Comment
                key={data.id}
                comment={data}
                userId={userId}
                editMode={commentUnderEditId === data.id}
                editValue={commentEditValue}
                onEditValueChange={(value: string) => {
                  setCommentEditValue(value);
                }}
                onDeleteButtonClick={(id) => {
                  sendDeleteRequest(
                    handleDeleteCommentResponse,
                    handleDeleteCommentError,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                      },
                    },`/${id}`
                  );
                }}
                onCloseEdit={() => {
                  setCommentUnderEditId(null);
                }}
                onConfirmEdit={(id, value) => {
                  const editBody: EditTripCommentBody = {
                    commentId: id,
                    content: value,
                  };
                  sendEditRequest(
                    handleEditCommentResponse,
                    handleEditCommentError,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                      },
                      body: JSON.stringify(editBody),
                    }
                  );
                }}
                onEditModeButtonClick={() => {
                  setCommentUnderEditId(data.id);
                }}
              />
            );
          })}
        </ul>
      ) : (
        <div className="no-comments">Brak komentarzy</div>
      )}
    </>
  );
};

export default CommentsListing;
