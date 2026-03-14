import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::foundation.foundation",
  ({ strapi }) => ({
    async create(ctx) {
      if (!ctx.state.user) {
        return ctx.unauthorized("Debes estar autenticado");
      }

      const userId = ctx.state.user.id;
      const userDocId = ctx.state.user.documentId as string;

      // 1. Verificar que el usuario no tenga fundación ya registrada
      const existing = await strapi
        .documents("api::foundation.foundation")
        .findMany({
          filters: { usuario: { id: { $eq: userId } } },
        });

      if (existing.length > 0) {
        return ctx.badRequest("Ya tienes una fundación registrada");
      }

      // 2. Crear la fundación vinculada al usuario
      const foundation = await strapi
        .documents("api::foundation.foundation")
        .create({
          data: {
            ...ctx.request.body.data,
            usuario: userDocId, // campo correcto del schema, documentId para v5
          },
        });

      // 3. Obtener rol foundation
      const foundationRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: "foundation" } });

      if (!foundationRole) {
        return ctx.internalServerError(
          'Rol "foundation" no encontrado. Créalo en Settings → Roles.',
        );
      }

      // 4. Asignar rol al usuario
      await strapi.documents("plugin::users-permissions.user").update({
        documentId: userDocId,
        data: { role: foundationRole.id },
      });

      // 5. Generar JWT nuevo con rol actualizado
      const freshJwt = strapi
        .plugin("users-permissions")
        .service("jwt")
        .issue({ id: userId });

      // 6. Respuesta
      const sanitized = await this.sanitizeOutput(foundation, ctx);
      const transformed = this.transformResponse(sanitized) as any;

      return { ...transformed, jwt: freshJwt };
    },

    async update(ctx) {
      if (!ctx.state.user) {
        return ctx.unauthorized("Debes estar autenticado");
      }

      const userId = ctx.state.user.id;
      const role = ctx.state.user.role;
      const { id } = ctx.params; // documentId en Strapi v5

      // FIX: minúscula "foundation", no "foundation"
      if (role.type !== "foundation") {
        return ctx.forbidden("Solo fundaciones pueden editar su perfil");
      }

      const foundation = (await strapi
        .documents("api::foundation.foundation")
        .findOne({
          documentId: id,
          populate: ["usuario"],
        })) as any;

      if (!foundation) {
        return ctx.notFound("Fundación no encontrada");
      }

      // FIX: campo correcto "usuario"
      if (foundation.usuario?.id !== userId) {
        return ctx.forbidden("No tienes permiso para editar esta fundación");
      }

      const updated = await strapi
        .documents("api::foundation.foundation")
        .update({
          documentId: id,
          data: ctx.request.body.data,
        });

      const sanitized = await this.sanitizeOutput(updated, ctx);
      return this.transformResponse(sanitized);
    },

    async delete(ctx) {
      if (!ctx.state.user) {
        return ctx.unauthorized("Debes estar autenticado");
      }

      const userId = ctx.state.user.id;
      const role = ctx.state.user.role;
      const { id } = ctx.params;

      // FIX: minúscula "foundation"
      if (role.type !== "foundation") {
        return ctx.forbidden("Solo fundaciones pueden eliminar su perfil");
      }

      const foundation = (await strapi
        .documents("api::foundation.foundation")
        .findOne({
          documentId: id,
          populate: ["usuario"],
        })) as any;

      if (!foundation) {
        return ctx.notFound("Fundación no encontrada");
      }

      // FIX: campo correcto "usuario" (antes decía users_permissions_user)
      if (foundation.usuario?.id !== userId) {
        return ctx.forbidden("No tienes permiso para eliminar esta fundación");
      }

      const deleted = await strapi
        .documents("api::foundation.foundation")
        .delete({
          documentId: id,
        });

      const sanitized = await this.sanitizeOutput(deleted, ctx);
      return this.transformResponse(sanitized);
    },
  }),
);
