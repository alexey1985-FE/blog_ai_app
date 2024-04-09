import {
	collection,
	query,
	orderBy,
	doc,
	getDoc,
	deleteDoc,
	onSnapshot,
} from 'firebase/firestore';
import { db } from '@/firebase-config';
import { Post } from '@/types';
import { useEffect, useState } from 'react';

const usePosts = () => {
	const [posts, setPosts] = useState<Post[]>([]);

	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(collection(db, 'posts'), orderBy('createdAt', 'desc')),
			(snapshot) => {
				const updatedPosts: Post[] = [];
				snapshot.forEach((doc) => {
					updatedPosts.push({ ...doc.data(), id: doc.id } as Post);
				});
				setPosts(updatedPosts);
			},
		);

		return () => unsubscribe();
	}, []);

	return posts;
};

export default usePosts;

export const getPopularSortedPosts = async (allPosts: Post[]): Promise<Post[]> => {
	try {
		const filteredPosts = allPosts.filter((post) => post.views && post.views > 5);

		const sortedPosts = filteredPosts.sort((a, b) => {
			const dateA = new Date(a.createdAt).getTime();
			const dateB = new Date(b.createdAt).getTime();
			return dateB - dateA;
		});
		return sortedPosts;
	} catch (error) {
		console.error('Error fetching and processing posts:', error);
		return [];
	}
};

export const getPostById = async (postId: string) => {
	try {
		const postRef = doc(db, 'posts', postId);
		const postSnapshot = await getDoc(postRef);

		if (postSnapshot.exists()) {
			const postData = postSnapshot.data();
			return postData;
		} else {
			return null;
		}
	} catch (error) {
		throw error;
	}
};

export const deletePost = async (postId: string): Promise<void> => {
	const postRef = doc(db, 'posts', postId);
	await deleteDoc(postRef);
};
