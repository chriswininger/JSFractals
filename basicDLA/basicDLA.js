(function () {
	var DLAPoint = this.phong.dla.DLAPoint;
	var ctx;
	var dlaField = [],
		positionHash = [],
		fieldCount = 50000,
		fieldWidth = 500,
		fieldHeight = 500;

	$(function () {
		console.log('here');
		var display = $('#dlaCanvas')[0];
		fieldWidth = display.width || display.scrollWidth;
		fieldHeight = display.height || display.scrollHeight;

		if (fieldCount > fieldHeight * fieldWidth) {
			console.error('You may not have more points than there are pixels');
			return;
		}

		ctx = display.getContext("2d");

		_buildPositionArray();
		createDLAField();
		console.log('created');
		draw();

	});

	function draw() {
		ctx.clearRect(0,0,fieldWidth,fieldHeight);
		drawFieldAndUpdate();
		requestAnimationFrame(draw);
	}

	function drawFieldAndUpdate() {
		for (var i = 0; i < dlaField.length; i++) {
			dlaField[i].draw();
			dlaField[i].move();
		}
	}

	function createDLAField() {
		var i, x, y;
		var color = [255,0,0,255];

		for (i = 0; i < fieldCount; i++) {


			x = Math.floor((Math.random() * fieldWidth));
			y = Math.floor((Math.random() * fieldHeight));

			while(_positionOccupied(x, y)){
				x = Math.floor((Math.random() * fieldWidth));
				y = Math.floor((Math.random() * fieldHeight));
			}

			var p = new DLAPoint(x, y, color, ctx, moveRule, isStuck);
			dlaField.push(p);
			positionHash[x][y] = p;
		}
	}

	function _buildPositionArray() {
		for (x = 0; x < fieldWidth; x++) {
			positionHash.push([]);
		}
	}

	function _positionOccupied(x, y) {
		return positionHash[x] && positionHash[x][y];
	}

	/*function _getNext(val, isX) {
		var newVal = Math.round(Math.random()) === 1 ? val + 1 : val - 1;
		var cond = function () { return newVal >= fieldWidth || newVal < 0; };
		if (!isX) cond = function () { return newVal >= fieldHeight || newVal < 0; };
		while (cond()) {
			newVal = Math.round(Math.random()) === 1 ? val + 1 : val - 1;
		}

		return newVal;
	}*/
	function _getNext(x, y) {
		var newX = Math.round(Math.random()) === 1 ? x + 1 : x - 1;
		var newY = Math.round(Math.random()) === 1 ? y + 1 : y - 1;

		var attemptCount = 0;
		do {
			while (newX >= fieldWidth || newX < 0) {
				newX = Math.round(Math.random()) === 1 ? x + 1 : x - 1;
			}
			while (newY >= fieldHeight || newY < 0) {
				newY = Math.round(Math.random()) === 1 ? y + 1 : y - 1;
			}


			attemptCount++;
		} while(_positionOccupied(newX, newY) && attemptCount < 4);



		// no where to go
		if (attemptCount === 4) {
			return { x: x, y: y};
		}


		if (newX < 0 || newX > fieldWidth) {
				console.log('cond2 less than 0: ' + newX);
		}
		// new positon
		return { x: newX, y: newY};
	}

	function isStuck() {
		if (this._isStuck) return true;
		if (this.y >= (fieldHeight-2)) {
			this._isStuck = true;
		} else {
			var self = this;
			var _check = function (dx, dy) {
				var x = self.x + dx,
					y = self.y + dy;
				if (x < 0 || x >= fieldWidth || y < 0 || y >= fieldWidth) return false;
				return positionHash[x][y] && positionHash[x][y]._isStuck;
			};

			var dx, dy, neighborStuck = false;
			for (dx = -1; dx < 2; dx++) {
				for (dy = -1; dy < 2; dy++) {
					//console.log('check ' + dx + ', ' + dy);
					neighborStuck = _check(dx, dy);
					if (neighborStuck) break;
				}
				if (neighborStuck) break;
			}

			this._isStuck = neighborStuck;
		}

		return this._isStuck;
	}

	var _coinTossX, _coinTossY;
	function moveRule() {
		if (!this.isStuck()) {
			delete positionHash[this.x][this.y];
			var p = _getNext(this.x, this.y);

			this.x = p.x;
			this.y = p.y;

			if (!positionHash[this.x]) {
				console.log('x ' + this.x);
			}

			positionHash[this.x][this.y] = this;
		}
	}
})();