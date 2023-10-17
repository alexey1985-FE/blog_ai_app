"use client"

import { Post } from "@/types";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SocialLinks from "@/(shared)/SocialLinks";
import { useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CategoryAndEdit from "./CategoryAndEdit";
import Article from "./Article";
import Comments from "@/(shared)/Comments";
import { db } from "@/firebase-config";
import { doc, getDoc, increment, setDoc, updateDoc, onSnapshot, runTransaction } from "firebase/firestore";
import { useSession } from 'next-auth/react';
import { EyeIcon } from '@heroicons/react/24/solid'

type Props = {
  post: Post;
  postId: string
};

const Content = ({ post, postId }: Props) => {

  const [isEditable, setIsEditable] = useState(false);

  const [title, setTitle] = useState<string>(post.title);
  const [titleError, setTitleError] = useState<string>("");
  const [tempTitle, setTempTitle] = useState<string>(title);

  const [content, setContent] = useState<string>(post.content);
  const [contentError, setContentError] = useState<string>("");
  const [tempContent, setTempContent] = useState<string>(content);
  const [views, setViews] = useState<number>(0);

  const { data } = useSession()
  const userAuthId = data?.user?.uid

  const date = new Date(post?.createdAt);
  const options = { year: "numeric", month: "long", day: "numeric" } as any;
  const formattedDate = date.toLocaleDateString("en-US", options);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title === "") setTitleError("This field is required.");
    if (editor?.isEmpty) setContentError("This field is required.");
    if (title === "" || editor?.isEmpty) return;

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content
      }),
    });

    await response.json();

    handleIsEditable(false);
    setTempTitle("");
    setTempContent("");
  };

  const handleIsEditable = (bool: boolean) => {
    setIsEditable(bool);
    editor?.setEditable(bool);
  };

  const handleOnChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (title) setTitleError("");
    setTitle(e.target.value);
  };

  const handleOnChangeContent = ({ editor }: any) => {
    if (!(editor as Editor).isEmpty) setContentError("");
    setContent((editor as Editor).getHTML());
  };

  const editor = useEditor({
    extensions: [StarterKit],
    onUpdate: handleOnChangeContent,
    content: content,
    editable: isEditable,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm xl:prose-2xl leading-8 focus:outline-none w-full max-w-full",
      },
    },
  });

  useEffect(() => {
    const postRef = doc(db, "posts", postId);

    const unsubscribe = onSnapshot(postRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setViews(data.views || 0);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const incrementViews = async () => {
    if (userAuthId) {
      const userViewedKey = `viewed_${userAuthId}_${postId}`;
      const hasViewedBefore = localStorage.getItem(userViewedKey);

      if (!hasViewedBefore) {
        const postRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postRef);

        if (postDoc.exists()) {
          const currentViews = postDoc.data().views || 0;

          await updateDoc(postRef, {
            views: currentViews + 1,
          });

          localStorage.setItem(userViewedKey, 'true');
          setViews(currentViews + 1);
        }
      }
    }
  };


  useEffect(() => {
    if (userAuthId) {
      incrementViews();
    }
  }, [userAuthId, postId]);



  return (
    <div className="prose w-full max-w-full mb-10">
      {/* BREADCRUMBS */}
      <h5 className="text-wh-300">{`Home > ${post.category} > ${post.title}`}</h5>

      {/* CATEGORY AND EDIT */}
      <CategoryAndEdit
        isEditable={isEditable}
        handleIsEditable={handleIsEditable}
        title={title}
        setTitle={setTitle}
        tempTitle={tempTitle}
        setTempTitle={setTempTitle}
        tempContent={tempContent}
        setTempContent={setTempContent}
        editor={editor}
        post={post}
        postId={postId}
      />

      <form onSubmit={handleSubmit}>
        {/* HEADER*/}
        <>
          {isEditable ? (
            <div>
              <input
                className="border-2 rounded-md bg-wh-50 p-3 my-3 w-full"
                placeholder="Title"
                onChange={handleOnChangeTitle}
                value={title}
              />
              {titleError && <p className="mt-1 text-red-500">{titleError}</p>}
            </div>
          ) : (
            <h3 className="font-bold text-3xl mt-3">{title}</h3>
          )}
          <div className="flex gap-3 items-center">
            <h5 className="font-semibold text-xs">By {post.author}</h5>
            <h6 className="text-wh-300 text-xs">{formattedDate}</h6>
            <div className="text-wh-300 flex items-center">
              <EyeIcon className="h-5 w-5 mx-1"/>
              <h6 className="text-xs m-0">{views} Views</h6>
            </div>
          </div>
        </>

        {/* IMAGE */}
        <div className="relative w-auto mb-16 h-96">
          <Image
            fill
            alt={post.title}
            src={post.image}
            sizes="(max-width: 480px) 100vw,
                  (max-width: 768px) 85vw,
                  (max-width: 1060px) 75vw,
                  60vw"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* ARTICLE */}
        <Article
          contentError={contentError}
          editor={editor}
          isEditable={isEditable}
          setContent={setContent}
          title={title}
        />

        {/* SUBMIT BUTTON */}
        {isEditable && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-accent-red hover:bg-wh-500 text-wh-10 font-semibold py-2 px-5 mt-5"
            >
              SUBMIT
            </button>
          </div>
        )}
      </form>

      {/* SOCIAL LINKS */}
      <div className="hidden md:block mt-10 w-1/3">
        <SocialLinks isDark />
      </div>

      {/* COMMENTS */}
      <Comments postId={postId} commentId={""} text={""} createdAt={''} />
    </div>
  );
};

export default Content;
