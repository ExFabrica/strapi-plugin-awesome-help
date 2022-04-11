import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
//I18N
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
// Strapi Design UI system
import {
  ModalLayout,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@strapi/design-system/ModalLayout';
import { Breadcrumbs, Crumb } from '@strapi/design-system/Breadcrumbs';
import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import { Stack } from '@strapi/design-system/Stack';
import { Typography } from '@strapi/design-system/Typography';
import { Textarea } from '@strapi/design-system/Textarea';
// Strapi Helper
import {
  LoadingIndicatorPage,
} from '@strapi/helper-plugin';

export const ModalForm = ({ help, onToggle, onSave }) => {
  const { formatMessage } = useIntl();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [innerHelp, setInnerHelp] = useState(undefined);

  useEffect(() => {
    setInnerHelp(help);
    setIsLoading(false);
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    onSave(innerHelp);
    setIsSaving(false);
    onToggle();
  };

  return (
    <ModalLayout onClose={onToggle} labelledBy="title">
      <ModalHeader>
        <Breadcrumbs label={"Header Title"}>
          <Crumb>
            {formatMessage({
              id: getTrad('plugin.help.modal.title'),
              defaultMessage: 'Help Edit',
            })
            }
          </Crumb>
        </Breadcrumbs>
      </ModalHeader>
      {isLoading ? (<LoadingIndicatorPage />)
        :
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Stack size={2}>
              <Box>
                <Typography variant="beta" as="h2">
                  {formatMessage({
                    id: getTrad('plugin.help.modal.details'),
                    defaultMessage: 'Contextual help details',
                  })
                  }
                </Typography>
                <Box paddingTop={4}>
                  <Stack size={1}>
                    <Textarea
                      placeholder={formatMessage({
                        id: getTrad('plugin.help.modal.content.placeholder'),
                        defaultMessage: 'Contextual help details',
                      })}
                      label={formatMessage({
                        id: getTrad('plugin.help.modal.content.label'),
                        defaultMessage: 'Contextual help details',
                      })} name="content"
                      hint={formatMessage({
                        id: getTrad('plugin.help.modal.content.hint'),
                        defaultMessage: 'Contextual help details',
                      })}
                      value={innerHelp.helpContent}
                      onChange={(e) => {
                        setInnerHelp({ ...innerHelp, helpContent: e.target.value });
                      }}>
                    </Textarea>
                  </Stack>
                </Box>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter
            startActions={
              <Button variant="tertiary" onClick={onToggle} type="button">
                {formatMessage({
                  id: 'app.components.Button.cancel',
                  defaultMessage: 'Cancel',
                })}
              </Button>
            }
            endActions={
              <Button type="submit" loading={isSaving}>
                {formatMessage({
                  id: getTrad('plugin.help.modal.save.label'),
                  defaultMessage: 'Save',
                })}
              </Button>
            }
          />
        </form>
      }
    </ModalLayout>
  );
};

ModalForm.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  help: PropTypes.object.isRequired,
};
