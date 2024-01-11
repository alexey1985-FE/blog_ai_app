import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: process.env.OPEN_AI_KEY,
});

export async function POST(request: Request) {
	try {
		const { title, role } = await request.json();

		const aiResponse = await openai.chat.completions.create({
			messages: [
				{
					role: 'user',
					content: `Create blog post using html tags (for heading and paragraph only) for formatting text based on this title: ${title} and contains only 3 lines of text.
          Never use both ${title} and ${role} together in a title of the post!
          Always ignore ${role} only in the name of title of the post!
          It is not necessary to write each sentence with a new heading and start on a new line.
          Write text with one heading and continue as regular text.
          Start writing sentences from a paragraph only if it makes sense.
          Write the post as experienced writer using ${role} style of writing posts.
          Always write post content according to the meaning of ${title} and ${role} and including them in the text.
          `,
				},
				{
					role: 'system',
					content: `${
						role || 'Style of the post'
					}. Write using html tags for text formatting.`,
				},
			],
			model: 'gpt-3.5-turbo',
			temperature: 0,
		});

		return NextResponse.json(
			{
				content: aiResponse.choices[0].message?.content,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('request error', error);
		return NextResponse.json({ error: 'error updating post' }, { status: 500 });
	}
}
