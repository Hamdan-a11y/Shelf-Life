function formatBookTitle(title, author) {
  return `"${title}" by "${author}"`;
}
function createBook(title, author, year) {
  return {
    title: title,
    author: author,
    year: year
  };
}
module.exports = { formatBookTitle, createBook };