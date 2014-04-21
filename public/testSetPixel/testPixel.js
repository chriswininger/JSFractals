/**
 * Author: Chris Wininger
 * Purpose: This code tests and compares several methods for drawing
 * a single pixel to the html5 canvas to determine which method is the
 * fastest (as of right now method2 wins in chrome and 3 in Firefox)
**/

(function() {
    "use strict";

    if (typeof Math !== 'undefined') {
        // Map val from a coordinate plane bounded by x1, x2 onto a coordinate plane bounded by y1, y2
        Math.map = function(val, x1, x2, y1, y2) {
            return (val -x1)/(Math.abs(x2-x1)) * Math.abs(y2 -y1) + y1;
        };
    }

    if (typeof ImageData !== 'undefined') {
        /**
         * Set the color values for the pixel at the specified x, y index
         * @param c [r,g,b,a]
         * @param x
         * @param y
         */
        ImageData.prototype.setPixel = function (c, x, y) {
            var data = this.data;
            var r = 4 * (x + y * this.width);

            data[r] = c[0];
            data[r + 1] = c[1];
            data[r + 2] = c[2];
            data[r + 3] = c[3];
        };

        ImageData.prototype.getPixel = function (x, y) {
            var data = this.data;
            var r = 4 * (x + y * this.width);
            return [data[r], data[r + 1], data[r + 2], data[r + 3]];
        };
    }
})();

(function () {
	var DLAPoint = this.phong.dla.DLAPoint;
	var ctx,
		fieldHeight = 500,
		fieldWidth = 500;

	$(function () {
		var display = $('#dlaCanvas')[0];
		fieldWidth = display.width || display.scrollWidth;
		fieldHeight = display.height || display.scrollHeight;
		ctx = display.getContext("2d");

		var _test = function(name, fillMethod) {
			ctx.clearRect(0,0,fieldWidth,fieldHeight);

			var startTime = new Date().getTime();

			console.log('start test ' + name);
			var x, y = 0;
			for (x = 0; x < fieldWidth; x++) {
				for (y = 0; y < fieldHeight; y++) {
					fillMethod(x,y);
				}
			}

			console.log('ellapsed time for method ' + name + ': ' + ((new Date()).getTime() - startTime).toString());
		};

		// only do this once per page
		var id = ctx.createImageData(1,1);
		var  method1 = function (x, y) {
			var d  = id.data;
			d[0] = 255;
			d[1] = 0;
			d[2] = 0;
			d[3] = 255;
			ctx.putImageData(id, x, y);
		};

		var method2 = function (x, y) {
			ctx.fillStyle = "rgba(255,0,0,255)";
			ctx.fillRect(x, y, 1, 1);
		};

		var imgData = ctx.getImageData(0,0, fieldWidth, fieldHeight);
		var method3 = function (x, y) {
			imgData.setPixel(x,y, [255, 0, 0, 255]);
			// don't paint until the end
			if (x === (fieldWidth-1) && y === (fieldHeight-1)) ctx.putImageData(imgData,0,0);
		};
		console.log('---begin tests---');
		_test('method1', method1);
		_test('method2', method2);
		_test('method3', method3);
	});
})();