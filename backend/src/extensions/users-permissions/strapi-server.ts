export default (plugin: any) => {
  plugin.controllers.user.setRole = async (ctx: any) => {
    if (!ctx.state.user) {
      return ctx.unauthorized("Debes estar autenticado");
    }

    const { role } = ctx.request.body;

    const roleMap: any = {
      member: "member",
      entrepreneur: "entrepreneur",
      foundation: "foundation",
    };

    const roleName = roleMap[role?.toLowerCase()];

    if (!roleName) {
      return ctx.badRequest(
        'Rol no válido. Debe ser "member", "entrepreneur" o "foundation"',
      );
    }

    const roleEntity = await strapi
      .query("plugin::users-permissions.role")
      .findOne({
        where: { name: roleName },
      });

    if (!roleEntity) {
      return ctx.internalServerError(`Rol "${roleName}" no encontrado`);
    }

    await strapi.entityService.update(
      "plugin::users-permissions.user",
      ctx.state.user.id,
      {
        data: { role: roleEntity.id },
      },
    );

    return ctx.send({
      message: `Rol "${roleName}" asignado correctamente`,
    });
  };

  plugin.routes["content-api"].routes.push({
    method: "POST",
    path: "/users/set-role",
    handler: "user.setRole",
    config: {
      prefix: "",
      policies: [],
      auth: {},
    },
  });

  return plugin;
};
