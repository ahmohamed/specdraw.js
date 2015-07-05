pro.output = {};
pro.output.overwriteSpec = function (new_data, s_id) {
	if(typeof s_id === 'undefined' && 
		typeof new_data['s_id'] !== 'undefined'){
		s_id = new_data['s_id'];
	}
	
	var _main_focus = d3.select(".main-focus");
	var classname = _main_focus.node().nd == 1 ? ".spec-line" : ".spec-img";
	var overwrite_spec = _main_focus.selectAll(classname)
	.filter(function(e){ return this.s_id()==s_id; });
	
	_main_focus.node().addSpecLine(new_data, true, overwrite_spec);
};
pro.output.preview = function (new_data) {
	if(d3.select(".preview-spec").size() > 0){
		d3.select(".preview-spec").node().setData(new_data);
	}else{
		d3.select(".main-focus").node()
			.addSpecLine(new_data, false)
			.classed("preview-spec", true);		
	}
};
pro.output.newSpec = function (new_data) {
	d3.select(".main-focus").node().addSpecLine(new_data);
};
pro.output.newSlide = function (new_data) {
	
};
