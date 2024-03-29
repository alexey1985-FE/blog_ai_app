import { db } from '@/firebase-config';
import { Comment } from '@/types';
import {
	collection,
	addDoc,
	query,
	where,
	getDocs,
	doc,
	deleteDoc,
	updateDoc,
	Timestamp,
	orderBy,
	serverTimestamp,
} from 'firebase/firestore';

const commentsCollection = collection(db, 'comments');

export const addComment = async (
	postId: string,
	text: string,
	userName: string,
	userLogo: string,
	_createdAt: string,
): Promise<string> => {
	const newComment: Comment = {
		postId,
		text,
		userName,
		userLogo,
		commentId: '',
		createdAt: Timestamp.now() as unknown as string,
		editedAt: '',
	};

	const docRef = await addDoc(commentsCollection, newComment);
	const commentId = docRef.id;
	await updateDoc(doc(commentsCollection, docRef.id), {
		commentId,
	});

	return commentId;
};

export const getComments = async (postId: string): Promise<Comment[]> => {
	const q = query(
		commentsCollection,
		where('postId', '==', postId),
		orderBy('createdAt', 'desc'),
	);
	const querySnapshot = await getDocs(q);

	const comments: Comment[] = [];

	querySnapshot.forEach((doc) => {
		const commentData = doc.data();
		comments.push({
			...commentData,
			id: doc.id,
			createdAt: commentData.createdAt
				? new Date((commentData.createdAt as Timestamp).toMillis()).toLocaleString(
						'ru-RU',
						{
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
							hour: '2-digit',
							minute: '2-digit',
						},
				  )
				: '',
		} as unknown as Comment);
	});

	return comments;
};
export const editComment = async (commentId: string, newText: string): Promise<void> => {
	const commentDocRef = doc(commentsCollection, commentId);

	await updateDoc(commentDocRef, {
		text: newText,
		editedAt: serverTimestamp(),
	});
};

export const deleteComment = async (commentId: string): Promise<void> => {
	const commentDocRef = doc(commentsCollection, commentId);
	await deleteDoc(commentDocRef);
};

export const deleteCommentsForPost = async (postId: string) => {
	try {
		const commentsRef = collection(db, 'comments');

		const q = query(commentsRef, where('postId', '==', postId));

		const querySnapshot = await getDocs(q);

		querySnapshot.forEach(async (doc) => {
			await deleteDoc(doc.ref);
		});
	} catch (error) {
		console.error('Error deleting comments for post:', error);
		throw error;
	}
};

export const formatDate = (timestamp: Timestamp | Date | null | string): string => {
	if (!timestamp) {
		return '';
	}

	let date: Date;

	if (timestamp instanceof Date) {
		date = timestamp;
	} else if (timestamp instanceof Timestamp) {
		date = timestamp.toDate();
	} else if (typeof timestamp === 'string') {
		date = new Date(timestamp);
	} else {
		return '';
	}

	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');

	return `${day}.${month}.${year} ${hours}:${minutes}`;
};
