'use strict';

module.exports = ({ strapi }) => {
  const parserService = strapi.plugin("awesome-help").service("parserService");
  const parse = async (ctx) => {
    try {
      await parserService.parse(ctx.query);
      ctx.body = { done: true };
    }
    catch (exp) {
      throw exp;
    }
  };
  return { parse };
};
