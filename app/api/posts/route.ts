import { NextApiRequest, NextApiResponse } from 'next';
import { collection, onSnapshot, query, DocumentData, DocumentSnapshot } from "firebase/firestore";
import { db } from '@/firebase-config';
import { Post } from '@/types';
import { NextResponse } from 'next/server';

export default async function GET(request: Request) {
    try {
      const q = query(collection(db, "posts"));
      onSnapshot(q, async (querySnapshot) => {
        const postsArr: Post[] = [];

        querySnapshot.forEach((doc: DocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          postsArr.push({ ...data, id: doc.id } as Post);
        });

        // const formattedPosts = await Promise.all(
        //   postsArr.map(async (post: Post) => {
        //     return {
        //       ...post,
        //       image: post.image
        //     };
        //   })
        // );

        // Возвращаем успешный ответ с данными
        return NextResponse.json({ data: postsArr }, {status: 200 });
      });
    } catch (error) {
      // Возвращаем ошибку
      return NextResponse.json({ error: "An error occurred while fetching posts" }, { status: 500 });
    }
}
