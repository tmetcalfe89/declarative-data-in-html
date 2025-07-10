(function () {
  function fillLists() {
    const haveList = document.querySelectorAll(
      "[data-list][data-list-template]"
    );
    haveList.forEach(fillListForEl);
  }

  function fillListForEl(listEl) {
    const listSel = listEl.dataset.list;
    const templateSel = listEl.dataset.listTemplate;
    const pointer = listEl.dataset.listPointer;

    const list = vars.retrieveVar(listSel, pointer);
    const templateEl = document.querySelector(`template${templateSel}`);

    listEl.innerHTML = "";
    list.forEach((entry) =>
      listEl.appendChild(evaluateTemplate(templateEl, entry))
    );

    const static = listEl.hasAttribute("data-static");
    if (!static && !listEl.subscribedToList) {
      subscribeToList(listEl, listSel);
    }
  }

  function subscribeToList(listEl, listSel) {
    const listContainerEl = document.querySelector(listSel);
    const observer = new MutationObserver(() => {
      fillListForEl(listEl);
    });
    observer.observe(listContainerEl, {
      attributeFilter: ["data-value"],
      attributes: true,
    });
    listEl.subscribeToList = true;
  }

  function evaluateTemplate(templateEl, listEntry) {
    const template = templateEl.cloneNode(true).content;

    template.querySelectorAll("[data-part]").forEach((partEl) => {
      partEl.innerText = keychains.evaluateKeychain(
        listEntry,
        partEl.getAttribute("data-part")
      );
    });

    template.querySelectorAll("*").forEach((el) => {
      [...el.attributes].forEach((part) => {
        if (!part.localName.startsWith("data-part-")) return;
        const prop = part.localName.slice("data-part-".length);
        el.setAttribute(
          prop,
          keychains.evaluateKeychain(listEntry, part.value)
        );
      });
    });

    return template;
  }

  window.addEventListener("DOMContentLoaded", fillLists);
})();
