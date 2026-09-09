export const parseImages = (urlStr: string | null | undefined): string[] => {
  if (!urlStr) return [];
  if (urlStr.startsWith('[')) {
    try {
      const arr = JSON.parse(urlStr);
      if (Array.isArray(arr) && arr.length > 0) return arr;
    } catch {}
  }
  return [urlStr];
};
