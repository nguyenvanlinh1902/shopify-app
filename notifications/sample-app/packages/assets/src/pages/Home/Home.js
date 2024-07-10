import React from 'react';
// eslint-disable-next-line no-unused-vars
import {EmptyState, Layout, Page} from '@shopify/polaris';
import EnableModule from '@assets/loadables/Home/EnableModule';

/**
 * NotFound page is shown when BrowserRoute doesn't match any defined routes
 *
 * @return {React.ReactElement}
 * @constructor
 */
export default function NotificationsPage() {
  return (
    <Page title="Home" primaryAction={{content: 'Back to Home', url: '/'}}>
      <Layout sectioned>
        <EnableModule />
      </Layout>
    </Page>
  );
}
