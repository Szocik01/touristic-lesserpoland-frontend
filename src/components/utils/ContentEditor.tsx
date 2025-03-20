import { Editor } from "@tinymce/tinymce-react";
import { ForwardedRef, forwardRef } from "react";
import ContentLoading from "./ContentLoading";
import { EDITOR_API_KEY } from "../../utils/constants";

type ContentEditorProps = {
  initialValue?: string;
  isLoading: boolean;
  onInit?: () => void;
  height?: number;
};

const ContentEditor = forwardRef<Editor, ContentEditorProps>(function (
  props,
  ref
) {
  const { initialValue, isLoading, onInit, height } = props;

  return (
    <>
      <div className={`tinymce-editor-container`}>
        {isLoading && <ContentLoading coverParent />}
        <Editor
          apiKey={EDITOR_API_KEY}
          initialValue={initialValue}
          ref={ref}
          onInit={(event, editor) => {
            if (onInit) {
              onInit();
            }
          }}
          init={{
            height: height || 300,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "preview",
              "searchreplace",
              "visualblocks",
              "insertdatetime",
              "media",
              "table",
              "code",
            ],
            toolbar: [
              "undo redo | styles fontfamily fontsize | " +
                "bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify" +
                "bullist numlist outdent indent | " +
                "link image media | preview code",
            ],
          }}
        />
      </div>
    </>
  );
});

export default ContentEditor;
