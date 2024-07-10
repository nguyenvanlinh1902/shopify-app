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
      console.log('test1');
      return JSON.parse(cachedData);
    }

    const response = await fetch(`https://localhost:3000/clientApi/getmedia?domain=${domain}`);
    const data = await response.json();
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  }

  const data = await getData();

  const container = document.getElementById('instagramContainer');

  const main = document.getElementById('MainContent');
  main.insertBefore(container, main.firstChild); // Add container before the first child of main

  const root = createRoot(container);
  requestIdleCallback(() => {
    root.render(
      <Suspense fallback={<div>Loading...</div>}>
        <Preview settings={data.data.settings} media={data.data.media} />
      </Suspense>
    );
  });
})();
