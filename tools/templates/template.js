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
	});
})();