function Gauge(conf) {
	this.tick_length= conf.tick_length;
	this.tick_thickness= conf.tick_thickness;
	this.num_sub_ticks= conf.num_sub_ticks;
	this.large_tick_scale= conf.large_tick_scale;
	this.total_degrees= conf.total_degrees;
	this.tick_color= conf.tick_color;
	this.tick_on_color= conf.tick_on_color;
	this.gauge_scale= conf.gauge_scale;
	this.percent= conf.percent;
	this.context= conf.context;
	this.canvas= conf.canvas;
	this.animation_speed= conf.animation_speed;
	return this;
}
Gauge.prototype.render= function() {
	var canvas= this.canvas;
	this.context = (this.context ? this.context : canvas.getContext("2d"));
	var context= this.context;
	context.save(); //save original state of context to that it can be restore after rendering

	//set tick color
	context.fillStyle = this.tick_color;

	//set the center of rotation to the bottom/center of the canvas
	context.translate(canvas.width / 2, canvas.height-this.tick_thickness/2);

	//set the scale of the gauge (will naturally fill the width of the canvas
	context.scale(this.gauge_scale,this.gauge_scale);

	//figure out how many degrees between each tick
	var num_ticks= 5 + this.num_sub_ticks*4;
	var rotation_deg= this.total_degrees/(num_ticks-1);

	//adjust for smaller than 180 degree gauges
	var starting_deg= (180-this.total_degrees)/2;
	context.rotate(starting_deg*Math.PI/180);

	//draw all of the ticks
	for(var i=0; i<=this.total_degrees; i+=rotation_deg) {
		//scale the ticks at 1/4 the way around gauge
		var rect_scale= (Math.ceil(i%(this.total_degrees/4))==0 || Math.floor(i%(this.total_degrees/4))==0) ? this.large_tick_scale : 1;
		//draw tick
		context.fillStyle= ((i/this.total_degrees)*100 <= this.percent) ? this.tick_on_color : this.tick_color;
		context.fillRect(-1*(canvas.width/2), -this.tick_thickness/2, this.tick_length*rect_scale, this.tick_thickness);
		//rotate for next tick to be placed
		context.rotate(rotation_deg*Math.PI/180);
	}

	context.restore(); //set back to original state

	return true;
};
Gauge.prototype.updatePercent= function(percent) {
	_this= this;
	$('#animation_helper').css({left:0}).animate(
		{
			left: 100
		},
		{
			duration: _this.animation_speed,
			easing: 'linear',
			step: function(now, fx) {
				_this.percent= (parseInt(now)/100)*percent;
				_this.render();
			},
			complete: function() {
				_this.percent= percent;
				_this.render();
			}
		} 
	);
};
