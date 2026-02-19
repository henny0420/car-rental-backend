const asyncHandler = async (fn) => {
  return async (req, res, next) => {
    try {
      await fn();
    } catch (error) {
      return res.json({
        error,
        success: false,
      });
    }
  };
};

module.exports = asyncHandler;