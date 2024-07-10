(() => {
  const BASE_URL = 'https://localhost:3000/scripttag/index.min.js';
  const scriptElement = document.createElement('script');
  scriptElement.async = true;
  scriptElement.src = BASE_URL;
  const firstScriptElement = document.getElementsByTagName('script')[0];
  firstScriptElement.parentNode.insertBefore(scriptElement, firstScriptElement);
})();
