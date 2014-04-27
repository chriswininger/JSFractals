(function () {
    this.phong = this.phong || {};
    this.phong.lsystems = this.phong.lsystems || {};

    this.phong.lsystems.TurtleEngine = TurtleEngine;

    var lineColor = 'rgba(0,0,0,255)';
    var commands = {
      // move forward by the unitLength
      F: function () {
        var oldX = this.x, oldY = this.y,
            headingRadians = this.heading * Math.PI/180;
        this.x = this.x + this.unitLength * Math.cos(headingRadians);
        this.y = this.y + this.unitLength * Math.sin(headingRadians);
        this.drawLine(oldX, oldY, this.x, this.y);
      },
      f: function () {
          this.x = this.x + this.unitLength * Math.cos(this.heading);
          this.y = this.x + this.unitLength * Math.sin(this.heading);
      },
      '+': function () {
          this.heading += this.headingDelta;
      },
      '-': function () {
          this.heading -= this.headingDelta;
      }
    };

    function TurtleEngine (ctx, axiom, productionRules, state, rewriteMode) {
        this.ctx = ctx;
        this.axiom = axiom;
        this.productionRules = productionRules;

        this.commandString = this.axiom;
        this.rewriteMode = rewriteMode || this.RewriteModes.lineReplacement;
        this.initialState = state;

        this.setFromState(state);
    }

    _.extend(TurtleEngine.prototype, {
        drawLine: function (x1, y1, x2, y2) {
            var fill = this.ctx.fillStyle;

            this.ctx.fillStyle = lineColor;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();

            this.ctx.fillStyle = fill;
        },
        interpreteTurtle: function () {
            var self = this;
            _.each(this.commandString, function (command) {
                if (!commands[command]) return console.error('invalid character in command string');
                commands[command].call(self);
            });
        },
        applyRewrite: function () {
            var newCommandString = '';
            var self = this;
            _.each(this.commandString, function (command) {
                // perform replacesment or assume one to one
                newCommandString += self.productionRules[command] || command;
            });
            this.commandString = newCommandString;
        },
        applyRewrites: function (n) {
            for (var i = 0; i < n; i++) {
                this.applyRewrite();
                // reduce by 4 times with each iteration
                this.unitLength = this.unitLength/4;
            }
        },
        reset: function () {
            this.commandString = this.axiom;
            this.setFromState(this.initialState);
        },
        setFromState: function (state) {
            this.x = state.x;
            this.y = state.y;
            this.heading = state.heading;
            this.unitLength = state.unitLength;
            this.headingDelta = state.headingDelta;
        }
    }, {
        RewriteModes: {
            lineReplacement: 'lineReplacement',
            nodeReplacement: 'nodeReplacement'
        }
    });
})();
