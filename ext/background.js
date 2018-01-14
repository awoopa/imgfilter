chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.method == 'postUrl') {
		var resourceUrl = request.url;   // From the background page
		var xhr = new XMLHttpRequest();
		xhr.open('GET', resourceUrl, true);
	
		// Response type arraybuffer - XMLHttpRequest 2
		xhr.responseType = 'blob';
		xhr.onload = function(e) {
				if (xhr.status == 200) {
						// console.log(xhr.response);
						// console.log('img returned');
						nextStep(xhr.response, resourceUrl, sendResponse); //, resourceUrl);
						// debugger;
						// console.log(xhr.response);
						
				}
		};
		xhr.send();
	}

	return true;
});


function nextStep(arrayBuffer, url, sendResponse) {
	// Using FormData polyfill for Web workers!
	var fd = new FormData();

	// The native FormData.append method ONLY takes Blobs, Files or strings
	// The FormData for Web workers polyfill can also deal with array buffers


	let apiUrl = 'http://ec2-52-41-153-66.us-west-2.compute.amazonaws.com:9999';
	
	if (url.match(/http(s?):\/\/(.*)\/(.*)\.gif(\?|\&)?(.*)/)) {
		apiUrl = `${apiUrl}/gif`;
		fd.append('gif', arrayBuffer);
	} else {
		apiUrl = `${apiUrl}/image`;
		fd.append('image', arrayBuffer);
	}

	chrome.storage.sync.get(null, (store) => {
		const blacklist = store['blacklist'] ? store['blacklist'] : [];

		fd.append('name', escape(url.replace(/\//g, '')));
		fd.append('block', JSON.stringify(blacklist.map(e => e.toLowerCase())));
		fd.append('blockNSFW', store['blockNSFW']);
		fd.append('blockEpileptic', store['blockEpileptic']);

		console.log(fd);

		fetch(apiUrl, {
			method: 'POST',
			body: fd
		})
		.then(response => response.json())
		.catch(error => console.error('Error:', error))
		.then(response => {
			console.log(response)
			sendResponse({src: url, caption: response.caption, block: response.block});
		});
	 });
};