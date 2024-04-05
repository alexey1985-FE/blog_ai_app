'use client';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { db, storage } from '@/firebase-config';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useSession } from 'next-auth/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorMenuBar from '@/post/[id]/EditorMenuBar';
import { capitalizeFirstLetter, snippetGenerate } from '@/utils/snippetGenerate';
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from 'next/navigation';
import React from 'react';

interface PostContent {
  title: string;
  category: string;
  content: string;
  snippet: string;
  image: string;
}

const CreatePost = () => {
  const initialState = () => ({
    title: '',
    category: '',
    content: '',
    snippet: '',
    image: '',
  });

  const [form, setForm] = useState<PostContent>(initialState);
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [imageInputValue, setImageInputValue] = useState('');
  const [isAiContentGenerated, setIsAiContentGenerated] = useState(false);

  const { title, category, content, snippet } = form;
  const { data } = useSession();
  const router = useRouter();


  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedTitle = capitalizeFirstLetter(e.target.value);
    if (form.title !== updatedTitle) {
      setForm({ ...form, title: updatedTitle });
    }
  };

  const onCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedCategory = capitalizeFirstLetter(e.target.value);
    setForm({ ...form, category: updatedCategory });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      setFile(selectedFile);
      const imageUrl = URL.createObjectURL(selectedFile);
      setImage(imageUrl);
    } else {
      setFile(null);
      setImage('');
    }

    setImageInputValue(e.target.value);
  };

  const editor = useEditor({
    extensions: [StarterKit],
    onUpdate: handleOnChangeContent,
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm xl:prose-2xl leading-8 focus:outline-none max-w-ch-95',
      },
    },
  });

  const createAiContent = async () => {
    if (title && category) {
      setIsAiContentGenerated(true);
      editor?.chain().focus().setContent('Generating AI Content. Please Wait...').run();

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/openai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          role: category,
        }),
      });
      const data = await response.json();

      editor?.chain().focus().setContent(data.content).run();
      setForm({ ...form, content: data.content, snippet: snippetGenerate(data.content) });
      setIsAiContentGenerated(false);
    }
  };

  function handleOnChangeContent({ editor }: any) {
    const editorContent = editor?.getHTML();

    if (!isAiContentGenerated) {
      setForm({ ...form, content: editorContent, snippet: snippetGenerate(editorContent) });
    }
  }

  const handleRemoveImage = () => {
    setFile(null);
    setImage('');
    setImageInputValue('')
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let imageURL = '';
      if (file) {
        const uniqueImageName = Date.now() + '_' + file?.name;
        const storageRef = ref(storage, `images/${uniqueImageName}`);
        await uploadBytes(storageRef, file);
        imageURL = await getDownloadURL(storageRef);
      }

      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1
        }-${currentDate.getDate()}`;

      const userEmail = data?.user?.email || ''

      const post = {
        author: userName,
        userEmail,
        title,
        category,
        content,
        snippet,
        image: imageURL,
        createdAt: formattedDate,
      };

      const docRef = await addDoc(collection(db, 'posts'), post);
      await setDoc(
        doc(db, 'posts', docRef.id),
        { userId },
        { merge: true },
      );

      editor?.commands.clearContent();
      setForm(initialState);
      setFile(null);
      setImage('');
      setImageInputValue('');

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  useEffect(() => {
    if (data) {
      setUserName(data?.user?.name || data?.user?.userName);
    }
    if (data?.user?.uid) {
      setUserId(data?.user?.uid);
    }
  }, [data]);

  useEffect(() => {
    const currentContent = editor?.getHTML();
    const titleInContentMatch = currentContent?.match(/<(h[1-6])>(.*?)<\/\1>/);

    if (titleInContentMatch) {
      const titleInContent = titleInContentMatch[2];

      if (title !== titleInContent) {
        setForm({ ...form, title: titleInContent });
      }
    }
  }, [content, title, form, editor]);

  return (
    <div className='flex justify-center mt-2 mb-10 min-w-[20rem] w-full md:min-w-1000 grow px-3'>
      <form className='max-w-screen-xl px-3 min-w-full xs:min-w-[30rem] sm:min-w-[50rem]' onSubmit={handleSubmit}>
        <div className='space-y-12'>
          <div className=' border-gray-900/10'>
            <div className='sm:mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='col-span-full'>
                <label
                  htmlFor='title'
                  className='block text-sm font-medium leading-6 text-gray-900 dark:text-wh-100'
                >
                  Title
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    value={title}
                    onChange={handleTitleChange}
                    required
                    className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='col-span-full'>
                <label
                  htmlFor='category'
                  className='block text-sm font-medium leading-6 text-gray-900 dark:text-wh-100'
                >
                  Category
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    value={category}
                    onChange={onCategoryChange}
                    required
                    className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='col-span-full'>
                <p className='block text-sm font-medium leading-6 text-gray-900 mb-2 dark:text-wh-100'>
                  Description
                </p>

                <div className='border-2 rounded-md bg-wh-50 p-3 mb-5'>
                  <div>
                    <EditorMenuBar editor={editor} createAiContent={createAiContent} />
                    <hr className='border-1 mt-2 mb-5' />
                  </div>
                  <EditorContent editor={editor} />
                </div>

                <div className='col-span-full'>
                  <label
                    htmlFor='image'
                    className='block text-sm font-medium leading-6 text-gray-900 dark:text-wh-100'
                  >
                    Image
                  </label>
                  <div className='mt-2'>
                    <input
                      type='file'
                      name='image'
                      id='image'
                      required
                      value={imageInputValue}
                      onChange={handleFileChange}
                      className='block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6'
                    />
                  </div>
                  {image && (
                    <div className="relative mt-2">
                      <div className="relative w-[150px] h-[100px]">
                        <Image src={image} alt="Preview" fill />
                        <XCircleIcon className='h-6 w-6 absolute top-0 right-0 m-1 text-gray-300 hover:text-red-600 cursor-pointer' onClick={handleRemoveImage} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-6 flex items-center justify-end gap-x-6'>
          <button
            type='submit'
            className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
