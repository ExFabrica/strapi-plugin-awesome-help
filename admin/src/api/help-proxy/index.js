import { request } from '@strapi/helper-plugin';

const HelpProxy = {
  get: async () => {
    const data = await request(`/awesome-help/helps`, {
      method: 'GET'
    });
    return data;
  },
  getByContentType: async (slug) => {
    const data = await request(`/awesome-help/helps/contentTypes/${slug}`, {
      method: 'GET'
    });
    return data;
  },
  update: async (data) => {
    return await request(`/awesome-help/helps`, {
      method: 'POST',
      body: data
    });
  }
}
export default HelpProxy;
