/**
 * product controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({

    async create(ctx) {
      if (!ctx.state.user) {
        return ctx.unauthorized("Debes estar autenticado");
      }

      const { id: userId, role } = ctx.state.user;

      let foundationId = (ctx.request.body as any).data?.foundation ?? null;

      if (role.name === "foundation") {
        const foundations = await strapi
          .documents("api::foundation.foundation")
          .findMany({ filters: { usuario: userId } as any });

        if (!foundations.length) {
          return ctx.badRequest("No tienes una fundación registrada");
        }

        foundationId = foundations[0].documentId;
      }

      const product = await strapi
        .documents("api::product.product")
        .create({
          data: {
            ...(ctx.request.body as any).data,
            ...(foundationId ? { foundation: foundationId } : {}),
          },
          status: "published",
        });

      const sanitized = await this.sanitizeOutput(product, ctx);
      return this.transformResponse(sanitized);
    },

    async update(ctx) {
      if (!ctx.state.user) {
        return ctx.unauthorized("Debes estar autenticado");
      }

      const { id: userId, role } = ctx.state.user;
      const { id: documentId } = ctx.params;

      const product = await strapi
        .documents("api::product.product")
        .findOne({
          documentId,
          populate: { usuario: { fields: ["id"] } } as any,
        });

      if (!product) return ctx.notFound("Producto no encontrado");

      const owner = (product as any).usuario?.id;
      if (owner !== userId && role.name !== "admin") {
        return ctx.forbidden("No tienes permiso para editar este producto");
      }

      const updated = await strapi
        .documents("api::product.product")
        .update({
          documentId,
          data: (ctx.request.body as any).data,
          status: "published",
        });

      const sanitized = await this.sanitizeOutput(updated, ctx);
      return this.transformResponse(sanitized);
    },

    async delete(ctx) {
      if (!ctx.state.user) {
        return ctx.unauthorized("Debes estar autenticado");
      }

      const { id: userId, role } = ctx.state.user;
      const { id: documentId } = ctx.params;

      const product = await strapi
        .documents("api::product.product")
        .findOne({
          documentId,
          populate: { usuario: { fields: ["id"] } } as any,
        });

      if (!product) return ctx.notFound("Producto no encontrado");

      const owner = (product as any).usuario?.id;
      if (owner !== userId && role.name !== "admin") {
        return ctx.forbidden("No tienes permiso para eliminar este producto");
      }

      const deleted = await strapi
        .documents("api::product.product")
        .delete({ documentId });

      const sanitized = await this.sanitizeOutput(deleted, ctx);
      return this.transformResponse(sanitized);
    },
  }),
);