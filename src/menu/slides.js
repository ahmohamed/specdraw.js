var inp = require('../input_elem');

module.exports = function (app) {
	function _main(div) {		
		div.select('.menu-container').remove();
		
		var nav = div.append(inp.popover('Slides'))
			.classed('menu-container', true)
			.select('.popover-content');
		
		nav.append('ul')
			.classed('block-list slide-list', true)
			.selectAll('li')
			.data(app.slides).enter()
			.append('li')
				.text(function(d,i){return 'Slide ' + (i+1);})
				.on('click', function (d) {
					app.dispatcher().slideChange(d);
				});
		
		if(app.config() > 2){
			nav.select('ul')
				.append('li')
					.text('+ New Slide')
					.on('click', function () {
						app.appendSlide();
					});
		}
			
		return div;
	}
	return _main;
};

