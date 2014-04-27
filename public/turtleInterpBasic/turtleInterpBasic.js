(function () {
	var DLAPoint = this.phong.dla.DLAPoint;
	var ctx;
	var fieldWidth = 500,
		fieldHeight = 500;

	$(function () {
		console.log('here');
		var display = $('#dlaCanvas')[0];
        var turtleEnging = new phong.lsystems.TurtleEngine(
            display, 'F-F-F-F', { F: 'F-F+F+FF-F-F+F' },
            {
                x: 130,
                y: 100,
                heading: 90,
                unitLength: 200,
                headingDelta: 90
            }
        );

        turtleEnging.applyRewrites(4);
        turtleEnging.interpreteTurtle();
	});
})();