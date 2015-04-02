/*
 * grayscale.js 1.0
 * Leverage web workers to generate a grayscale version of any image.
 * 
 * Copyright 2015, John Robson - http://funkhaus.us/
 * credit to Jørn Kinderås - http://kinderas.blogspot.com/2011/06/html-5-web-workers-and-image-processing.html
 *
 */

;(function($){

	'use strict';

	$.fn.makeGrayscale = function( step, complete ) {

		// define worker file as blob
		var wkBlob = new Blob([ "addEventListener('message', function(e){var imageData = e.data.imagedata;var data = imageData.data;for (var i = 0; i < data.length; i += 4) {var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];data[i] = brightness;data[i + 1] = brightness;data[i + 2] = brightness;}postMessage({'index':e.data.index,'imagedata':imageData});});"], {type : 'application/javascript'});

		// create worker file from blob, get URL
		var wkURL = window.URL.createObjectURL(wkBlob),
			total,
			count;

		total = count = $(this).length;
		return this.each(function(i){

			// skip if not image
			if ( ! $(this).is('img') ) return;

			this.onload = function(){

				var imgData,
					ctxAr = [],
					thisW = $(this).attr('width'),
					thisH = $(this).attr('height'),
					worker = new Worker( wkURL ),
					c = document.createElement('canvas');
	
				// set dimensions of canvas
				c.width = thisW;
				c.height = thisH;
	
				// push context to array
				ctxAr[i] = c.getContext("2d");

				// draw on canvas, dump data into imgData
				ctxAr[i].drawImage(this, 0, 0, thisW, thisH);

				imgData = ctxAr[i].getImageData(0, 0, thisW, thisH);

				// tell worker what to do when done
				worker.addEventListener('message', function(e){

					var output = {};
					ctxAr[e.data.index].putImageData(e.data.imagedata, 0, 0);

					var image = new Image();
					image.src = ctxAr[e.data.index].canvas.toDataURL("image/png");
	
					output.index = e.data.index;
					output.height = e.data.imagedata.height;
					output.width = e.data.imagedata.width;
					output.url = image.src;
					output.img = image;
	
					if ( typeof step === 'function' ) step(output);
					if ( --count === 0 && typeof complete === 'function' ) complete(total);
				});
				worker.postMessage({'index' : i, 'imagedata' : imgData });

			}

		});
	};

// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );