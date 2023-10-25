export const snippetGenerate = (content: string): string => {
	const match = /<p>(.*?)<\/p>/i.exec(content);

	if (match) {
		const firstParagraphText = match[1];

		const maxTextLength = 256;

		if (firstParagraphText.length > maxTextLength) {
			return firstParagraphText.slice(0, maxTextLength) + '...';
		}

		return firstParagraphText + '...';
	}

	return '';
};
