import Sidebar from "@/(shared)/Sidebar";
import { getPostById } from "@/utils/fetchPosts";
import React from "react";
import Content from "./Content";
import { Post } from '@/types'

type Props = {
	params: { id: string };
};

const Post = async ({ params }: Props) => {
	const { id } = params;
	const post = await getPostById(id);

	if (!post) {
    console.log(`Post with id ${id} not found`);
    return null;
  }

	return (
		<main className="px-10 leading-7">
			<div className="md:flex gap-10 mb-5">
				<div className="basis-3/4"><Content post={post as Post} postId={id}/></div>
				<div className="basis-1/4">
					<Sidebar />
				</div>
			</div>
		</main>
	);
};

export default Post;
