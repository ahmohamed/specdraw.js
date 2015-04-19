var modals = {
	crosshair:true,
	peakpick:false,
	peakdel:false,
	integrate:false,	
}

modals.proto = function (title, content, ok_fun, cancel_fun) {	
	var nano = nanoModal(
		'<div><div class="title">' + (title?title:"Dialogue") +  '</div>' + content + '</div>',
		{
		overlayClose: false,
		buttons: [
			{
		    text: "OK",
		    handler: ok_fun,
		    primary: true
			}, 
			{
		    text: "Cancel",
		    handler: cancel_fun? cancel_fun : "hide",
				classes:"cancelBtn"
			}
		]}
	);
	
	d3.select(nano.modal.el).on("keydown", function() {
		if (d3.event.keyCode===13) { // Enter
			d3.select(nano.modal.el).select(".nanoModalBtnPrimary").node().click();
		}
		if (d3.event.keyCode===27) { // Escape
			d3.select(nano.modal.el).select(".cancelBtn").node().click();
		}
	})
	
	nano.onShow(function () {
		var drag = d3.behavior.drag()
			.on("drag", function () {
				//console.log(d3.event.sourceEvent.pageX, d3.event.y)
		    d3.select(nano.modal.el)
		      .style("top", d3.event.sourceEvent.pageY+"px")
		      .style("left", d3.event.sourceEvent.pageX+"px")				
			});
		d3.select(nano.modal.el).select(".title").call(drag)
		d3.select(nano.modal.el).select(".cancelBtn").node().focus();
	});
	return nano;
}
modals.range = function (text, _range, callback, _curr_val){
	var range;
	if(_range[0]>_range[1])
		range = [_range[1], _range[0]];
	else{
		range = _range;
	}
	range = [d3.round(range[0],3), d3.round(range[1],3)];
	
	if(typeof _curr_val === 'undefined'){
		_curr_val = range;
	}else{
		if(_curr_val[0]>_curr_val[1])
			_curr_val = [_curr_val[1], _curr_val[0]];
		
		_curr_val = [d3.round(_curr_val[0],3), d3.round(_curr_val[1],3)];
	}
	
	var content = text +
		'<input type="number" id="range0" step="0.001" value='+_curr_val[0]+ ' min='+ range[0] + ' max='+ range[1] +'>' +
		' - ' +
		'<input type="number" id="range1" step="0.001" value='+_curr_val[1]+ ' min='+ range[0] + ' max='+ range[1] +'>';
		
	var nano = modals.proto("Range", content,
		function(modal) {
			modal.hide();
      var input_range = d3.select(modal.modal.el)
				.selectAll("input")[0].map(function(e){ return +e.value; });
			
			if (input_range[0] < range[0] || input_range[0] > range[1]
				|| input_range[1] < range[0] || input_range[1] > range[1]
				|| input_range[0] > input_range[1])
				nanoModal("Invalid input."+input_range).show();
			else{
				if(_range[0]>_range[1])
					callback(input_range.reverse());
				else{
					callback(input_range);
				}
			}
    });
	
	return nano.show;	
};

modals.input = function (text, value,callback){	
	var content = text +
		'<input type="number" id="input0" step="0.001" value='+value+'>';
		
	var nano = modals.proto("Numeric", content,
		function(modal) {
			modal.hide();
      var input = d3.select(modal.modal.el)
				.select("input").node().value;
			callback(input);
    });
	
	return nano.show;	
};

modals.xRegion = function () {
	modals.range(
		"Set x region to:\n",
		d3.select(".main-focus").node().range.x,
		function (new_range) { d3.select(".main-focus").on("_regionchange")({xdomain:new_range}); },
		d3.select(".main-focus").node().xScale.domain()
	)();
};

modals.yRegion = function () {
	modals.range(
		"Set y region to:\n",
		d3.select(".main-focus").node().range.y,
		function (new_range) { d3.select(".main-focus").on("_regionchange")({ydomain:new_range}); },
		d3.select(".main-focus").node().yScale.domain()
	)();
};

modals.slider = function (text, value, callback){	
	var content = text +
		'<input id="slider" type="range" min="-5" max="5" value="0" step="0.001"/>';
		
	var nano = modals.proto("Slider", content,
		function(modal) {
			modal.hide();
    },
		function (modal) {
			callback(0);
		});
	
	d3.select(nano.modal.el).select("#slider")
		.on("input", function(){
	    callback(+this.value);
		});
	
	return nano.show;	
};

modals.scaleLine = function () {
	modals.slider(
		"Scale spectrum by a factor:",
		0,function (value) {
			d3.select(".selected").node().setScaleFactor(Math.pow(2,value));
		}	
	)();
};

modals.bl = function () {
  var form_data = {};
	function oninput(){
		pro.bl(prev_bl, form_data);
		form_data = {}
	}
	var nano = modals.proto("Baseline correction","",
		function (modal) {
			modal.hide();
		}		
	);
	
	var el = d3.select(nano.modal.el).select(".nanoModalContent");
	el.call(makeMethodParams(methods.bl));
	console.log(el)
	
	var timer = null;
	el.on("input", function(){
	  d3.event.stopPropagation();
		if(timer)
			clearTimeout(timer);		

	  el.selectAll(".param")[0].forEach(function(e){
			//TODO: change to e.children[0].type ==="checkbox"
	    form_data[e.id] =  e.childNodes[1].value ==="on"? e.childNodes[1].checked :e.childNodes[1].value;
	  });

		if(form_data["prev_auto"])		
			timer = setTimeout(oninput, 300);
		else if(d3.event.target.type === 'button'){
			oninput();
		}
	});
	
	nano.show();
};
