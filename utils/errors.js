function createError(status, message, details = {}) {
  return {
    error: {
      status,
      message,
      details,
      timestamp: new Date().toISOString()
    }
  };
}

module.exports = { createError };
