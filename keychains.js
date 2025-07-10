const keychains = (function () {
  function evaluateKeychain(source, keychainString) {
    const keychain = keychainString.split(".");
    return keychain.reduce((acc, k) => acc[k], source);
  }

  return {
    evaluateKeychain,
  };
})();
