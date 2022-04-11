import { request } from '@strapi/helper-plugin';

const ParserProxy = {
  parse: async () => {
    const data = await request(`/awesome-help/parse`, {
      method: 'GET'
    });
    return data;
  },
  check: async () => {
    const data = await request(`/awesome-help/check`, {
      method: 'GET'
    });
    return data;
  },
}
export default ParserProxy;
