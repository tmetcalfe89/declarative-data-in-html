(function () {
  function cacheValues() {
    const haveCachedVariable = document.querySelectorAll(
      "[data-cache][data-cacheable]"
    );
    haveCachedVariable.forEach(loadCacheVarForEl);
  }

  const cacheMethods = {
    localstorage: {
      save: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
      load: (key) => JSON.parse(localStorage.getItem(key)),
    },
    sessionstorage: {
      save: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
      load: (key) => JSON.parse(sessionStorage.getItem(key)),
    },
  };
  function loadCacheVarForEl(cachedVarEl) {
    const cacheable = cachedVarEl.dataset.cacheable;
    const cacheMethodName = cachedVarEl.dataset.cache;
    const cacheMethod = cacheMethods[cacheMethodName];
    const key = cachedVarEl.id;
    const loadedCache = cacheMethod.load(key);
    if (loadedCache) cachedVarEl.setAttribute(cacheable, loadedCache);

    const observer = new MutationObserver(() => {
      const value = cachedVarEl.getAttribute(cacheable);
      const key =
        cachedVarEl.getAttribute(cachedVarEl.dataset.cacheIdentifier) ||
        cachedVarEl.id;
      cacheMethod.save(key, value);
    });
    observer.observe(cachedVarEl, {
      attributeFilter: [cacheable],
      attributes: true,
    });
  }

  window.addEventListener("DOMContentLoaded", cacheValues);
})();
