import { Editor } from "@tiptap/react";

export interface Post {
	image: string;
	id: string;
	category: string;
	title: string;
	snippet: string;
	createdAt: string;
	author: string;
	content: string;
	uid?: string
	googleUid: string
}

export type ArticleProps = {
  contentError: string;
  editor: Editor | null;
  isEditable: boolean;
  setContent: (content: string) => void;
  title: string;
};

export type EditorProps = {
	isEditable: boolean;
	handleIsEditable: (isEditable: boolean) => void;
	title: string;
	setTitle: (title: string) => void;
	tempTitle: string;
	setTempTitle: (tempTitle: string) => void;
	tempContent: string;
	setTempContent: (tempContent: string) => void;
	editor: Editor | null;
	post: Post;
};
