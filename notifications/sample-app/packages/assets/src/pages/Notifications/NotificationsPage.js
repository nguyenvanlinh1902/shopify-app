import React from 'react';
import {Layout, Page} from '@shopify/polaris';
import TableComponent from '@assets/loadables/Notifications/Table';

/**
 * NotFound page is shown when BrowserRoute doesn't match any defined routes
 *
 * @return {React.ReactElement}
 * @constructor
 */
export default function NotificationsPage() {
  return (
    <Page title="Notifications" subtitle="List of sales notifcation from Shopify">
      <Layout sectioned>
        <TableComponent />
      </Layout>
    </Page>
  );
}
