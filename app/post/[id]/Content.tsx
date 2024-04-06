"use client"
import { Post } from "@/types";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import Image from "next/image";
import SocialLinks from "@/(shared)/SocialLinks";
import { useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CategoryAndEdit from "./CategoryAndEdit";
import Article from "./Article";
import Comments from "@/(shared)/Comments";
import { db, storage } from "@/firebase-config";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { useSession } from 'next-auth/react';
import { EyeIcon } from '@heroicons/react/24/solid'
import { snippetGenerate } from "@/utils/snippetGenerate";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from "next/navigation";

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

  const [file, setFile] = useState<File | null>(null);
  const [newImage, setNewImage] = useState<string | null>(null);


  const { data } = useSession()
  const router = useRouter();


  const userAuthId = data?.user?.uid
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const date = new Date(post?.createdAt);
  const options = { year: "numeric", month: "long", day: "numeric" } as any;
  const formattedDate = date.toLocaleDateString("en-US", options);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageURL = post.image;

    if (title === "") setTitleError("This field is required.");
    if (editor?.isEmpty) setContentError("This field is required.");
    if (title === "" || editor?.isEmpty) return;

    if (file) {
      const uniqueImageName = Date.now() + '_' + file?.name;
      const storageRef = ref(storage, `images/${uniqueImageName}`);
      await uploadBytes(storageRef, file);
      imageURL = await getDownloadURL(storageRef);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        image: imageURL,
        snippet: snippetGenerate(content)
      }),
    });

    await response.json()

    if (response.ok) {
      router.refresh()
      if (editor) {
        editor.chain().focus().setContent(content).run();
      }
    }


    handleIsEditable(false);
    setTempTitle("");
    setTempContent("");
  };

  const handleIsEditable = (bool: boolean) => {
    setIsEditable(bool);
    editor?.setEditable(bool);
  };

  function removeTags(input: string): string {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
  }


  const handleOnChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (title) setTitleError("");

    if (editor && editor.getHTML) {
      const updatedTitle = e.target.value;
      const currentContent = editor.getHTML();

      const paragraphs = currentContent.match(/<(h[1-3]|p)>(.*?)<\/(h[1-3]|p)>/g) || [];
      const isFirstTitleParagraph = paragraphs[0]?.includes('<p>');

      let updatedContent = '';
      if (isFirstTitleParagraph) {
        updatedContent = currentContent.replace(/<p>(.*?)<\/p>/, `<p>${updatedTitle}</p>`);
      } else {
        updatedContent = currentContent.replace(/<(h[1-3])>(.*?)<\/(h[1-3])>/, `<$1>${updatedTitle}</$3>`);
      }

      if (editor.isActive('paragraph') && !editor.isFocused && isFirstTitleParagraph) {
        setTitle(removeTags(updatedContent.match(/<p>(.*?)<\/p>/)?.[1] || ''));
      } else {
        setTitle(removeTags(updatedContent.match(/<h[1-3]>(.*?)<\/h[1-3]>/)?.[1] || ''));
      }

      setTitle(updatedTitle)
      setContent(updatedContent);
    }
  };

  const handleOnChangeContent = ({ editor }: any) => {
    if (!(editor as Editor).isEmpty) setContentError("");

    const currentContent = (editor as Editor).getHTML();

    if (!currentContent.includes(content)) {
      const firstParagraph = currentContent.match(/<(h[1-3]|p)>(.*?)<\/(h[1-3]|p)>/)?.[0] || '';

      if (firstParagraph) {
        setTitle(removeTags(firstParagraph));
      }

      setContent(currentContent);
    }
  };

  const editor = useEditor({
    extensions: [StarterKit],
    onUpdate: handleOnChangeContent,
    content,
    editable: isEditable,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm xl:prose-2xl leading-8 focus:outline-none w-full max-w-full dark:text-wh-100",
      },
    },
  });

  const handleEditImage = (e: React.MouseEvent) => {
    e.preventDefault();

    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      setFile(selectedFile);
      const imageUrl = URL.createObjectURL(selectedFile);
      setNewImage(imageUrl);
    } else {
      setFile(null);
      setNewImage('');
    }
  };


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

          const postUserId = postDoc.data().userId || null;
          if (postUserId !== userAuthId) {
            updateDoc(postRef, { userId: userAuthId });
          }

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

  // const updateUserAndPost = async () => {
  //   const postRef = doc(db, 'posts', postId);
  //   await updateDoc(postRef, { userId: userAuthId });
  //   router.refresh();

  //   if (postUserId?.match(/\D/)) {
  //     return
  //   }
  // };

  // useEffect(() => {
  //   const updateUserAndPost = async () => {
  //     const postRef = doc(db, 'posts', postId);
  //     const postDoc = await getDoc(postRef);
  //     if (postDoc.exists()) {
  //       const postData = postDoc.data();
  //       if (postData && postData.userEmail && postData.userEmail === userEmail) {
  //         await updateDoc(postRef, { userId: userAuthId });
  //         router.refresh();
  //       }
  //     }
  //   };

  //   if (postEmail && postEmail === userEmail && user === postAuthor) {
  //     updateUserAndPost();
  //   }
  // }, []);


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
  }, [postId, userAuthId]);


  return (
    <div className="prose w-full max-w-full mb-10">
      {/* BREADCRUMBS */}
      <h5 className="text-wh-300 dark:text-wh-10">{`Home > ${post.category} > ${post.title}`}</h5>

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
          {isEditable && (
            <div>
              <input
                className="border-2 rounded-md bg-wh-50 p-3 my-3 w-full"
                placeholder="Title"
                onChange={handleOnChangeTitle}
                value={title}
              />
              {titleError && <p className="mt-1 text-red-500">{titleError}</p>}
            </div>
          )}
          <div className="flex gap-3 items-center flex-wrap">
            <h5 className="font-semibold text-xs dark:text-wh-10">By {post.author}</h5>
            <h6 className="text-wh-300 text-xs">{formattedDate}</h6>
            <div className="text-wh-300 flex items-center">
              <EyeIcon className="h-5 w-5 mx-1" />
              <h6 className="text-xs m-0">{views} Views</h6>
            </div>
          </div>
        </>

        {/* IMAGE */}
        <div className="relative w-auto mb-16 h-96">
          <Image
            fill
            alt={post.title}
            src={newImage || post.image}
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 85vw, (max-width: 1060px) 75vw, 60vw"
            style={{ objectFit: 'cover' }}
            placeholder="blur"
            blurDataURL="/assets/blurred_loading.jpg"
          />
          {isEditable && (
            <>
              <button
                onClick={handleEditImage}
                className="absolute top-10 right-3 bg-wh-50 bg-opacity-50 p-2 rounded-full hover:bg-opacity-100 focus:outline-none"
              >
                <PencilSquareIcon className="h-6 w-6 text-accent-red" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </>
          )}
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
      <Comments postId={postId} commentId={""} text={""} createdAt={''} editedAt={""} />
    </div>
  );
};

export default Content;
