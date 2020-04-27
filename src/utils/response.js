module.exports.response = (statusCode = 200, body = '') => {
  return {
    statusCode,
    body: JSON.stringify(body)
  }
}