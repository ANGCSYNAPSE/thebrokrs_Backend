const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`❌ Error [${status}]:`, message);

  // Only expose minimal error info to clients
  const payload = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === 'development') {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
};

export default errorHandler;
