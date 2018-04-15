let opts = {
	'product_info': '.js-product-info',
	'image_wrapper': '.js-image-wrapper'
}

Template.imageMirror.rendered = function() {
	var img = new Image();
	img.src = "http://localhost:5001/video_feed";
	img.classList.add('mirror-img');
	img.setAttribute("id", "video-feed");

	document.querySelector(opts.image_wrapper).appendChild(img);

	img.onload = function() {
		if (document.querySelector(opts.product_info)) {
			document.querySelector(opts.product_info).classList.add('loaded')
		}
	}
};
