document.getElementById("captureButton").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "capture_screenshot" }, (response) => {
    if (response && response.success) {
      alert("Screenshot captured and uploaded successfully!");
    } else if (response.error === "Restricted or undefined URL") {
      alert("Cannot capture a screenshot of this tab. Please switch to a regular webpage.");
    } else if (response.error === "No active tab") {
      alert("No active tab found. Please ensure a tab is open and try again.");
    } else {
      alert("Failed to capture or upload screenshot.");
    }
  });
});
