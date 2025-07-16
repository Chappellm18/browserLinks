chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "paste" && message.text) {
    const activeElem = document.activeElement;
    if (
      activeElem &&
      (activeElem.tagName === "INPUT" || activeElem.tagName === "TEXTAREA" || activeElem.isContentEditable)
    ) {
      // For INPUT or TEXTAREA elements:
      if ("value" in activeElem) {
        // Insert at cursor position if possible:
        const start = activeElem.selectionStart;
        const end = activeElem.selectionEnd;
        const value = activeElem.value;
        activeElem.value = value.slice(0, start) + message.text + value.slice(end);
        // Move cursor after inserted text:
        const cursorPos = start + message.text.length;
        activeElem.selectionStart = activeElem.selectionEnd = cursorPos;
        // Trigger input event to notify possible listeners:
        activeElem.dispatchEvent(new Event("input", { bubbles: true }));
      } else if (activeElem.isContentEditable) {
        // For contenteditable elements, insert text at cursor:
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(message.text));
        // Move cursor after inserted text:
        selection.collapseToEnd();
      }
    }
  }
});
