import { Post } from '@/types';
import { Timestamp } from 'firebase/firestore';

export const formattedDate = (dateString: string): string => {
	const options = { year: 'numeric', month: 'long', day: 'numeric' } as any;
	const date = new Date(dateString).toLocaleDateString('en-US', options);
	return date;
};

export const toDate = (createdAt: string | Timestamp): Date => {
	if (typeof createdAt === 'string') {
		return new Date(createdAt);
	} else {
		return (createdAt as Timestamp).toDate();
	}
};

export const compareCreatedAt = (a: Post, b: Post) => {
	const dateA = toDate(a.createdAt);
	const dateB = toDate(b.createdAt);
	return dateB.getTime() - dateA.getTime();
};
