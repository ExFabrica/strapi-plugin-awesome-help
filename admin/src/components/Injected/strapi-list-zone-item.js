import React, { useState, useEffect } from 'react';
// I18N
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
// Strapi Design System
import { Portal } from '@strapi/design-system/Portal';
import { Typography } from '@strapi/design-system/Typography';
import { Divider } from '@strapi/design-system/Divider';
import { Box } from '@strapi/design-system/Box';
import { ToggleInput } from '@strapi/design-system/ToggleInput';
// Context from Strapi Helper.
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
//API proxy
import HelpProxy from "../../api/help-proxy";
import SettingsProxy from "../../api/settings-proxy";
// Strapi UI Decorator component
import { StrapiUIDecorator } from './strapi-ui-decorator'

export const StrapiListZoneItem = ({ strapi }) => {
  const { formatMessage } = useIntl();
  const { slug } = useCMEditViewDataManager();
  const [results, setResults] = useState([]);
  const [enable, setEnable] = useState(false);

  useEffect(() => {
    HelpProxy.getByContentType(slug).then(helpItems => {
      setResults(helpItems);
      if (helpItems && helpItems.length > 0) {
        SettingsProxy.get().then((settings) => {
          setEnable(settings.enabled);
        });
      }
    });
  }, []);

  return (
    <Box
      background="neutral0"
      hasRadius
      shadow="filterShadow"
      paddingTop={6}
      paddingBottom={4}
      paddingLeft={3}
      paddingRight={3}
    >
      <Typography variant="sigma" textColor="neutral600">
        {formatMessage({ id: getTrad("plugin.help.zone.title") })}
      </Typography>
      <Box paddingTop={2} paddingBottom={6}>
        <Divider />
      </Box>

      <Typography textColor="neutral600">
        {`${formatMessage({ id: getTrad("plugin.help.zone.available") })} ${results.length}`}
      </Typography>

      <Box paddingBottom={4}></Box>

      <ToggleInput
        checked={enable}
        label={formatMessage({ id: getTrad("plugin.help.zone.button.enable") })}
        offLabel="Off"
        onLabel="On"
        onChange={(e) => setEnable(!enable)}
      />

      <Portal>
        <StrapiUIDecorator helpItems={results} enable={enable} />
      </Portal>
    </Box>
  );
};
