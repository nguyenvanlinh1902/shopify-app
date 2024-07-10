import React, {useState} from 'react';
import './style.css';
import {
  BlockStack, Card, Checkbox, FormLayout, RangeSlider, SkeletonDisplayText, Tabs, TextField, Text, Button, Select
} from '@shopify/polaris';

function TabSettings({settings, setSettings}) {
  const [selected, setSelected] = useState(0);

  const handleTabChange = (selectedTabIndex) => {
    setSelected(selectedTabIndex);
  };

  const tabs = [{id: 'display', content: 'Display', panelID: 'display-content'}, {
    id: 'triggers',
    content: 'Triggers',
    panelID: 'triggers-content'
  }];

  return (<Card>
    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
      {selected === 0 && <DisplaySettings settings={settings} setSettings={setSettings} />}
      {selected === 1 && <TriggersSettings settings={settings} setSettings={setSettings} />}
    </Tabs>
  </Card>);
}

function DisplaySettings({settings, setSettings}) {
  const positions = ['bottom-left', 'bottom-right', 'top-left', 'top-right'];

  const handleChange = (field) => (value) => {
    setSettings((prevSettings) => ({
      ...prevSettings, [field]: value
    }));
  };

  const handleChangePosition = (position) => {
    setSettings((prevSettings) => ({
      ...prevSettings, desktopPosition: position
    }));
  };

  return (<FormLayout>
    <FormLayout.Group>
      <Text>Desktop Position</Text>
      <Card>
        <div className="desktop-position-options">
          {positions.map((pos) => (<div
            key={pos}
            className={`desktop-position ${settings?.desktopPosition === pos ? 'selected' : ''}`}
            onMouseDown={() => handleChangePosition(pos)}
          >
            <div className={pos}>
              <SkeletonDisplayText size="small" />
            </div>
          </div>))}
        </div>
        <Text>The display position of the pop on your website</Text>
      </Card>
      <Checkbox
        label="Hide time ago"
        checked={settings?.hideTimeAgo}
        onChange={handleChange('hideTimeAgo')}
      />
      <Checkbox
        label="Truncate content text"
        helpText="If your product name is long for one line, it will be truncated to 'Product na...'"
        checked={settings?.truncateContentText}
        onChange={handleChange('truncateContentText')}
      />
    </FormLayout.Group>
    <Text>Timing</Text>
    <FormLayout.Group condensed>
      <RangeSlider
        helpText="How long each pop can display on your page"
        label="Display duration"
        value={settings?.displayDuration}
        onChange={handleChange('displayDuration')}
        min={1}
        max={10}
        suffix={<Text disabled>{settings.displayDuration} second(s)</Text>}
      />
      <RangeSlider
        label="Time before the first pop"
        value={settings?.timeBeforeFirstPop}
        onChange={handleChange('timeBeforeFirstPop')}
        min={0}
        max={30}
        suffix={<Text disabled>{settings.timeBeforeFirstPop} second(s)</Text>}
      />
    </FormLayout.Group>
    <FormLayout.Group condensed>
      <RangeSlider
        helpText="The time interval between two pops"
        label="Gap time between two pops"
        value={settings?.gapTimeBetweenPops}
        onChange={handleChange('gapTimeBetweenPops')}
        min={1}
        max={10}
        suffix={<Text disabled>{settings.gapTimeBetweenPops} second(s)</Text>}
      />
      <RangeSlider
        helpText="The maximum number of popups to show after page loading, maximum number is 80"
        label="Maximum of popups"
        value={settings?.maximumOfPopups}
        onChange={handleChange('maximumOfPopups')}
        min={1}
        max={80}
        suffix={<Text disabled>{settings.maximumOfPopups} second(s)</Text>}
      />
    </FormLayout.Group>
  </FormLayout>);
}

function TriggersSettings({ settings, setSettings }) {
  const handleChange = (field) => (value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [field]: value
    }));
  };

  const options = [
    { label: 'All pages', value: 'all' },
    { label: 'Specific pages', value: 'specific' }
  ];

  return (
    <BlockStack>
      <Text variant="subdued">PAGES RESTRICTION</Text>
      <Select
        label="Allow Show"
        options={options}
        value={settings.allowShow}
        onChange={handleChange('allowShow')}
      />
      {settings.allowShow === 'all' && (
        <TextField
          label="Excluded pages"
          helpText="Page URLs NOT to show the pop-up (separated by new lines)"
          multiline={4}
          value={settings.excludedPages}
          onChange={handleChange('excludedPages')}
        />
      )}
      {settings.allowShow === 'specific' && (
        <>
          <TextField
            label="Included pages"
            helpText="Page URLs to show the pop-up (separated by new lines)"
            multiline={4}
            value={settings.includedPages}
            onChange={handleChange('includedPages')}
          />
          <TextField
            label="Excluded pages"
            helpText="Page URLs NOT to show the pop-up (separated by new lines)"
            multiline={4}
            value={settings.excludedPages}
            onChange={handleChange('excludedPages')}
          />
        </>
      )}
    </BlockStack>
  );
}
export default TabSettings;
