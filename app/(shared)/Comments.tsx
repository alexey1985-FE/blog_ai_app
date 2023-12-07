"use client"

import { addComment, getComments, deleteComment, editComment } from '@/utils/fetchComments';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Comment } from '@/types';
import { useSession } from 'next-auth/react';
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { TrashIcon } from '@heroicons/react/24/solid'
import Image from 'next/image';
import DeleteModal from './DeleteModal';

const Comments: React.FC<Comment> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [userLogo, setUserLogo] = useState('');

  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [editedComment, setEditedComment] = useState('');
  const [commentUserName, setCommentUserName] = useState<string | undefined>(undefined);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const trashIconRef = useRef<SVGSVGElement | null>(null);
  const { data } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formatDate = (date: Date): string => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    const now = new Date();
    const createdAt = formatDate(now);

    const newCommentId = await addComment(postId, newComment, userName as string, userLogo, createdAt);
    const updatedComments = await getComments(postId);
    const commentToUpdate = updatedComments.find((comment) => comment.commentId === newCommentId);

    if (commentToUpdate) {
      commentToUpdate.commentId = newCommentId;
    }

    setComments(updatedComments);
    setNewComment('');
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
    const updatedComments = await getComments(postId);
    setComments(updatedComments);
    setEditCommentId(null);
    setShowDeleteConfirmation(false)
  };

  const handleEditComment = (commentId: string, text: string) => {
    setEditCommentId(commentId);
    setEditedComment(text)

    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(text.length, text.length);
      }
    });
    document.addEventListener('click', handleDocumentClick);
  };

  const handleUpdateComment = async (commentId: string) => {
    try {
      await editComment(commentId, editedComment);

      const updatedComments = await getComments(postId);
      setComments(updatedComments);

      setEditedComment('');
      setEditCommentId(null);

    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDocumentClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (
        !target.closest('.edit-comment-container') &&
        !target.matches('input') &&
        !trashIconRef.current?.contains(target)
      ) {
        setEditCommentId(null);
        document.removeEventListener('click', handleDocumentClick);
      }
    },
    [commentUserName, userName]
  );

  useEffect(() => {
    if (data?.user?.userName) {
      setUserName(data?.user?.userName)
    } else {
      setUserName(data?.user?.name)
    }
    setUserLogo(data?.user?.image || '')

    const fetchComments = async () => {
      const commentsData = await getComments(postId);
      setComments(commentsData);
    };

    fetchComments();
  }, [postId, data]);

  return (
    <>
      <div className='mt-3'>
        {(comments.length !== 0 && data) || (comments.length !== 0 && !data) ? <h2>Comments</h2> : null}
        <div>
          {comments.map((comment) => (
            <div key={comment.commentId} className="flex items-center">
              {comment.userLogo ?
                <Image src={comment.userLogo} alt="user logo" width={40} height={40} className="m-0 mr-5 rounded-full translate-x-1" /> :
                <UserCircleIcon className="w-14 h-14 mr-3 text-gray-300" />
              }
              <div className={`flex flex-col translate-y-3 edit-comment-container ${userName && comment.userName === userName ? 'hover:cursor-pointer' : ''}`}
                onClick={() => {
                  if (userName && comment.userName === userName) {
                    handleEditComment(comment.commentId, comment.text);
                  } else { setEditCommentId(null) }
                  setCommentUserName(comment.userName);
                }}>
                {comment.createdAt ?
                  <>
                    <div className="flex">
                      <h4 className="m-0">{comment.userName}</h4>
                      <i className='m-0 ml-3 -translate-y-0.5 text-gray-500'>{comment.createdAt.toString()}</i>
                    </div>
                    <p className="m-0 mb-3 text-gray-500">{comment.text}</p>
                  </>
                  :
                  <>
                    <h4 className="m-0">{comment.userName}</h4>
                    <p className="mb-4 text-gray-500">{comment.text}</p>
                  </>
                }
              </div>
            </div>
          ))}
        </div>

        {data && <form onSubmit={handleSubmit} className="mt-6">
          {editCommentId === null ? (
            <>
              <input
                value={newComment}
                type="text"
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                required
                className="w-full p-3 rounded-md border-2 border-grey-200 flex items-center focus:outline-none"
              />
              <button type="submit" className='mt-3 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none'>Add</button>
            </>
          ) : (
            <>
              <input
                value={editedComment}
                type="text"
                onChange={(e) => setEditedComment(e.target.value)}
                placeholder="Edit your comment"
                ref={inputRef}
                className="w-full p-3 rounded-md border-2 border-grey-200 flex items-center focus:outline-none"
              />
              <div className="space-x-2 flex min-w-[5rem] items-center">
                <button onClick={() => handleUpdateComment(editCommentId)} type="button" className='mt-3 mr-3 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none'>Edit</button>
                <TrashIcon onClick={() => setShowDeleteConfirmation(true)}
                  className="text-red-600 hover:cursor-pointer w-6 h-6 translate-y-1.5"
                  ref={trashIconRef}
                />
              </div>
              {showDeleteConfirmation && (
                <DeleteModal
                  handleDelete={() => handleDeleteComment(editCommentId)}
                  deleteMessage={'Are you sure you want to delete this comment?'}
                  setShowDeleteConfirmation={setShowDeleteConfirmation}
                />
              )}
            </>
          )}
        </form>}
      </div >
    </>
  );
};

export default Comments;
