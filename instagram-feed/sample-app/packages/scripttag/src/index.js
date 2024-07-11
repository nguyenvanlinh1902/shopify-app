import React, {Suspense, useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';

// Import Preview component lazily
const Preview = React.lazy(() => import('../../assets/src/components/MainFeed/Preview'));

(async () => {
  async function getData() {
    const domain = location.host;
    const cacheKey = `instagramData_${domain}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await fetch(`https://localhost:3000/clientApi/getmedia?domain=${domain}`);
    const data = await response.json();
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  }

  const data = await getData();

  const instagramContainer = document.getElementById('instagramContainer');

  const root = createRoot(instagramContainer);
  requestIdleCallback(() => {
    root.render(<Preview settings={data.data.settings} media={data.data.media} />);
  });
})();
