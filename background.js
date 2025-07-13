browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: "copy-to",
    title: "Links",
    contexts: ["editable"]
  });

  browser.contextMenus.create({
    id: "copy-linkedin",
    parentId: "copy-to",
    title: "Paste LinkedIn Profile",
    contexts: ["editable"]
  });

  browser.contextMenus.create({
    id: "copy-github",
    parentId: "copy-to",
    title: "Paste GitHub Profile",
    contexts: ["editable"]
  });
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  let formattedUrl;

  if (info.menuItemId === "copy-linkedin") {
    formattedUrl = `https://www.linkedin.com/in/mitchell-chappell/`;
  } else if (info.menuItemId === "copy-github") {
    formattedUrl = `https://github.com/Chappellm18`;
  }

  if (formattedUrl) {
    browser.tabs.sendMessage(tab.id, {
      action: "paste",
      text: formattedUrl
    });
  }
});
