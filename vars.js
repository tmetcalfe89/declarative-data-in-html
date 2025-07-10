const vars = (function () {
  const variableTypeMap = {
    string: {
      incoming: (v) => v,
      outgoing: (v) => v,
    },
    number: {
      incoming: (v) => +v,
      outgoing: (v) => v,
    },
    array: {
      incoming: (v) => JSON.parse(v),
      outgoing: (v) => JSON.stringify(v),
    },
    object: {
      incoming: (v) => JSON.parse(v),
      outgoing: (v) => JSON.stringify(v),
    },
  };

  function fillVars() {
    const haveVariable = document.querySelectorAll("[data-variable]");
    haveVariable.forEach(fillVarsForEl);
  }

  function fillVarsForEl(varEl) {
    const variableSel = varEl.dataset.variable;
    if (variableSel !== "") {
      const variablePointer = varEl.dataset.variablePointer;
      const variableVal = retrieveVar(variableSel, variablePointer);
      const variableTypeName = varEl.dataset.type || "string";
      const variableType = variableTypeMap[variableTypeName];
      const variableProcessed = variableType.outgoing(variableVal);
      varEl.innerHTML = variableProcessed;

      subscribeToVar(varEl, variableSel);
    }

    [...varEl.attributes].forEach((attribute) => {
      if (
        !attribute.localName.startsWith("data-variable-") ||
        attribute.localName.endsWith("-pointer") ||
        attribute.localName.endsWith("-type")
      )
        return;
      const prop = attribute.localName.slice("data-variable-".length);
      const propVariableSel = attribute.value;
      const propVariablePointer = varEl.getAttribute(
        `data-variable-${prop}-pointer`
      );
      const propVariableVal = retrieveVar(propVariableSel, propVariablePointer);
      const propVariableTypeName =
        varEl.getAttribute(`data-variable-${prop}-type`) || "string";
      const propVariableType = variableTypeMap[propVariableTypeName];
      const propVariableProcessed = propVariableType.outgoing(propVariableVal);
      varEl.setAttribute(prop, propVariableProcessed);

      subscribeToVar(varEl, propVariableSel);
    });
  }

  function getVarContainerEl(sel) {
    return document.querySelector(`meta[data-var]${sel}`);
  }

  function retrieveVar(sel, pointer) {
    const el = getVarContainerEl(sel);
    const type = el.dataset.type || "string";
    const raw = el.dataset.value;
    const processed = variableTypeMap[type].incoming(raw);
    return pointer ? keychains.evaluateKeychain(processed, pointer) : processed;
  }

  function subscribeToVar(varEl, variableSel) {
    const static = varEl.hasAttribute("data-static");
    if (static || varEl.subscribedToVar) return;
    const el = getVarContainerEl(variableSel);
    const observer = new MutationObserver(() => {
      fillVarsForEl(varEl);
    });
    observer.observe(el, { attributeFilter: ["data-value"], attributes: true });
    varEl.subscribedToVar = true;
  }

  window.addEventListener("DOMContentLoaded", fillVars);

  return {
    retrieveVar,
  };
})();
