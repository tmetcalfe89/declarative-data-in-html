const queries = (function () {
  async function fetchQuery(querySel, outs, outAttribute) {
    const queryContainerEl = document.querySelector(`[data-query]${querySel}`);
    const url = queryContainerEl.dataset.url;
    const method = queryContainerEl.dataset.method || "GET";
    const bodyType = queryContainerEl.dataset.bodyType || "json";
    const response = await fetch(url, { method });
    const data = await response[bodyType]();
    document
      .querySelectorAll(outs)
      .forEach((outEl) => updateOut(outEl, data, outAttribute));

    if (!queryContainerEl.subscribedToQuery) {
      const observer = new MutationObserver(() => {
        fetchQuery(querySel, outs, outAttribute);
      });
      observer.observe(queryContainerEl, {
        attributes: true,
        attributeFilter: ["data-url"],
      });
      queryContainerEl.subscribedToQuery = true;
    }
  }

  function updateOut(outEl, data, outAttribute) {
    outEl.setAttribute(outAttribute, JSON.stringify(data));
  }

  return {
    fetchQuery,
  };
})();
