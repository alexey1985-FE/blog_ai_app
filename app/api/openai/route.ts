import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
	apiKey: process.env.OPEN_AI_KEY,
});

export async function POST(request: Request) {
	try {
		const { title, role } = await request.json()

		const aiResponse = await openai.chat.completions.create({
			messages: [
				{
					role: "user",
					// content: `Create 3 line blog post based on this title: ${title}`,
					content: `Create blog post using html tags for formatting text based on this title: ${title}`,
				},
				{
					role: "system",
					content: `${role || "I am a helpful assistant"}. Write using html tags for text formatting.`,
				},
			],
			model: "gpt-3.5-turbo",
			temperature: 0,
		});

		return NextResponse.json(
			{
				content: aiResponse.choices[0].message?.content,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("request error", error);
		return NextResponse.json({ error: "error updating post" }, { status: 500 });
	}
}
