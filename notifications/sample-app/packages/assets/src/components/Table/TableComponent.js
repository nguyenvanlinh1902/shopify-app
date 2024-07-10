import React, { useState, useEffect } from 'react';
import { LegacyCard, ResourceList, ResourceItem, Spinner } from '@shopify/polaris';
import NotificationPopup from '../../components/NotificationPopup/NotificationPopup';
import useFetchApi from '@assets/hooks/api/useFetchApi';

function TableComponent() {
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');
  const [selectedItems, setSelectedItems] = useState([]);
  const { data: items, loading } = useFetchApi({
    url: '/notifications',
    defaultData: []
  });

  const resourceName = {
    singular: 'customer',
    plural: 'customers'
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner accessibilityLabel="Loading notifications" size="large" />
      </div>
    );
  }

  return (
    <LegacyCard>
      <ResourceList
        resourceName={resourceName}
        items={items}
        renderItem={renderItem}
        sortValue={sortValue}
        sortOptions={[
          { label: 'Newest update', value: 'DATE_MODIFIED_DESC' },
          { label: 'Oldest update', value: 'DATE_MODIFIED_ASC' }
        ]}
        onSortChange={selected => setSortValue(selected)}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        selectable
      />
    </LegacyCard>
  );

  function renderItem(item) {
    const { id, url, name, location, latestOrderUrl, timestamp } = item;
    const date = new Date(timestamp);
    const options = { month: 'long', day: 'numeric' };
    const year = date.getFullYear();
    const formattedDate = date.toLocaleDateString('en-US', options);
    const media =<NotificationPopup data={item} />;
    const shortcutActions = latestOrderUrl
      ? [{ content: 'View latest order', url: latestOrderUrl }]
      : undefined;
    return (
      <ResourceItem
        id={id}
        url={url}
        media={media}
        accessibilityLabel={`View details for ${name}`}
        shortcutActions={shortcutActions}
        persistActions
      >
        <div className="mp-right time">
          From {formattedDate} {year}
        </div>
      </ResourceItem>
    );
  }
}

export default TableComponent;
