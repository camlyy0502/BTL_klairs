export function getFullImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  // Lấy domain từ biến môi trường
  const api = process.env.REACT_APP_API?.replace(/\/$/, '');
  // Đảm bảo url không có dấu / thừa
  return api + (url.startsWith('/') ? url : '/' + url);
}