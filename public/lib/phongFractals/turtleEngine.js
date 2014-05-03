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

    function TurtleEngine (display, axiom, productionRules, commandLength, state, rewriteMode) {
        this.fieldWidth = display.width || display.scrollWidth;
        this.fieldHeight = display.height || display.scrollHeight;
        this.ctx = display.getContext("2d");

        this.axiom = axiom;
        this.productionRules = productionRules;

        this.commandLength = commandLength;
        this.commandString = this.axiom;
        this.rewriteMode = rewriteMode || this.RewriteModes.lineReplacement;
        this.initialState = state;

        this.setFromState(state);
    }

    _.extend(TurtleEngine.prototype, {
        drawLine: function (x1, y1, x2, y2) {
            var fill = this.ctx.fillStyle;

            // draw line as those origin is at bottom left
            y1 = this.fieldHeight - y1;
            y2 = this.fieldHeight - y2;

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
                // just ignore commands with no meaning
                if (commands[command]) {
                    commands[command].call(self);
                }
            });
        },
        applyRewrite: function () {
            var newCommandString = '';
            var self = this;

            var buffer = '';
            _.each(this.commandString, function (command) {
                buffer += command;
                if (buffer.length === self.commandLength) {
                    if (self.productionRules[buffer]) {
                        // perform replacement or assume one to one
                        newCommandString += self.productionRules[buffer];
                        buffer = '';
                    } else {
                        // shift the buffer a char and push that char onto string
                        newCommandString += buffer[0];
                        buffer = buffer.slice(1);
                    }
                }
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
            this.ctx.clearRect(0, 0, this.fieldWidth, this.fieldHeight);
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
