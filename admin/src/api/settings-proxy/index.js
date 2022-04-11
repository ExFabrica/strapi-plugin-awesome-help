import { request } from '@strapi/helper-plugin';

const settingsProxy = {
  get: async () => {
    const data = await request(`/awesome-help/settings`, {
      method: 'GET'
    });
    return data;
  },
  set: async (data) => {
    return await request(`/awesome-help/settings`, {
      method: 'POST',
      body: data
    });
  }
}
export default settingsProxy;
