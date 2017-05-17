export const getCurrentPage = function (fullURL) {
  let queryStr = fullURL.substr(fullURL.lastIndexOf('/') + 1)
  let pageStr = queryStr.substr(queryStr.lastIndexOf('=') + 1)
  if (pageStr === 'discover') return 1
  let pageNum = parseInt(pageStr)
  return pageNum
}
