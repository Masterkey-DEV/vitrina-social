import { factories } from "@strapi/strapi";
export default factories.createCoreController(
  "api::iniciative.iniciative",
  ({ strapi }) => ({
    async create(ctx) {
      if (!ctx.state.user) return ctx.unauthorized("Debes estar autenticado");
      const { id: userId, role } = ctx.state.user;
      if (role.name !== "foundation")
        return ctx.forbidden("Solo fundaciones pueden crear iniciativas");
      const foundations = await strapi.entityService.findMany(
        "api::foundation.foundation",
        {
          filters: { usuario: userId },
        },
      );
      if (!foundations.length)
        return ctx.badRequest("No tienes una fundación registrada");
      const initiative = await strapi.entityService.create(
        "api::iniciative.iniciative",
        {
          data: {
            ...ctx.request.body.data,
            foundation: foundations[0].id,
          } as any,
        },
      );
      const sanitized = await this.sanitizeOutput(initiative, ctx);
      return this.transformResponse(sanitized);
    },
    async join(ctx) {
      if (!ctx.state.user) return ctx.unauthorized("Debes estar autenticado");
      const { id: userId, role } = ctx.state.user;
      const { id } = ctx.params;
      if (role.name !== "member")
        return ctx.forbidden('Solo usuarios con rol "member" pueden unirse');
      const initiative = (await strapi.entityService.findOne(
        "api::iniciative.iniciative",
        id,
        {
          populate: ["users"],
        },
      )) as any;
      if (!initiative) return ctx.notFound("Iniciativa no encontrada");
      const alreadyJoined = initiative.users_permissions_users?.some(
        (u: any) => u.id === userId,
      );
      if (alreadyJoined)
        return ctx.badRequest("Ya eres miembro de esta iniciativa");
      const currentUserIds = (initiative.users_permissions_users || []).map(
        (u: any) => u.id,
      );
      const updated = await strapi.entityService.update(
        "api::iniciative.iniciative",
        id,
        {
          data: { users_permissions_users: [...currentUserIds, userId] } as any,
        },
      );
      const sanitized = await this.sanitizeOutput(updated, ctx);
      return this.transformResponse(sanitized);
    },
    async leave(ctx) {
      if (!ctx.state.user) return ctx.unauthorized("Debes estar autenticado");
      const { id: userId } = ctx.state.user;
      const { id } = ctx.params;
      const initiative = (await strapi.entityService.findOne(
        "api::iniciative.iniciative",
        id,
        {
          populate: ["users"],
        },
      )) as any;
      if (!initiative) return ctx.notFound("Iniciativa no encontrada");
      const updatedUsers = (initiative.users_permissions_users || [])
        .filter((u: any) => u.id !== userId)
        .map((u: any) => u.id);
      const updated = await strapi.entityService.update(
        "api::iniciative.iniciative",
        id,
        {
          data: { users_permissions_users: updatedUsers } as any,
        },
      );
      const sanitized = await this.sanitizeOutput(updated, ctx);
      return this.transformResponse(sanitized);
    },
    async update(ctx) {
      if (!ctx.state.user) return ctx.unauthorized("Debes estar autenticado");
      const { id: userId, role } = ctx.state.user;
      const { id } = ctx.params;
      if (role.name !== "foundation")
        return ctx.forbidden("Solo fundaciones pueden editar iniciativas");
      const initiative = (await strapi.entityService.findOne(
        "api::iniciative.iniciative",
        id,
        {
          populate: ["foundation", "foundation.users_permissions_user"],
        },
      )) as any;
      if (!initiative) return ctx.notFound("Iniciativa no encontrada");
      if (initiative.foundation?.users_permissions_user?.id !== userId)
        return ctx.forbidden("No tienes permiso para editar esta iniciativa");
      const updated = await strapi.entityService.update(
        "api::iniciative.iniciative",
        id,
        {
          data: ctx.request.body.data,
        },
      );
      const sanitized = await this.sanitizeOutput(updated, ctx);
      return this.transformResponse(sanitized);
    },
    async delete(ctx) {
      if (!ctx.state.user) return ctx.unauthorized("Debes estar autenticado");
      const { id: userId, role } = ctx.state.user;
      const { id } = ctx.params;
      if (role.name !== "foundation")
        return ctx.forbidden("Solo fundaciones pueden eliminar iniciativas");
      const initiative = (await strapi.entityService.findOne(
        "api::iniciative.iniciative",
        id,
        {
          populate: ["foundation", "foundation.users_permissions_user"],
        },
      )) as any;
      if (!initiative) return ctx.notFound("Iniciativa no encontrada");
      if (initiative.foundation?.users_permissions_user?.id !== userId)
        return ctx.forbidden("No tienes permiso para eliminar esta iniciativa");
      const deleted = await strapi.entityService.delete(
        "api::iniciative.iniciative",
        id,
      );
      const sanitized = await this.sanitizeOutput(deleted, ctx);
      return this.transformResponse(sanitized);
    },
  }),
);
