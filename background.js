function getStorage() {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return chrome.storage;
  }
  throw new Error("Only Chrome is supported");
}

function getContextMenus() {
  if (typeof chrome !== 'undefined' && chrome.contextMenus) {
    return chrome.contextMenus;
  }
  throw new Error("No contextMenus API available");
}

function getRuntime() {
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    return chrome.runtime;
  }
  throw new Error("No runtime API available");
}

function getTabs() {
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    return chrome.tabs;
  }
  throw new Error("No tabs API available");
}

// Wrap storage.local.get with promise
function getFromStorage(keys) {
  const storage = getStorage();
  return new Promise((resolve, reject) => {
    storage.local.get(keys, (result) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(result);
    });
  });
}

// Wrap contextMenus.create with promise
function createContextMenu(options) {
  const menus = getContextMenus();
  return new Promise((resolve, reject) => {
    try {
      const id = menus.create(options);
      resolve(id);
    } catch (e) {
      reject(e);
    }
  });
}

async function getConfiguredUrls() {
  const result = await getFromStorage(["linkedinUrl", "githubUrl"]);
  return {
    linkedinUrl: result.linkedinUrl || "https://www.linkedin.com/in/your-default/",
    githubUrl: result.githubUrl || "https://github.com/your-default"
  };
}

async function setupContextMenus() {
  await createContextMenu({
    id: "copy-to",
    title: "Links",
    contexts: ["editable"]
  });

  await createContextMenu({
    id: "copy-linkedin",
    parentId: "copy-to",
    title: "Paste LinkedIn Profile",
    contexts: ["editable"]
  });

  await createContextMenu({
    id: "copy-github",
    parentId: "copy-to",
    title: "Paste GitHub Profile",
    contexts: ["editable"]
  });
}

const runtime = getRuntime();
const contextMenus = getContextMenus();
const tabs = getTabs();

runtime.onInstalled.addListener(() => {
  setupContextMenus();
});

contextMenus.onClicked.addListener(async (info, tab) => {
  const urls = await getConfiguredUrls();
  let formattedUrl;

  if (info.menuItemId === "copy-linkedin") {
    formattedUrl = urls.linkedinUrl;
  } else if (info.menuItemId === "copy-github") {
    formattedUrl = urls.githubUrl;
  }

  if (formattedUrl && tab.id) {
    tabs.sendMessage(tab.id, {
      action: "paste",
      text: formattedUrl
    });
  }
});
