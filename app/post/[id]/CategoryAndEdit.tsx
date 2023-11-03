import { EditorProps } from "@/types";
import React, { useState, useEffect } from "react";
import { XMarkIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { deleteCommentsForPost } from "@/utils/fetchComments";
import { deletePost } from "@/utils/fetchPosts";
import { useRouter } from "next/navigation";

const CategoryAndEdit = ({
  isEditable,
  handleIsEditable,
  title,
  setTitle,
  tempTitle,
  setTempTitle,
  tempContent,
  setTempContent,
  editor,
  post,
  postId
}: EditorProps) => {
  const [userUid, setUserUid] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { data } = useSession();
  const router = useRouter();

  const handleEnableEdit = () => {
    handleIsEditable(!isEditable);
    setTempTitle(title);
    setTempContent(editor?.getHTML() || "");
  };

  const handleCancelEdit = () => {
    handleIsEditable(!isEditable);
    setTitle(tempTitle);
    editor?.commands.setContent(tempContent);
  };

  const handleDeletePost = async () => {
    try {
      await deleteCommentsForPost(postId);
      await deletePost(postId);

      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
    finally {
      setShowDeleteConfirmation(false);
    }
  }

  useEffect(() => {
    setUserUid(data?.user?.uid as string);
  }, [data]);

  return (
    <div className="flex justify-between items-center mb-1">
      <h4 className="bg-accent-orange py-2 px-5 text-wh-900 text-sm font-bold">
        {post.category}
      </h4>
      {(userUid && userUid === post.userId) && (
        <div className="mt-4">
          {isEditable ? (
            <div className="flex justify-between gap-3">
              <button onClick={handleCancelEdit}>
                <XMarkIcon className="h-6 w-6 text-accent-red" />
              </button>
              <TrashIcon
                onClick={() => setShowDeleteConfirmation(true)}
                className="text-red-600 hover:cursor-pointer w-6 h-6"
              />
            </div>
          ) : (
            <button onClick={handleEnableEdit}>
              <PencilSquareIcon className="h-6 w-6 text-accent-red" />
            </button>
          )}
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white p-8 rounded shadow-lg animate-fade-in">
            <p className="text-xl mb-4 text-center">Sure you want to delete this post?</p>
            <div className="flex justify-center">
              <button
                className="mt-3 mr-3 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
                onClick={handleDeletePost}
              >
                Yes
              </button>
              <button
                className="mt-3 mr-3 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryAndEdit;
