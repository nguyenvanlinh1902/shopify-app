/**
 * Sort an array of media objects by timestamp
 * @param {Array} media
 * @return {Array}
 */
export default function sortByTimeStamp(media) {
  return media.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}
