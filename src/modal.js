var modals = {
	crosshair:true,
	peakpick:false,
	peakdel:false,
	integrate:false,	
}

modals.proto = function (title, content, ok_fun, cancel_fun) {	
	var nano = nanoModal(
		//'<div><div class="title">' + (title?title:"Dialogue") +  '</div>' + content + '</div>',
		content,
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
	
	d3.select(nano.modal.el).insert("div", ":first-child")
		.classed('title', true)
		.text( title? title : "Dialogue" )
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

modals.error = function (title, message) {
	var nano = modals.proto('Error:' + title, message);
	d3.select(nano.modal.el)
		.classed('errorModal', true)
		.select('.cancelBtn').text('Dismiss');
	nano.show();
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

var add_selector = function (el, ok_fun) {
	var specs = d3.select(".main-focus").selectAll(".spec-line")
	var specs_labels =	specs[0].map(function (e) {
			return e.label;
		});
	
	spec.elem.dropdown(el, 'Select Spectrum', specs_labels)
		.classed('spec-selector', true)
		.selectAll('label').each(function (d,i) {
			this.value = specs[0][i].s_id();
			console.log('value',this.value)
		})
		.selectAll('input')
			.attr('checked', true);
	
};

var add_preview = function (el, ok_fun) {
	var form_data = {}
	var args = {
		"prev_auto":["Auto Preview", 1, true],
		"prev_btn":["Preview", 5, null],
	};
	el.call(makeMethodParams(args));
	
	var timer = null;
	el.on("input", function(){
	  d3.event.stopPropagation();
		if(timer)
			clearTimeout(timer);		
		
		// prev_auto and prev_btn are labels. To check the input, look at children[0]
		if(d3.event.target === el.select('#prev_btn').node().children[0]){
			ok_fun();
		}else	if(el.select('#prev_auto').node().children[0].checked){
			timer = setTimeout(ok_fun, 300);
		}
	});
};


modals.method_args = function (fun ,args, title, specSelector, preview) {
  var form_data = {}, el;
	var ok_fun = function (modal) {
	  el.selectAll(".param")[0].forEach(function(e){
			//TODO: change to e.children[0].type ==="checkbox"
	    form_data[e.id] =  e.children[0].type ==="checkbox"? e.children[0].checked :e.children[0].value;
	  });
		
		if(modal) modal.hide();
		
		var s_ids = el.select('.spec-selector').node().getSelected()
		pro.plugin_funcs(fun, form_data, s_ids);
		form_data = {};
	};
	
	var nano = modals.proto(title, "",	ok_fun);
	
	el = d3.select(nano.modal.el).select(".nanoModalContent");
	
	el.call(add_selector, ok_fun);
	el.call(makeMethodParams(args));
	el.call(add_preview, ok_fun);
	return nano.show;
};
spec.method_args = modals.method_args;