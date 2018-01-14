function getImages() {
	const imgElements = document.querySelectorAll('img');
	const MIN_SIZE = 75
	console.log(imgElements);

	imgElements.forEach(imgEl => {
			// swap the image with a placeholder
			// note: we remove the srcset because some sites use them, and
			// otherwise the original image would still show
			// also this is easier than processing it like five times
			imgEl.dataset.imgfilterSrc = imgEl.src;
			imgEl.src = placeholderUrl(imgEl.width, imgEl.height);
			imgEl.setAttribute('srcset', '');
	})

	imgElements.forEach(imgEl => {
			// if image size is too small, skip it
			if (imgEl.clientWidth <= MIN_SIZE && imgEl.clientHeight <= MIN_SIZE) {
				imgEl.src = imgEl.dataset.imgfilterSrc;
				return;
			}

			// create a parent div
			const parentDiv = document.createElement('div');
			const overlay = document.createElement('div');
			const overlayText = document.createElement('span');
			const loadingSpinner = document.createElement('div');

			// overlay a loading spinner while shit's loading
			loadingSpinner.setAttribute('style', `
				background: url('https://i.redd.it/t5eqkn7fvo5z.gif') rgba(0, 0, 0, 0.7);
				background-size: contain;
				background-position: center center;
				background-repeat: no-repeat;
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				pointer-events: none;
				z-index: 1000;
			`);

			// copy over attributes from img
			if (imgEl.classList) { parentDiv.classList = imgEl.classList; }
			if (imgEl.id) { parentDiv.id = imgEl.id; }
			if (imgEl.getAttribute('style')) {parentDiv.setAttribute('style', imgEl.getAttribute('style'));}
			
			// don't overwite existing width/height styles
			if (!parentDiv.style.width) {parentDiv.style.width = imgEl.clientWidth + 'px'}
			if (!parentDiv.style.height) {parentDiv.style.height = imgEl.clientHeight + 'px'}
			if (!parentDiv.style.position || parentDiv.style.position === 'static') {parentDiv.style.position = 'relative'}

			// img elements are rendered as inline
			parentDiv.style.display = 'inline-block';
			
			// insert div
			imgEl.insertAdjacentElement('beforebegin', parentDiv);

			// move image to the new div
			parentDiv.appendChild(imgEl);
			parentDiv.appendChild(overlay);
			parentDiv.appendChild(loadingSpinner);

			// style the overlay in js because who the fuck cares anymore
			overlay.setAttribute('style', `
				text-align: center;
				font-weight: bold;
				font-size: 16px;
				background: #ccc;
				color: #222; 
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				pointer-events: none;
				z-index: 100;
				display: flex;
				align-items: center;
				justify-content: center;
			`);
			overlay.appendChild(overlayText);
			
			// send this to the background process to upload to the server
			chrome.runtime.sendMessage({method: 'postUrl', url: imgEl.dataset.imgfilterSrc}, res => {
				if (res.block === false) {
					// restore the image
					imgEl.src = imgEl.dataset.imgfilterSrc;
					overlay.style.display = 'none';
					loadingSpinner.remove();
				} else if (res.block === true) {
					// blur it out and make it really dark
					// imgEl.style.filter = "brightness(0)";
					// restore image
					imgEl.src = imgEl.dataset.imgfilterSrc;
					// add the overlay text
					overlayText.innerHTML = `Hover to view. <br> ${res.reason} <br> May contain: ${res.caption}`

					// add hover handlers
					parentDiv.addEventListener('mouseenter', e => {
						// imgEl.style.filter = '';
						overlay.style.display = 'none';
					})
					parentDiv.addEventListener('mouseout', e => {
						// imgEl.style.filter = 'brightness(0)';
						overlay.style.display = 'flex';
					})
					loadingSpinner.remove();
				}
			});
	});

};

getImages();

function placeholderUrl(w, h) {
	return `https://via.placeholder.com/${w}x${h}`;
}

