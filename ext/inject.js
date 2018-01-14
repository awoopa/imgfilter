function getImages() {
	const imgElements = document.querySelectorAll('img');
	console.log(imgElements);

	imgElements.forEach(imgEl => {
		
		imgEl.dataset.imgfilterSrc = imgEl.src;
		// debugger;
		imgEl.src = placeholderUrl(imgEl.width, imgEl.height);
		// console.log(imgEl.src);
		imgEl.setAttribute('srcset', '');

		chrome.runtime.sendMessage({method: 'postUrl', url: imgEl.dataset.imgfilterSrc}, res => {
			console.log(res);
			if (!res.block) {
				imgEl.src = imgEl.dataset.imgfilterSrc;
			} else {
				imgEl.style.filter = "blur(50px)";
				imgEl.src = imgEl.dataset.imgfilterSrc;
			}
		});
	});

};

getImages();

function placeholderUrl(w, h) {
	return `https://via.placeholder.com/${w}x${h}`;
}

