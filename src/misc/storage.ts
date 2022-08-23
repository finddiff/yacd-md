// manage localStorage

const StorageKey = 'yacd.haishan.me';

function loadState() {
  try {
    const serialized = localStorage.getItem(StorageKey);
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch (err) {
    return undefined;
  }
}

function saveState(state) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(StorageKey, serialized);
  } catch (err) {
    // ignore
  }
}

function clearState() {
  try {
    localStorage.removeItem(StorageKey);
  } catch (err) {
    // ignore
  }
}

const StorageProxyKey = 'yacd.proxy';
function saveProxy(proxy) {
  try {
    const serialized = JSON.stringify(proxy);
    localStorage.setItem(StorageProxyKey, serialized);
  } catch (err) {
    // ignore
  }
}

function loadProxy() {
  try {
    const serialized = localStorage.getItem(StorageProxyKey);
    if (!serialized) return {providers:{"":""}};
    return JSON.parse(serialized);
  } catch (err) {
    return {providers:{"":""}};
  }
}

export { loadState, saveState, clearState , saveProxy, loadProxy};
