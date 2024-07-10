import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.scss';
import NotificationPopup from '../../assets/src/components/NotificationPopup/NotificationPopup';

(async () => {
  async function getNotifications() {
    try {
      const response = await fetch(
        'https://cycling-plug-adaptive-roman.trycloudflare.com/clientApi/getNotificationsShop?domain=mageplaza-linhnv3.myshopify.com'
      );
      return await response.json();
    } catch (e) {
      console.error('Error fetching notifications:');
      return { data: [] };
    }
  }

  async function getSetting() {
    try {
      const response = await fetch(
        'https://cycling-plug-adaptive-roman.trycloudflare.com/clientApi/getSetting?domain=mageplaza-linhnv3.myshopify.com'
      );
      return await response.json();
    } catch (e) {
      console.error('Error fetching settings:');
      return { data: null };
    }
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
  }

  function shouldShowPopup(url, includedPages, excludedPages, allowShow) {
    if (allowShow === 'all') {
      return !excludedPages.some(page => url.includes(page));
    }
    if (allowShow === 'specific') {
      return includedPages.some(page => url.includes(page));
    }
    return false;
  }

  const defaultSettings = {
    timeBeforeFirstPop: 10,
    gapTimeBetweenPops: 2,
    displayDuration: 5,
    maximumOfPopups: 20,
    desktopPosition: 'bottom-right',
    truncateContentText: true,
    hideTimeAgo: true,
    excludedPages: '',
    includedPages: '',
    allowShow: 'all'
  };

  const [settingsResult, notificationsResult] = await Promise.all([getSetting(), getNotifications()]);

  const settings = settingsResult.data || defaultSettings;
  const notifications = notificationsResult.data.notifications || [];
  const url = location.href;
  const includedPages = settings.includedPages ? settings.includedPages.split('\n') : [];
  const excludedPages = settings.excludedPages ? settings.excludedPages.split('\n') : [];

  if (!shouldShowPopup(url, includedPages, excludedPages, settings.allowShow)) {
    console.log('Not showing popup on this page.');
    return;
  }

  async function showPopupsSequentially(notifications) {
    let container = document.getElementById('notifications');

    if (!container) {
      container = document.createElement('div');
      container.id = 'notifications';
      document.body.appendChild(container);
    }

    const root = createRoot(container);

    for (let i = 0; i < Math.min(notifications.length, settings.maximumOfPopups); i++) {
      await delay(i === 0 ? settings.timeBeforeFirstPop : settings.gapTimeBetweenPops);

      root.render(
        <NotificationPopup
          data={notifications[i]}
          setting={settings}
        />
      );

      await delay(settings.displayDuration);
      root.render(null);
    }

    document.body.removeChild(container);
  }

  await showPopupsSequentially(notifications);
})();
