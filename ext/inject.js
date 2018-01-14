function getImages() {
	const imgElements = document.querySelectorAll('img');
	const MIN_SIZE = 40
	console.log(imgElements);

	imgElements.forEach(imgEl => {
		// if image size is too small, skip it
		if (imgEl.clientWidth <= MIN_SIZE && imgEl.clientHeight <= MIN_SIZE) {
			return;
		}
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

