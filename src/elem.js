spec.elem = {};

spec.elem.dropdown = function (parent, label, options) {
	var selector = parent.append('div')
		.text(label)
		.classed('checkbox-dropdown', true)
		.append('ul')
		.classed('checkbox-dropdown-list', true)
		//.attr('multiple', true);
	

	var option_labels = selector.selectAll("li")
		.data(options)
		.enter()
		.append("li")
		.append("label")
		
	option_labels.append('input')
		.attr('type', 'checkbox');
	
	option_labels.html(function(d){
		return d3.select(this).html()+ d
	})

	parent.select('.checkbox-dropdown')
		.on('click', function (e) {
			d3.select(this).toggleClass('is-active');
		});
	
	selector.on('click', function (e) {
		d3.event.stopPropagation();
	});
	
	selector.node().getSelected = function () {
		return selector.selectAll('label')[0].map(function (e) {
			if(e.children[0].checked)
				return typeof(e.value) !== 'undefined' ? e.value : d3.select(e).text();
		});
	}
	return selector;	
};
