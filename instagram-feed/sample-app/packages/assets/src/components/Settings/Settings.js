import React from 'react';
import {Card, TextField, FormLayout, Button} from '@shopify/polaris';

/**
 * Settings component for configuring Instagram feed
 * @param {Object} settings - Current settings
 * @param {Function} setSettings - Function to update settings
 * @param {Function} handleSave - Function to handle the save action
 * @returns {React.JSX.Element}
 * @constructor
 */
// eslint-disable-next-line react/prop-types
function Settings({settings, setSettings, handleSave}) {
  return (
    <Card sectioned>
      <FormLayout>
        <TextField
          label="Feed Title"
          value={settings?.title}
          onChange={value => setSettings({...settings, title: value})}
        />
        <TextField
          label="Post Spacing"
          type="number"
          value={settings?.postSpacing}
          onChange={value => setSettings({...settings, postSpacing: parseInt(value, 10)})}
        />
        <FormLayout.Group condensed>
          <TextField
            label="Number of Columns"
            type="number"
            value={settings?.numberOfColumns}
            onChange={value => setSettings({...settings, numberOfColumns: parseInt(value, 10)})}
          />
          <TextField
            label="Number of Rows"
            type="number"
            value={settings?.numberOfRows}
            onChange={value => setSettings({...settings, numberOfRows: parseInt(value, 10)})}
          />
        </FormLayout.Group>
        <Button fullWidth onClick={handleSave} primary>
          Save Feed
        </Button>
      </FormLayout>
    </Card>
  );
}

export default Settings;
