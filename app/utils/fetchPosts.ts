import { collection, getDocs, query, orderBy, doc, getDoc, deleteDoc } from "firebase/firestore";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "@/firebase-config";
import { Post } from "@/types";

export const getPosts = async () => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const postsArr: Post[] = [];

  querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data();
    postsArr.push({ ...data, id: doc.id } as Post);
  });

  return postsArr;
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
