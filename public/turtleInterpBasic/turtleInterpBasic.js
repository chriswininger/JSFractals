(function () {
	var DLAPoint = this.phong.dla.DLAPoint;
	var ctx;
	var fieldWidth = 500,
		fieldHeight = 500;

	$(function () {
		console.log('here');
		var display = $('#dlaCanvas')[0];

        var turtleEnging1 = new phong.lsystems.TurtleEngine(
            display, 'F-F-F-F', { F: 'F-F+F+FF-F-F+F' }, 1,
            {
                x: 130,
                y: 100,
                heading: 90,
                unitLength: 200,
                headingDelta: 90
            }
        );

       var turtleEnging2 = new phong.lsystems.TurtleEngine(
            display, 'Fl',
            {
                Fl: 'Fl+Fr++Fr-Fl--FlFl-Fr+',
                Fr: '-Fl+FrFr++Fr+Fl--Fl-Fr'
            },
            2,
            {
                x: 300,
                y: 50,
                heading: 0,
                unitLength: 1400,
                headingDelta: 60
            }
        );

        var engines = [turtleEnging1, turtleEnging2];

        turtleEnging1.applyRewrites(4);
        turtleEnging1.interpreteTurtle();


        $('#turtleSelection').change(function () {
           var val = $(this).val();
            engines[val].reset();

            engines[val].applyRewrites(4);
            engines[val].interpreteTurtle();
        });
	});
})();