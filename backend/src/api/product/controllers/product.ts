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

      // Si es rol "foundation" se vincula automáticamente a su fundación
      let foundationId = ctx.request.body.data?.foundation ?? null;

      if (role.name === "foundation") {
        const foundations = await strapi.entityService.findMany(
          "api::foundation.foundation",
          {
            filters: { usuario: userId },
          },
        );

        if (!foundations.length) {
          return ctx.badRequest("No tienes una fundación registrada");
        }

        foundationId = foundations[0].id;
      }

      const product = await strapi.entityService.create(
        "api::product.product",
        {
          data: {
            ...ctx.request.body.data,
            ...(foundationId ? { foundation: foundationId } : {}),
          },
        },
      );

      const sanitized = await this.sanitizeOutput(product, ctx);
      return this.transformResponse(sanitized);
    },

    async update(ctx) {
      if (!ctx.state.user) {
        return ctx.unauthorized("Debes estar autenticado");
      }

      const { id: userId, role } = ctx.state.user;
      const { id } = ctx.params;

      // Cast a "any" para acceder a relaciones populadas sin errores de TS
      const product = (await strapi.entityService.findOne(
        "api::product.product",
        id,
        {
          populate: ["foundation", "foundation.usuario"] as any,
        },
      )) as any;

      if (!product) {
        return ctx.notFound("Producto no encontrado");
      }

      // Si tiene fundación, solo el dueño puede editar
      if (product.foundation) {
        if (role.name !== "foundation") {
          return ctx.forbidden("No tienes permiso para editar este producto");
        }

        if (product.foundation.usuario?.id !== userId) {
          return ctx.forbidden("No tienes permiso para editar este producto");
        }
      }

      const updated = await strapi.entityService.update(
        "api::product.product",
        id,
        {
          data: ctx.request.body.data,
        },
      );

      const sanitized = await this.sanitizeOutput(updated, ctx);
      return this.transformResponse(sanitized);
    },

    async delete(ctx) {
      if (!ctx.state.user) {
        return ctx.unauthorized("Debes estar autenticado");
      }

      const { id: userId, role } = ctx.state.user;
      const { id } = ctx.params;

      const product = (await strapi.entityService.findOne(
        "api::product.product",
        id,
        {
          populate: ["foundation", "foundation.users_permissions_user"] as any,
        },
      )) as any;

      if (!product) {
        return ctx.notFound("Producto no encontrado");
      }

      // Si tiene fundación, solo el dueño puede eliminar
      if (product.foundation) {
        if (role.name !== "foundation") {
          return ctx.forbidden("No tienes permiso para eliminar este producto");
        }

        if (product.foundation.usuario?.id !== userId) {
          return ctx.forbidden("No tienes permiso para eliminar este producto");
        }
      }

      const deleted = await strapi.entityService.delete(
        "api::product.product",
        id,
      );

      const sanitized = await this.sanitizeOutput(deleted, ctx);
      return this.transformResponse(sanitized);
    },
  }),
);
