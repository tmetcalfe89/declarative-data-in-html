(function () {
  const eventTypes = ["click", "load"];

  const actions = {
    setvar: (varSel, setter) => () => {
      const prev = vars.retrieveVar(varSel);
      const data = {
        prev,
        $: {
          vars: new Proxy(
            {},
            {
              get(target, prop, receiver) {
                console.log(prop);
                return vars.retrieveVar(prop);
              },
            }
          ),
        },
      };
      const newVal = saferEval(data, setter);
      document.querySelector(varSel).dataset.value = newVal;
    },
    fetch: (querySel, outs) => () => {
      if (!queries) {
        throw new Error("Queries module not loaded.");
      }
      queries.fetchQuery(querySel, outs, "data-value");
    },
  };

  function attachEvents() {
    eventTypes.forEach(attachEvent);
  }

  function attachEvent(eventType) {
    const haveEvent = document.querySelectorAll(`[data-evt-${eventType}]`);
    haveEvent.forEach((el) => attachEventToEl(el, eventType));
  }

  function attachEventToEl(el, eventType) {
    if (eventType === "load" && document.readyState !== "loading") {
      retrieveListener(el, eventType)();
      return;
    }
    el.addEventListener(eventType, () => retrieveListener(el, eventType)());
  }

  function retrieveListener(el, eventType) {
    if (!el.listeners) el.listeners = {};
    const raw = el.getAttribute(`data-evt-${eventType}`);
    if (!el.listeners[eventType] || raw != el.listeners[eventType].raw) {
      el.listeners[eventType] = { fn: parseListener(raw), raw };
    }
    return el.listeners[eventType].fn;
  }

  function parseListener(raw) {
    const [actionName, ...args] = raw.split(":");
    const action = actions[actionName];
    return action(...args);
  }

  window.addEventListener("DOMContentLoaded", attachEvents);
})();
