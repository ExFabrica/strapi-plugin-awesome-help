module.exports = {
    // accessible only from admin UI
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/settings',
        handler: 'settingsController.getSettings',
        config: { policies: [] }
      },
      {
        method: 'POST',
        path: '/settings',
        handler: 'settingsController.setSettings',
        config: { policies: [] }
      }
    ]
  }
