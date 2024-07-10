/**
 * Separate media into images and videos
 * @param {Array} media
 * @return {Object} {images: Array, videos: Array}
 */
export default function separateMedia(media) {
  const images = [];
  const videos = [];
  media.forEach(item => {
    if (item.media_type === 'IMAGE') {
      images.push(item);
    } else if (item.media_type === 'VIDEO') {
      videos.push(item);
    }
  });
  return {images, videos};
}
