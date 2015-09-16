var inp = require('../input_elem');

function slides (app) {
	function _main(div) {		
		div.select('.menu-container').remove();
		
		var slides = app.selectAll('.spec-slide');
		
		var nav = div.append(inp.popover('Slides'))
			.classed('menu-container', true)
			.select('.popover-content')
		
		nav.append('ul')
			.classed('block-list slide-list', true)
			.selectAll('li')
			.data(slides[0]).enter()
			.append('li')
				.text(function(d,i){return 'Slide ' + (i+1);})
				.on('click', function (d) {
					slides.classed('active', false);
					d3.select(d).classed('active', true);
					app.node().dispatcher.slideChange();
				});
				
		return div;
	}
	return _main;
};

module.exports = slides;