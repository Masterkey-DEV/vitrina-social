export default () => async (ctx: any, next: any) => {
  try {
    await next();
  } catch (err: any) {
    // Intercepta el error de usuario duplicado antes de que Strapi lo sanitice
    if (
      err?.message?.toLowerCase().includes("already taken") ||
      err?.name === "ApplicationError"
    ) {
      ctx.status = 400;
      ctx.body = {
        data: null,
        error: {
          status: 400,
          name: "ValidationError",
          message: "Email or Username are already taken",
        },
      };
      return;
    }
    throw err;
  }
};