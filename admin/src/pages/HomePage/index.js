/*
 *
 * Plugin Awesome Help -> HomePage
 *
 */
import React, { memo, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import pluginId from "../../pluginId";
//I18n
import { useIntl } from 'react-intl';
import getTrad from '../../utils/getTrad';
//Some components from Strapi helper
import {
  LoadingIndicatorPage,
  useNotification
} from '@strapi/helper-plugin';
//Layout
import { ContentLayout, HeaderLayout, Layout } from '@strapi/design-system/Layout';
//Strapi Design-System components
import { Main } from '@strapi/design-system/Main';
import { Button } from "@strapi/design-system/Button";
import Cog from "@strapi/icons/Cog";
//Proxy
import ParserProxy from '../../api/parser-proxy';
import HelpProxy from '../../api/help-proxy';
//Components
import { HelpTable } from "../../components/HelpTable";

const HomePage = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const { formatMessage } = useIntl();
  const { push } = useHistory();
  const toggleNotification = useNotification();

  useEffect(() => {
    console.log(props);
    setIsLoading(true);
    ParserProxy.parse().then(() => {
      HelpProxy.get().then((helpEntities) => {
        setResults(helpEntities);
        setIsLoading(false);
      }, (exp) => {
        setIsLoading(false);
        toggleNotification({
          type: 'error',
          message: `Error getting help entities:${exp.message}`,
        });
      })
    }, (exp) => {
      setIsLoading(false);
      toggleNotification({
        type: 'error',
        message: `Error in parsing process:${exp.message}`,
      });
    });
  }, []);

  const configure = () => {
    push(`/settings/${pluginId}/`);
  };

  return <Main labelledBy="title" aria-busy={isLoading}>
    <HeaderLayout
      id="title"
      title={formatMessage({ id: getTrad("plugin.homepage.title") })}
      subtitle={formatMessage({ id: getTrad("plugin.homepage.subtitle") })}
      secondaryAction={
        <Button variant="tertiary" onClick={configure} startIcon={<Cog />}>
          {formatMessage({ id: getTrad("plugin.help.settings") })}
        </Button>
      }>
    </HeaderLayout>
    <ContentLayout>
      {isLoading ? <LoadingIndicatorPage /> :
        <Layout>
          <HelpTable data={results}></HelpTable>
        </Layout>
      }
    </ContentLayout>
  </Main>
};

export default memo(HomePage);
