import React, { useRef, useEffect, useState } from 'react';
//I18N
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
//Strapi Design-System components
import { Stack } from '@strapi/design-system/Stack';
import { Main } from '@strapi/design-system/Main';
import { ContentLayout } from '@strapi/design-system/Layout';
import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import Check from '@strapi/icons/Check';
import { HeaderLayout } from '@strapi/design-system/Layout';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { ToggleInput } from '@strapi/design-system/ToggleInput';
// From Strapi helper
import {
  LoadingIndicatorPage,
  useNotification,
} from '@strapi/helper-plugin';
//Version
import { version as packageVersion } from '../../../../package.json';
//Proxy
import SettingsProxy from '../../api/settings-proxy';

const Settings = () => {
  const { formatMessage } = useIntl();
  const isMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState();
  const toggleNotification = useNotification();

  //mount
  useEffect(() => {
    SettingsProxy.get().then((data) => {
      setSettings(data);
      setIsLoading(false);
    });
    // unmount
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = async () => {
    setIsSaving(true);
    const data = await SettingsProxy.set(settings);
    setSettings(data);
    setIsSaving(false);
    toggleNotification({
      type: 'success',
      message: { id: getTrad("plugin.settings.button.save.message") },
    });
  };

  return (
    <>
      <Main labelledBy="title" aria-busy={isLoading}>
        <HeaderLayout
          id="title"
          title={formatMessage({ id: getTrad("plugin.settings.title") })}
          subtitle={formatMessage({ id: getTrad("plugin.settings.version") }, { version: packageVersion })}
          primaryAction={
            isLoading ? <></> :
              <Button onClick={handleSubmit} startIcon={<Check />} size="L" disabled={isSaving} loading={isSaving}>
                {formatMessage({ id: getTrad("plugin.settings.button.save.label") })}
              </Button>
          }
        >
        </HeaderLayout>
        {isLoading ? (<LoadingIndicatorPage />)
          : <ContentLayout>
            <form onSubmit={handleSubmit}>
              <Box
                background="neutral0"
                hasRadius
                shadow="filterShadow"
                paddingTop={6}
                paddingBottom={6}
                paddingLeft={7}
                paddingRight={7}
              >
                <Stack size={3}>
                  <h2>
                    {formatMessage({
                      id: getTrad("plugin.settings.general.title")
                    })}
                  </h2>
                  <Grid gap={6}>
                    <GridItem col={12} s={12}>
                      <ToggleInput
                        checked={settings?.enabled ?? false}
                        hint={formatMessage({ id: getTrad("plugin.settings.enabled.descr") })}
                        label={formatMessage({ id: getTrad("plugin.settings.enabled") })}
                        name="moduleEnabled"
                        offLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.off-label',
                          defaultMessage: 'Off',
                        })}
                        onLabel={formatMessage({
                          id: 'app.components.ToggleCheckbox.on-label',
                          defaultMessage: 'On',
                        })}
                        onChange={(e) => {
                          setSettings({
                            enabled: e.target.checked
                          });
                        }
                        }
                      />
                    </GridItem>
                  </Grid>
                </Stack>
              </Box>
            </form>
          </ContentLayout>
        }
      </Main>
    </>
  );
};

export default Settings;
