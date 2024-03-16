// authenticationMiddleware.js
function authenticateApiKey(req, res, next) {
  const apiKeyHeader = req.headers["x-api-key"];
  const apiKey = process.env.API_KEY;
  if (apiKeyHeader && apiKeyHeader === apiKey) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = authenticateApiKey;
