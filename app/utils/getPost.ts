import { db } from "@/firebase-config";
import { doc, getDoc } from "firebase/firestore";

export const getPostById = async (postId: string) => {
	try {
		const postRef = doc(db, "posts", postId);
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
