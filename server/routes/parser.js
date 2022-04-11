'use strict';

module.exports = {
  type: 'admin',
  routes: [
      {
          method: 'GET',
          path: '/parse',
          handler: 'parserController.parse',
          config: { policies: [] }
      }
  ]
}
