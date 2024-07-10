/**
 * Chunk an array into smaller arrays of a specified size
 * @param {Array} array
 * @param {number} chunkSize
 * @return {Array[]}
 */
export default function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
