const storage = (typeof browser !== 'undefined' && browser.storage)
  ? browser.storage
  : (typeof chrome !== 'undefined' && chrome.storage)
    ? chrome.storage
    : null;

if (!storage) {
  throw new Error("No storage API available.");
}

function getFromStorage(keys) {
  return new Promise((resolve, reject) => {
    if (storage === chrome.storage) {
      storage.local.get(keys, resolve);
    } else {
      storage.local.get(keys).then(resolve, reject);
    }
  });
}

function setToStorage(items) {
  return new Promise((resolve, reject) => {
    if (storage === chrome.storage) {
      storage.local.set(items, resolve);
    } else {
      storage.local.set(items).then(resolve, reject);
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const result = await getFromStorage(["linkedinUrl", "githubUrl"]);
  document.getElementById('linkedinUrl').value = result.linkedinUrl || "";
  document.getElementById('githubUrl').value = result.githubUrl || "";
});

document.getElementById('save').addEventListener('click', async () => {
  const linkedinUrl = document.getElementById('linkedinUrl').value;
  const githubUrl = document.getElementById('githubUrl').value;
  await setToStorage({ linkedinUrl, githubUrl });

  const status = document.getElementById('statusMessage');
  status.classList.remove('hidden');
  setTimeout(() => status.classList.add('hidden'), 2000);
});
