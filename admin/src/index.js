import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
// Plugin icon
import PluginIcon from './components/PluginIcon';
// I18N
import getTrad from './utils/getTrad';
//Component to inject in Strapi UI
import { StrapiListZoneItem } from './components/Injected/strapi-list-zone-item';

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "[request]" */ './pages/App');
        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });

    // Create the settings section and inject the plugin settings component.
    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: { id: getTrad('plugin.name'), defaultMessage: 'Awesome Help' },
      },
      [
        {
          intlLabel: {
            id: getTrad("plugin.settings.help.title"),
            defaultMessage: "General settings"
          },
          id: 'settings',
          to: `/settings/${pluginId}`,
          Component: async () => {
            return import("./pages/Settings");
          },
        },
      ]
    );

    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  bootstrap(app) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'hal-9000-awesome-help',
      Component: StrapiListZoneItem,
    });
  },

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );
    return Promise.resolve(importedTrads);
  },
};
