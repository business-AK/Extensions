chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "capture_screenshot") {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        const activeTab = tabs[0];
        
        if (activeTab.url && 
            !activeTab.url.startsWith("chrome://") && 
            !activeTab.url.startsWith("devtools://")) {
          chrome.tabs.captureVisibleTab(null, { format: "png" }, async (dataUrl) => {
            if (dataUrl) {
              const blob = await fetch(dataUrl).then((res) => res.blob());
              const formData = new FormData();
              formData.append("screenshot", blob, "screenshot.png");

              const uploadUrl = "http://localhost:8000/upload";

              fetch(uploadUrl, {
                method: "POST",
                body: formData,
              })
                .then((response) => {
                  if (response.ok) {
                    console.log("Screenshot uploaded successfully");
                    sendResponse({ success: true });
                  } else {
                    console.error("Failed to upload screenshot");
                    sendResponse({ success: false });
                  }
                })
                .catch((error) => {
                  console.error("Error uploading screenshot:", error);
                  sendResponse({ success: false });
                });
            }
          });
        } else {
          console.error("Cannot capture screenshot of restricted or undefined URL");
          sendResponse({ success: false, error: "Restricted or undefined URL" });
        }
      } else {
        console.error("No active tab found");
        sendResponse({ success: false, error: "No active tab" });
      }
    });
    return true; // Keep the message channel open for asynchronous response
  }
});
