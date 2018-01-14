chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.method == 'postUrl') {
			var worker = new Worker('worker.js');
			worker.postMessage(request.url);
	}
});
