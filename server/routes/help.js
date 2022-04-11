'use strict';

module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/helps',
      handler: 'helpController.findMany',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/helps/contentTypes/:slug',
      handler: 'helpController.findManyByContentType',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/helps',
      handler: 'helpController.update',
      config: { policies: [] }
    }
  ]
}
