var inp = require('../input_elem');

function spectra (app) {
	function _main(div) {
		div.select('.menu-container').remove();
		
		var nav = div.append(inp.popover('Spectra'))
			.classed('menu-container', true)
			.select('.popover-content')
		
		//TODO: SpectrumSelector takes an App
		var spec_list = d3.select(inp.spectrumSelector()())
			.select('ul');
		
		if(spec_list.size() === 0){
			nav.append(inp.spectrumSelector());
		}else{
			nav.append(function () {
				return spec_list.node();
			}).classed('block-list spec-list no-checkbox', true);
		}					
		
		return div;
	}
	return _main;
}

module.exports = spectra;