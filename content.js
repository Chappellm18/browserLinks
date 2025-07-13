browser.runtime.onMessage.addListener((message) => {
  if (message.action === "paste" && message.text) {
    const active = document.activeElement;

    if (active && (active.tagName === "TEXTAREA" || 
                   (active.tagName === "INPUT" && active.type === "text" || active.type === "search" || active.type === "url"))) {

      // Insert at cursor
      const start = active.selectionStart;
      const end = active.selectionEnd;
      const value = active.value;
      const text = message.text;

      active.value = value.slice(0, start) + text + value.slice(end);
      active.selectionStart = active.selectionEnd = start + text.length;

      // Trigger input event so listeners know value changed
      active.dispatchEvent(new Event("input", { bubbles: true }));
    } else {
      alert("Please focus a text input or textarea to paste the link.");
    }
  }
});
