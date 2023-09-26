import { db } from "@/firebase-config";
import { doc, updateDoc } from "@firebase/firestore";
import { NextResponse } from "next/server";

type Params = { params: { id: string } };

export async function PATCH(request: Request, { params }: Params) {
	try {
		const { id } = params;
		const { title, content } = await request.json();
		
		const postRef = doc(db, "posts", id);
		await updateDoc(postRef, { title, content });

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("request error", error);
		return NextResponse.json({ error: "error updating post" }, { status: 500 });
	}
}
