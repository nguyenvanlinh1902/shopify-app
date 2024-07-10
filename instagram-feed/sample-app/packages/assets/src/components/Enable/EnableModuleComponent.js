import React, {useState, useCallback} from 'react';
import {Button} from '@shopify/polaris';
import './EnableModule.css';

function EnableModule() {
  const [connected, setConnected] = useState(false);

  const handleAction = useCallback(() => {
    setConnected(connected => !connected);
  }, []);

  const buttonText = connected ? 'Disable' : 'Enable';
  const details = connected ? 'disable' : 'enable';
  const content = 'App status is ' + details;

  return (
    <div className="enable-module">
      <div className="status">{content}</div>
      <Button onClick={handleAction}>{buttonText}</Button>
    </div>
  );
}

export default EnableModule;
