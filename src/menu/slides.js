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
			.data(app.slides).enter()
			.append('li')
				.text(function(d,i){return 'Slide ' + (i+1);})
				.on('click', function (d) {
					app.dispatcher().slideChange(d);
				});
				
		return div;
	}
	return _main;
};

module.exports = slides;