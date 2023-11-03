import { Post } from '@/types';

export const useGroupedPosts = (posts: Post[], groupSize: number) => {
	const groupedPosts = [];

	for (let i = 0; i < posts.length; i += groupSize) {
		groupedPosts.push(posts.slice(i, i + groupSize));
	}

	return groupedPosts;
};
