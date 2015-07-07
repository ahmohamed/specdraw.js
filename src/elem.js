spec.elem = {};

spec.elem.dropdown = function (parent, label, options) {
	var selector = parent.append('div')
		.text(label)
		.classed('checkbox-dropdown', true)
		.on('click', function (e) {
			d3.select(this).toggleClass('is-active');
		})
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
		return d3.select(this).html() + d
	});
	
	selector.on('click', function (e) {
		d3.event.stopPropagation();
	});
	
	selector.node().getSelected = function () {
		return selector.selectAll('label')[0]
			.filter(function (e) {
				return e.children[0].checked;
			})
			.map(function (e) {
				return typeof(e.value) !== 'undefined' ? e.value : d3.select(e).text();
			});
	};
	selector.node().appendOption = function (_) {
		var label = selector.append('li')
			.append('label')
		
		label.append('input')
		.attr('type', 'checkbox');
	
		label.html(label.html() + _);
		return label;
	};
	return selector;
};

spec.elem.spectrumSelector = function (el) {
	var specs = d3.select('.spec-slide.active').select(".main-focus").selectAll(".spec-line")
	if (specs.size() === 0) return;
	
	var selector = 	spec.elem.dropdown(el, 'Select Spectrum', [])
		.classed('spec-selector', true)
	var legend = '<span class="spec-legend">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>';
	specs.each(function () {
		var s = this;
		var o = selector.node().appendOption(s.label + legend)
			.style('color', getComputedStyle(s.children[0]).stroke)
			.on('mouseover', function () {
				d3.select(s).classed('highlighted', true);
			})
			.on('mouseout', function () {
				d3.select(s).classed('highlighted', false);
			});
			
		o.node().value = s.s_id();
		o.select('input')
			.attr('checked', d3.select(s).classed('selected'));
	});
};
