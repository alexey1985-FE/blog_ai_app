import { EditorProps } from "@/types";
import React, { useState, useEffect } from "react";
import { XMarkIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { deleteCommentsForPost } from "@/utils/fetchComments";
import { deletePost } from "@/utils/fetchPosts";
import { useRouter } from "next/navigation";
import DeleteModal from "@/(shared)/DeleteModal";

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
    editor?.commands.focus('start')
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

      router.push("/");
      router.refresh();
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
        <DeleteModal
          handleDelete={handleDeletePost}
          deleteMessage={'Are you sure you want to delete this post?'}
          showDeleteConfirmation={showDeleteConfirmation}
          setShowDeleteConfirmation={setShowDeleteConfirmation}
          deleteUser={async () => {}}
          confirmDeleteUser={false}
          setConfirmDeleteUser={() => void {}}
          setVerificationPassword={() => void {}}
          setError={() => void {}}
          error={""}
          googleUser={false}
        />
      )}
    </div>
  );
};

export default CategoryAndEdit;
