const errorHandler = (err, req, res, next) => {
  res.status(res.statusCode || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

module.exports = errorHandler;