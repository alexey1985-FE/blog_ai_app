"use client"

import { addComment, getComments, deleteComment, editComment, formatDate } from '@/utils/fetchComments';
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

  const editedCommentsJson = sessionStorage.getItem('editedComments');
  const initialEditedComments = editedCommentsJson ? JSON.parse(editedCommentsJson) : {};
  const [editedComments, setEditedComments] = useState<Record<string, boolean>>(initialEditedComments);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const trashIconRef = useRef<SVGSVGElement | null>(null);
  const { data } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      setEditedComments((prev) => ({ ...prev, [commentId]: true }));

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
    sessionStorage.setItem('editedComments', JSON.stringify(editedComments));
  }, [editedComments]);

  useEffect(() => {
    if (data?.user?.userName) {
      setUserName(data?.user?.userName)
    } else {
      setUserName(data?.user?.name)
    }

    if (data?.user?.image) {
      setUserLogo(data?.user?.image || '')
    } else {
      setUserLogo(data?.user?.userLogo || '')
    }

    const fetchComments = async () => {
      const commentsData = await getComments(postId);
      setComments(commentsData);
    };

    fetchComments();
  }, [postId, data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEditedComments({});
    }, 60000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className='mt-3'>
        {(comments.length !== 0 && data) || (comments.length !== 0 && !data) ? <h2 className='dark:text-indigo-400'>Comments</h2> : null}
        <div>
          {comments.map((comment) => (
            <div className='flex items-center' key={comment.commentId}>
              {
                comment.userLogo ?
                  <Image src={comment.userLogo} alt="user logo" width={40} height={40} className="m-0 mr-5 rounded-full translate-x-1 comments-logo" /> :
                  <UserCircleIcon className="w-14 h-14 mr-3 text-gray-300" />
              }
              <div className="flex items-center" >
                <div className={`flex flex-col translate-y-3 edit-comment-container w-64 xs:w-96 sm:w-[600px] lg:w-auto  ${userName && comment.userName === userName ? 'hover:cursor-pointer' : ''}`}
                  onClick={() => {
                    if (userName && comment.userName === userName) {
                      handleEditComment(comment.commentId, comment.text);
                    } else { setEditCommentId(null) }
                    setCommentUserName(comment.userName);
                  }}>
                  {comment.createdAt && !comment.editedAt ?
                    <>
                      <div className="flex items-center">
                        <h4 className="leading-7 xs:leading-8 m-0 dark:text-wh-10 text-sm xs:text-base">{comment.userName}</h4>
                        <i className='m-0 ml-3 text-gray-500 dark:text-wh-100 text-xs xs:text-base'>{comment.createdAt.toString()}</i>
                      </div>
                      <p className="m-0 mb-3 text-gray-500 dark:text-wh-100 text-sm xs:text-base">{comment.text}</p>
                    </>
                    :
                    <>
                      <div className="flex items-center">
                        <h4 className="m-0 leading-7 xs:leading-8 dark:text-wh-10 text-sm xs:text-base">{comment.userName}</h4>
                        <i className='m-0 ml-3 text-gray-500 dark:text-wh-100 text-xs xs:text-base'>
                          {formatDate(comment.editedAt) + (editedComments[comment.commentId] ? ' (edited)' : '')}
                        </i>
                      </div>
                      <p className="m-0 mb-3 text-gray-500 dark:text-wh-100 text-sm xs:text-base">{comment.text}</p>
                    </>
                  }
                </div>
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
                  showDeleteConfirmation={showDeleteConfirmation}
                  setShowDeleteConfirmation={setShowDeleteConfirmation}
                  handleDelete={() => handleDeleteComment(editCommentId)}
                  deleteMessage={'Are you sure you want to delete this comment?'}
                  deleteUser={async () => { }}
                  confirmDeleteUser={false}
                  setConfirmDeleteUser={() => void {}}
                  setVerificationPassword={() => void {}}
                  setError={() => void {}}
                  error={""}
                  googleUser={false}
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
