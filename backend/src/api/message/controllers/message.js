'use strict';

/**
 *  message controller
 */

const { nanoid } = require('nanoid');

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::message.message', ({ strapi }) => ({
  async find(ctx) {
    const entries = await strapi.entityService.findMany(
      'api::message.message',
      {
        sort: { createdAt: 'DESC' },
        limit: 5,
      }
    );

    const sanitizedEntries = await this.sanitizeOutput(entries, ctx);

    return this.transformResponse(sanitizedEntries);
  },

  async create(ctx) {
    ctx.request.body.data = {
      ...ctx.request.body.data,
      uid: nanoid(),
      timesUpdated: 0,
    };
    const response = await super.create(ctx);
    return response;
  },

  async update(ctx) {
    const { id } = ctx.params;

    const entry = await strapi.entityService.findOne(
      'api::message.message',
      id
    );

    delete ctx.request.body.data.uid;
    delete ctx.request.body.data.postedBy;

    ctx.request.body.data = {
      ...ctx.request.body.data,
      timesUpdated: entry.timesUpdated + 1,
    };

    const response = await super.update(ctx);

    return response;
  },
}));
