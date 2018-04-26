const authMiddleware = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      if (error.status === 401) {
        ctx.body = {
          code: 2,
          message: '未登录,请先登录!'
        };
      } else {
        throw error;
      }
    }
  };
};
module.exports = authMiddleware;
