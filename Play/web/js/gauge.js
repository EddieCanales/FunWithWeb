//animation frame shim
window.requestAnimFrame = (function(callback) {
	return window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

function Gauge(conf) {
	//TODO: set defaults
	//TODO: make this more generic (and easier to add to)

	this.tick_length= conf.tick_length;
	this.tick_thickness= conf.tick_thickness;
	this.num_sub_ticks= conf.num_sub_ticks;
	this.large_tick_scale= conf.large_tick_scale;
	this.total_degrees= conf.total_degrees;
	this.tick_color= conf.tick_color;
	this.tick_on_color= conf.tick_on_color;
	this.tick_on_glow= conf.tick_on_glow;
	this.bg_color= conf.bg_color;
	this.bg_image= conf.bg_image;
	this.gauge_scale= conf.gauge_scale;
	this._percent= conf.percent; //initializable, but private
	this.context= conf.context;
	this.canvas= conf.canvas;
	this.animation_speed= conf.animation_speed;

	return this;
}
Gauge.prototype._applyBG= function() {
	var canvas= this.canvas;
	var context= this.context;

	if(this.bg_color) {
		context.save();
		context.fillStyle= this.bg_color;
		context.fillRect(0,0,canvas.width,canvas.height);
		context.restore();
	}

	if(this.bg_image) {
		if(!this.bg_image_obj) { //only load the image once
			this.bg_image_obj= new Image();
			var _this= this;
			this.bg_image_obj.onload = function() {
				_this.bg_image_loaded= true;
				context.drawImage(_this.bg_image_obj, canvas.width/2-_this.bg_image.width/2+_this.bg_image.xoffset, canvas.height-_this.bg_image.height-_this.bg_image.yoffset,_this.bg_image.width,_this.bg_image.height);
			};
			this.bg_image_obj.src= this.bg_image.url;
		}
		else {
			if(this.bg_image_loaded) {
				context.drawImage(this.bg_image_obj, canvas.width/2-this.bg_image.width/2+this.bg_image.xoffset, canvas.height-this.bg_image.height-this.bg_image.yoffset);
			}
		}
	}

};
Gauge.prototype._prepareStage= function() {
	var canvas= this.canvas;
	var context= this.context;

	//clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

	//set background
	this._applyBG();
	
	//set the center of rotation to the bottom/center of the canvas
	context.translate(canvas.width / 2, canvas.height-this.tick_thickness/2);

	//set the scale of the gauge (will naturally fill the width of the canvas
	context.scale(this.gauge_scale,this.gauge_scale);
};

Gauge.prototype.render= function() {
	var canvas= this.canvas;
	this.context = (this.context ? this.context : canvas.getContext("2d"));
	var context= this.context;
	context.save(); //save original state of context to that it can be restore after rendering

	this._prepareStage();
	
	//figure out how many degrees between each tick
	var num_ticks= 5 + this.num_sub_ticks*4;
	var rotation_deg= this.total_degrees/(num_ticks-1);

	//adjust for smaller than 180 degree gauges
	var starting_deg= (180-this.total_degrees)/2;
	context.rotate(starting_deg*Math.PI/180);

	//draw all of the ticks
	for(var i=0; i<=this.total_degrees; i+=rotation_deg) {
		//should this tick be on or off?
		var is_on= ((i/this.total_degrees)*100 <= this._percent);

		//scale the ticks at 1/4 the way around gauge
		//TODO: make this depend on count, not percent of total degrees
		var rect_scale= (Math.ceil(i%(this.total_degrees/4))==0 || Math.floor(i%(this.total_degrees/4))==0) ? this.large_tick_scale : 1;

		//draw tick
		var color= is_on ? this.tick_on_color : this.tick_color;
		context.fillStyle= color;
		context.shadowBlur= is_on ? this.tick_on_glow : 0;
		context.shadowColor= color;
		context.fillRect(-1*(canvas.width/2), -this.tick_thickness/2, this.tick_length*rect_scale, this.tick_thickness);

		//rotate for next tick to be placed
		context.rotate(rotation_deg*Math.PI/180);
	}

	context.restore(); //set back to original state

	return true;
};
Gauge.prototype.updatePercent= function(percent) {
	var _this= this;

	//TODO: add the anim helper here instead of relying on it already existing
	if(_this.animation_speed) {
		$('#animation_helper').stop().css({left:0}).animate(
			{
				left: 100
			},
			{
				duration: _this.animation_speed,
				easing: 'linear',
				step: function(now, fx) {
					_this._percent= (parseInt(now)/100)*percent;
					_this.render();
				},
				complete: function() {
					_this._percent= percent;
					_this.render();
				}
			} 
		);
	}
	else {
		_this._percent= percent;
		_this.render();
	}
};
