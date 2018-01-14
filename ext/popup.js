document.addEventListener('DOMContentLoaded', function() {
  // Load previous state of button toggle
  chrome.storage.sync.get(null, function(store) {
    if (store['blockEpileptic']) {
      document.getElementById('blockEpileptic').checked = true
    } else {
      document.getElementById('blockEpileptic').checked = false
    }

    if (store['blockNSFW']) {
      document.getElementById('blockNSFW').checked = true
    } else {
      document.getElementById('blockNSFW').checked = false
    }

    if (store['captionBlockedContent']) {
      document.getElementById('captionBlockedContent').checked = true
    } else {
      document.getElementById('captionBlockedContent').checked = false
    }
  });

  // Add event listeners for button toggles
	document.getElementById('blockEpileptic').addEventListener('click', () => {
    blockEpilepticChecked = document.getElementById('blockEpileptic').checked
    chrome.storage.sync.set({'blockEpileptic': blockEpilepticChecked});
	});

  document.getElementById('blockNSFW').addEventListener('click', () => {
    blockEpilepticChecked = document.getElementById('blockNSFW').checked
    chrome.storage.sync.set({'blockNSFW': blockEpilepticChecked});
  });

  document.getElementById('captionBlockedContent').addEventListener('click', () => {
    blockEpilepticChecked = document.getElementById('captionBlockedContent').checked
    chrome.storage.sync.set({'captionBlockedContent': blockEpilepticChecked});
  });
});