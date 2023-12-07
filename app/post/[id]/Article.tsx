import React, { useState } from "react";
import { ArticleProps } from "@/types";
import EditorMenuBar from "./EditorMenuBar";
import { EditorContent } from "@tiptap/react";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";

const Article = ({
  contentError,
  editor,
  isEditable,
  setContent,
  title,
}: ArticleProps) => {
  const [role, setRole] = useState<string>('');

  if (!editor) {
    return null;
  }

  const postAiContent = async () => {
    editor.chain().focus().setContent("Generating AI Content. Please Wait...").run();

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/openai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        role
      }),
    });
    const data = await response.json();

    editor.chain().focus().setContent(data.content).run();
    setContent(data.content);
    setRole('')
  };

  return (
    <article className="text-wh-500 leading-8">
      {/* AI GENERATOR */}
      {isEditable && (
        <div className="border-2 rounded-md bg-wh-50 p-3 mb-3">
          <h4 className="m-0 p-0 mb-2 text-lg">Generate AI Content</h4>
          <div className="xs:flex gap-5">
            <input
              className="border-2 rounded-md bg-wh-50 px-3 py-1 w-full xs:w-[50%] mb-3 xs:mb-0"
              placeholder="Write the post style"
              onChange={e => setRole(e.target.value)}
              value={role}
            />
            <button type='button' onClick={postAiContent} className="flex items-center bg-gray-200 p-2 rounded-lg w-full xs:w-auto">
              Generate with AI
              <RocketLaunchIcon className='h-8 w-8 text-indigo-500 ml-2 hover:text-indigo-400' />
            </button>
          </div>
        </div>
      )}
      <div
        className={isEditable ? "border-2 rounded-md bg-wh-50 p-3" : "w-full max-w-full"}
      >
        {isEditable && (
          <div>
            <EditorMenuBar editor={editor} createAiContent={postAiContent} />
            <hr className="border-1 mt-2 mb-5" />
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
      {contentError && <p className="mt-1 text-red-500">{contentError}</p>}
    </article>
  );
};

export default Article;
