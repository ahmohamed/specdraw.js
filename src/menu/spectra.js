var inp = require('../input_elem');

function spectra (app) {
  function _main(div) {
    div.select('.menu-container').remove();
    
    var nav = div.append(inp.popover('Spectra'))
      .classed('menu-container', true)
      .select('.popover-content');
    
    //TODO: SpectrumSelector takes an App
    var spec_selector = inp.spectrumSelector(app);    
    
    if( (!app.currentSlide()) || app.currentSlide().spectra().length === 0){
      nav.append(spec_selector);
    }else{
      var spec_list = d3.select( spec_selector() ).select('ul');
      
      if(app.config() > 2){
        spec_list.append('li')
          .text('+ Add spectrum')
          .on('click', require('../pro/open-file')(app) );
      }
      
      nav.append( function () {return spec_list.node();} )
        .classed('block-list spec-list no-checkbox', true);
    }  
    
    return div;
  }
  return _main;
}

module.exports = spectra;