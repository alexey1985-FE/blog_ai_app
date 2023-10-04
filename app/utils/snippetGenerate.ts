export const snippetGenerate = (content: string): string  => {
  const strippedContent = content.replace(/<[^>]+>/g, '')
  return strippedContent.length <= 256
    ? strippedContent
    : strippedContent.slice(0, 256) + '...';
}
