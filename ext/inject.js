function getImages() {
	const imgElements = document.querySelectorAll('img');
	console.log(imgElements);

	imgElements.forEach(imgEl => {
    chrome.runtime.sendMessage({method: 'postUrl', url: img.src});
	});

}

getImages();



