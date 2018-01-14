function getImages() {
	const imgElements = document.querySelectorAll('img');
	const MIN_SIZE = 40
	console.log(imgElements);

	imgElements.forEach(imgEl => {

		// if image size is too small, skip it
		if (imgEl.clientWidth <= MIN_SIZE && imgEl.clientHeight <= MIN_SIZE) {
			return;
		}

		// create a parent div and copy over attributes
		const parentDiv = document.createElement('div');


		if (imgEl.classList) { parentDiv.classList = imgEl.classList; }
		if (imgEl.id) { parentDiv.id = imgEl.id; }
		if (imgEl.getAttribute('style')) {parentDiv.setAttribute('style', imgEl.getAttribute('style'));}
		
		// don't overwite existing width/height styles
		if (!parentDiv.style.width) {parentDiv.style.width = imgEl.clientWidth = 'px'}
		if (!parentDiv.style.height) {parentDiv.style.height = imgEl.clientHeight + 'px'}

		// img elements are rendered as inline
		parentDiv.style.display = 'inline';
		
		// insert div
		imgEl.insertAdjacentElement('beforebegin', parentDiv);

		//

		parentDiv.appendChild(imgEl);

		imgEl.dataset.imgfilterSrc = imgEl.src;
		imgEl.src = placeholderUrl(imgEl.width, imgEl.height);
		imgEl.setAttribute('srcset', '');

		chrome.runtime.sendMessage({method: 'postUrl', url: imgEl.dataset.imgfilterSrc}, res => {
			console.log(res);
			if (!res.block) {
				imgEl.src = imgEl.dataset.imgfilterSrc;
			} else {
				imgEl.style.filter = "blur(50px) brightness(0)";
				imgEl.src = imgEl.dataset.imgfilterSrc;
			}
		});
	});

};

getImages();

function placeholderUrl(w, h) {
	return `https://via.placeholder.com/${w}x${h}`;
}

