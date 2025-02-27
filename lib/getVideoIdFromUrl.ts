export function getVideoIdFromUrl(url: string): string | null {
  if (!url) return null;
  
  // Try to create a URL object to validate the input
  let urlObj: URL;
  try {
    urlObj = new URL(url);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // If URL is invalid, return null
    return null;
  }
  
  // Handle youtu.be short links
  if (urlObj.hostname === 'youtu.be') {
    return urlObj.pathname.slice(1) || null;
  }
  
  // Handle youtube.com domains (including www. and m. subdomains)
  if (urlObj.hostname === 'youtube.com' || 
      urlObj.hostname === 'www.youtube.com' || 
      urlObj.hostname === 'm.youtube.com') {
    
    // Handle /watch?v= format
    if (urlObj.pathname === '/watch') {
      return urlObj.searchParams.get('v');
    }
    
    // Handle /shorts/ format
    if (urlObj.pathname.startsWith('/shorts/')) {
      return urlObj.pathname.split('/')[2] || null;
    }
    
    // Handle /embed/ and /v/ formats
    if (urlObj.pathname.startsWith('/embed/') || urlObj.pathname.startsWith('/v/')) {
      return urlObj.pathname.split('/')[2] || null;
    }
  }
  
  // If no patterns match, try regex as fallback
  const regexPatterns = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    /(?:youtube\.com\/shorts\/)([^"&?\/\s]{11})/i
  ];
  
  for (const pattern of regexPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}
