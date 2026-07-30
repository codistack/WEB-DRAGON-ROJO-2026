export function getDirectImageUrl(url: string): string {
  if (!url) return '/icon.svg';
  const clean = url.trim();
  
  // Imgur album link e.g. https://imgur.com/a/IYGNbmi
  if (clean.includes('imgur.com/a/')) {
    const id = clean.split('imgur.com/a/')[1]?.split('/')[0]?.split('?')[0]?.split('#')[0];
    if (id) return `https://i.imgur.com/${id}.png`;
  }
  
  // Imgur page link e.g. https://imgur.com/IYGNbmi
  if (clean.includes('imgur.com/') && !clean.includes('i.imgur.com/')) {
    const id = clean.split('imgur.com/')[1]?.split('/')[0]?.split('?')[0]?.split('#')[0];
    if (id) return `https://i.imgur.com/${id}.png`;
  }
  
  return clean;
}
