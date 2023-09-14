"use client";

import Trending from "app/(home)/Trending";
import Tech from "app/(home)/Tech";
import Travel from "app/(home)/Travel";
import Other from "app/(shared)/Other";
import Subscribe from "app/(shared)/Subscribe";
import Sidebar from "app/(shared)/Sidebar";
import { db } from "./firebase-config";
import {
	collection,
	onSnapshot,
	query,
	QuerySnapshot,
	DocumentData,
	DocumentSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Post } from "./types";

export default function Home() {
	const [posts, setPosts] = useState<Post[]>([]);

	useEffect(() => {
		const getPosts = async () => {
			const q = query(collection(db, "posts"));
			const unSubscribe = onSnapshot(q, async (querySnapshot: QuerySnapshot<DocumentData>) => {
				const postsArr: Post[] = [];

				querySnapshot.forEach((doc: DocumentSnapshot<DocumentData>) => {
					const data = doc.data();
					postsArr.push({ ...data, id: doc.id } as Post);
				});

				const formattedPosts = await Promise.all(
					postsArr.map(async (post: Post) => {
						const imageModule = require(`../public${post.image}`);
						return {
							...post,
							image: imageModule.default,
						};
					})
				);

				setPosts(formattedPosts);
				return () => unSubscribe();
			});
		};
		getPosts();
	}, []);

	const formatPosts = () => {
		const trendingPosts: Post[] = [];
		const techPosts: Post[] = [];
		const travelPosts: Post[] = [];
		const otherPosts: Post[] = [];

		posts.forEach((post, i: number) => {
			if (i < 4) {
				trendingPosts.push(post);
			}
			if (post?.category === "Tech") {
				techPosts.push(post);
			} else if (post?.category === "Travel") {
				travelPosts.push(post);
			} else if (post?.category === "Interior Design") {
				otherPosts.push(post);
			}
		});

		return [trendingPosts, techPosts, travelPosts, otherPosts];
	};

	const [trendingPosts, techPosts, travelPosts, otherPosts] = formatPosts();

	return (
		<main className="px-10 leading-7">
			<Trending trendingPosts={trendingPosts} />
			<div className="md:flex gap-10 mb-5">
				<div className="basis-3/4">
					<Tech techPosts={techPosts} />
					<Travel travelPosts={travelPosts} />
					<Other otherPosts={otherPosts} />
					<div className="hidden md:block">
						<Subscribe />
					</div>
				</div>
				<div className="basis-1/4">
					<Sidebar />
				</div>
			</div>
		</main>
	);
}
