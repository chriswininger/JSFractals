(function () {
	this.phong = this.phong || {};
	this.phong.dla = this.phong.dla || {};

	this.phong.dla.DLAPoint = DLAPoint;

	var id = null;

	function DLAPoint (x, y, color, ctx, moveRule, isStuck) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.ctx  = ctx;
		this.move = _.bind((moveRule || function () {}), this);
		this.isStuck = _.bind((isStuck || function () { return true; }), this);
		if (id === null) id = this.ctx.createImageData(1,1);
	}

	_.extend(DLAPoint.prototype, {
		draw: function () {
			if (this.x < 0 || this.y < 0) return;
			this.ctx.fillStyle = 'rgba(' + this.color[0] + ','+ this.color[1] + ',' + this.color[2] + ',' + this.color[3] + ')';
			this.ctx.fillRect(this.x, this.y, 1, 1);

			/*var d  = id.data;
			_.each(this.color, function (c, index) {
				d[index] = c;
			});

			this.ctx.putImageData(id, this.x, this.y);*/
		}
	});
})();