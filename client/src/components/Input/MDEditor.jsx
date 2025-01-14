import React, { memo } from "react";
import { Editor } from "@tinymce/tinymce-react";

const MDEditor = ({
  label,
  value,
  changeValue,
  name,
  invalidFields,
  setInvalidFields,
  setIsFocusDescription,
}) => {
  return (
    <div className="flex flex-col ">
      <span className="">{label}</span>
      <Editor
        apiKey="3ns5ai8yzbskjxja32ejk9clyrl372uocuyg2c8ry15rei72"
        initialValue={value}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        onChange={(e) =>
          changeValue((prev) => ({ ...prev, [name]: [e.target.getContent()] }))
        }
        onFocus={() => {
          setInvalidFields && setInvalidFields([]);
        }}
      />
      {invalidFields?.some((el) => el.name === name) && (
        <small className="text-main text-sm">
          {invalidFields?.find((el) => el.name === name)?.mes}{" "}
        </small>
      )}
    </div>
  );
};

export default memo(MDEditor);
