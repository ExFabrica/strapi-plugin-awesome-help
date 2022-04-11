
import React, { useState } from 'react';
// I18N
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
// Strapi Design UI system
import { IconButton } from "@strapi/design-system/IconButton";
import Pencil from "@strapi/icons/Pencil";
import { Table, Thead, Tbody, Tr, Td, Th } from "@strapi/design-system/Table";
import { Typography } from "@strapi/design-system/Typography";
// Strapi Helper
import {
  useNotification,
} from '@strapi/helper-plugin';
// Proxy
import HelpProxy from '../../api/help-proxy';
// Modal Form component
import { ModalForm } from "../ModalForm";

export const HelpTable = ({ data }) => {
  const { formatMessage } = useIntl();
  const [isModalOpened, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const toggleNotification = useNotification();

  const handleToggle = () => {
    setIsModalOpen(prev => !prev);
  };
  const refreshDataGrid = (updatedEntity) => {
    let helpEntities = data.filter(item => item.id === updatedEntity.id);
    if (helpEntities && helpEntities.length > 0) {
      helpEntities[0].helpContent = updatedEntity.helpContent;
    }
  };
  const handleSave = async (updatedEntity) => {
    if (updatedEntity) {
      refreshDataGrid(updatedEntity);
      try {
        await HelpProxy.update(updatedEntity);
        toggleNotification({
          type: 'success',
          message: { id: getTrad("plugin.help.table.edit.save.message") },
        });
      }
      catch (exp) {
        toggleNotification({
          type: 'error',
          message: { id: getTrad("plugin.help.table.edit.save.error") },
        });
      }
    }
  };
  const handleEdit = (row) => {
    setSelectedRow(row);
    setIsModalOpen(prev => !prev);
  };
  return (
    <>
      {data && data.length > 0 ?
        <>
          {isModalOpened && <ModalForm onToggle={handleToggle} onSave={handleSave} help={selectedRow} />}
          <Table colCount={5} rowCount={data.length}>
            <Thead>
              <Tr>
                <Th>
                  <Typography variant="sigma">
                    {formatMessage({ id: getTrad("plugin.help.table.contentType") })}
                  </Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">
                    {formatMessage({ id: getTrad("plugin.help.table.path") })}
                  </Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">
                    {formatMessage({ id: getTrad("plugin.help.table.fieldName") })}
                  </Typography>
                </Th>

                <Th>
                  <Typography variant="sigma">
                    {formatMessage({ id: getTrad("plugin.help.table.help") })}
                  </Typography>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((item, index) => {
                return (
                  <Tr key={`contentpage-${index}`}>
                    <Td>
                      <Typography
                        textColor="neutral800"
                        fontWeight="inherited"
                      >
                        {item.contentType}
                      </Typography>
                    </Td>
                    <Td style={{ whiteSpace: "break-spaces" }}>
                      <Typography
                        textColor="neutral800"
                        fontWeight="inherited"
                      >
                        {item.path}
                      </Typography>
                    </Td>
                    <Td>
                      <Typography
                        textColor="neutral800"
                        fontWeight="inherited"
                      >
                        {item.fieldName}
                      </Typography>
                    </Td>
                    <Td>
                      <Typography
                        textColor="neutral800"
                        fontWeight="inherited"
                      >
                        {item.helpContent && item.helpContent.length > 50 ? `${item.helpContent.substring(0, 49)}...` : item.helpContent}
                      </Typography>
                    </Td>
                    <Td>
                      <IconButton
                        label="Edit"
                        noBorder
                        icon={<Pencil />}
                        onClick={(e) => {
                          e.preventDefault();
                          handleEdit({ ...item });
                        }}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </> :
        <Typography variant="omega" fontWeight="semiBold">
          {formatMessage({ id: getTrad("plugin.help.table.nodata") })}
        </Typography>
      }
    </>
  );
};

HelpTable.defaultProps = {
  data: [],
};
