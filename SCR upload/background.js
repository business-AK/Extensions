chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "capture_screenshot") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, async (dataUrl) => {
      if (dataUrl) {
        // Convert data URL to a Blob
        const blob = await fetch(dataUrl).then((res) => res.blob());

        // Create a FormData object and append the Blob
        const formData = new FormData();
        formData.append('screenshot', blob, 'screenshot.png');

        // Send the screenshot to the server
        try {
          const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            console.log('Screenshot uploaded successfully');
            sendResponse({ success: true });
          } else {
            console.error('Failed to upload screenshot:', await response.text());
            sendResponse({ success: false, error: 'Upload failed' });
          }
        } catch (error) {
          console.error('Error uploading screenshot:', error);
          sendResponse({ success: false, error: error.message });
        }
      } else {
        console.error('Failed to capture the screenshot');
        sendResponse({ success: false, error: 'Failed to capture the screenshot' });
      }
    });
    return true; // Keep the message channel open for asynchronous response
  }
});
