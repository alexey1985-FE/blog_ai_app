import {
	collection,
	getDocs,
	query,
	orderBy,
	doc,
	getDoc,
	deleteDoc,
	getDocsFromServer,
} from 'firebase/firestore';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '@/firebase-config';
import { Post } from '@/types';

export const getPosts = async () => {
	const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
	const querySnapshot = await getDocsFromServer(q);
	const postsArr: Post[] = [];

	querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
		const data = doc.data();
		postsArr.push({ ...data, id: doc.id } as Post);
	});

	return postsArr;
};

export const getPopularSortedPosts = async (): Promise<Post[]> => {
	try {
		const allPosts = await getPosts();

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
