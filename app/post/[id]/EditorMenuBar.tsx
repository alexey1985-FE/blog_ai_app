import { Editor } from '@tiptap/react';
import React from 'react';
import { usePathname } from 'next/navigation';
import { RocketLaunchIcon } from '@heroicons/react/24/solid';

type Props = {
  editor: Editor | null;
  createAiContent: () => void;
};

const EditorMenuBar = ({ editor, createAiContent }: Props) => {
  if (!editor) {
    return null;
  }

  const pathname = usePathname();
  const pageName = pathname.split('/').pop();


  return (
    <div className='flex justify-between items-center'>
      <div className='flex items-center gap-4'>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={
            editor.isActive('heading', { level: 1 })
              ? 'bg-wh-500 text-wh-50 p-1 rounded-md'
              : 'p-1'
          }
        >
          H<span className='text-xs'>1</span>
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={
            editor.isActive('heading', { level: 2 })
              ? 'bg-wh-500 text-wh-50 p-1 rounded-md'
              : 'p-1'
          }
        >
          H<span className='text-xs'>2</span>
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={
            editor.isActive('heading', { level: 3 })
              ? 'bg-wh-500 text-wh-50 p-1 rounded-md'
              : 'p-1'
          }
        >
          H<span className='text-xs'>3</span>
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={
            editor.isActive('paragraph') ? 'bg-wh-500 text-wh-50 p-1 rounded-md' : 'p-1'
          }
        >
          paragraph
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={
            editor.isActive('bold') ? 'bg-wh-500 text-wh-50 p-1 rounded-md' : 'p-1'
          }
        >
          <b>B</b>
        </button>
        <button
          type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={
            editor.isActive('italic') ? 'bg-wh-500 text-wh-50 p-1 rounded-md' : 'p-1'
          }
        >
          <i>I</i>
        </button>
      </div>
      {pageName === 'create-post' && (
        <button type='button' onClick={createAiContent} className="flex items-center bg-gray-200 p-2 rounded-lg">
          Generate with AI
          <RocketLaunchIcon className='h-8 w-8 text-indigo-500 ml-2 hover:text-indigo-400' />
        </button>
      )}
    </div>
  );
};

export default EditorMenuBar;
