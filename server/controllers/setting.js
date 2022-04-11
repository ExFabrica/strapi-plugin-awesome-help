'use strict';

module.exports = ({ strapi }) => {
  const settingService = strapi.plugin("awesome-help").service("settingsService");
  const getSettings = async (ctx) => {
    try {
      ctx.body = await settingService.getSettings();
    }
    catch (err) {
      ctx.throw(500, err);
    }
  };
  const setSettings = async (ctx) => {
    const { body } = ctx.request;
    try {
      ctx.body = await settingService.setSettings(body);
    }
    catch (err) {
      ctx.throw(500, err);
    }
  };
  return {
    getSettings,
    setSettings
  }
};
