const saferEval = (function () {
  return function saferEval(scope, expr) {
    try {
      return Function(
        ...Object.keys(scope),
        `return ${expr}`
      )(...Object.values(scope));
    } catch (e) {
      console.error("Evaluation error:", expr, scope, e);
      return null;
    }
  };
})();
