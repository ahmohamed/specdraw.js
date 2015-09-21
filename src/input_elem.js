var inp = {};
var fireEvent = require('./utils/event');

inp.num = function (label, val, _min, _max, step, unit) {
	var elem = d3.select(document.createElement("label"));
	elem.classed('param num', true)
		.text(label)
		.append("input")
			.attr({
				type: 'number',
				value: typeof val === "undefined" ? 0: val,
				min: typeof _min === 'undefined'? -Infinity: _min,
				max: typeof _max === 'undefined'? Infinity: _max,
				step: typeof step === 'undefined'? 1: step
			})
			.text(typeof unit === 'undefined'? '': unit);
	
	elem.node().getValue = function(){ 
		return elem.select('input').node().value;
	};
	return function () { return elem.node();	};
};

inp.text = function (label, placeholder) {
	var elem = d3.select(document.createElement("label"));
	elem.classed('param text', true)
		.text(label)
		.append("input")
			.attr({
				type: 'text',
				placeholder: placeholder || ''
			});
	
	return function () { return elem.node(); };
};

inp.checkbox = function (label, val) {
	var elem = d3.select(document.createElement('label'));
	elem.classed('param checkbox', true)
		.append("input")
			.attr('type', 'checkbox')
      .on('change', function () {
        fireEvent(this, 'input');
      })
      .node().checked = val ? true: false;
	
	elem.append('div')
			.classed('checker', true);
  elem.append('div')
		.classed('label', true)
		.text(typeof label === 'string' ? label : '');
	
	elem.node().getValue = function(){ 
		return elem.select('input').node().checked;
	};
	return function () { return elem.node();	};
};
inp.checkbox_toggle = function (label, val, div_data) {
	var elem = d3.select(document.createElement('div'))
    .classed('param checkbox-toggle', true);
  
  elem.append(inp.checkbox(label, val))
    .select('input').on('change', function () {
      elem.select('.div_enable')
        .classed('disabled', !this.checked);
      fireEvent(this, 'input');
    });
	
  elem.append(inp.div(div_data))
		.classed('div_enable', true)
  	.classed('disabled', !elem.select('input').node().checked);
		
  elem.node().getValue = elem.select('.param.checkbox').node().getValue;
  
  return function () { return elem.node();	};
};
inp.select = function (label, options, val) {
	var elem = d3.select(document.createElement('label'))
		.classed('param select', true)
		.text(label);
	var select_elem = elem.append("select");
  
  select_elem.selectAll('option')
		.data(options).enter()
		.append('option')
			.text(function(d){return d;});
  
  select_elem.node().value = val;
  
	elem.node().getValue = function(){ 
		return select_elem.node().value;
	};
	return function () { return elem.node();	};
};

inp.select_multi = function (label, options) {
	var elem = d3.select(document.createElement('div'))
    .classed('param select-multi', true);
  
	elem.append('label')
    .text(label)
		.append("input")
			.attr('type', 'checkbox')
			.style('display', 'none')
      .on('change', function () {
        elem.select('ul')
          .classed('shown', this.checked);
      })
			.node().checked = false;
	
	elem.append('ul')
		.classed('block-list', true)
		.selectAll('li')
		.data(options).enter()
		.append('li')
			.each(function(d){
        d3.select(this).append(inp.checkbox(d, true));
      });
	
	elem.node().getValue = function(){ 
		return elem.selectAll('.param.checkbox')
			.filter(function () {
				return this.children[0].checked;
			})[0]
			.map(function (e) {
				return typeof(e.value) !== 'undefined' ? e.value
					: d3.select(e).select('.label').text();
			});
	};
	return function () { return elem.node();	};
};

inp.select_toggle = function (label, options) {
	console.log(label, options);
	var elem = d3.select(document.createElement('div'))
    .classed('param select-toggle', true);
  
  elem.append(inp.select(label, Object.keys(options))) 
	  .selectAll('option')
      .attr('value', function(d){return d;})
      .text(function(d){return options[d][0];});
	
	var fieldset = elem.append("div")
		.classed("method_params", true);
	var select_elem = elem.select('select').node();
	
	elem.select('select').on('input', function () {
    d3.event.stopPropagation();
  })
    .on('change', function () {
		fieldset.select('fieldset').remove();

		if( Object.keys( options[select_elem.value][1]).length > 0 ){
			fieldset.append("fieldset")
				.append(inp.div( options[select_elem.value][1] ));
				//.appened('legend', 'Parameters');
		}
    
    fireEvent(this.parentNode, 'input');
	});
	
	if( Object.keys(options[ select_elem.value ][1]).length > 0 ){
		fieldset.append("fieldset")	
			.append(inp.div( options[ select_elem.value ][1] ));
	}
	
	elem.node().getValue = function(){ 
		return select_elem.value;
	};
	return function(){return elem.node();};
};
inp.button = function (label) {
	var elem = d3.select(document.createElement('input'))
		.classed('param btn', true)
		.attr('type', 'button')
		.attr('value', label)
		.on("click", function(){ fireEvent(this, 'input'); });
	
	elem.node().getValue = function(){ 
		return d3.event && d3.event.target === elem.node();
	};	
	return function(){return elem.node();};
};
inp.threshold = function (label, axis, app) {
	console.log('app: ',app);
	var elem = d3.select(document.createElement('div'))
	.classed('param threshold', true);
	
	var input = elem.append("input").attr("type", "hidden");

	var val = elem.append("input")
		.attr("type", "text")
		.attr('readonly', 'readonly');
	
	elem.insert(inp.button(label), ':last-child')
  	.on("click", function(){ 
			var modal = d3.selectAll(".nanoModalOverride:not([style*='display: none'])")
				.style('display', 'none');
			
			//TODO: app-specific.
			var th_fun = require('./d1/threshold')();
			
			th_fun(app.currentSlide().specContainer(), function (t) {
				val.attr('value', t.toExponential(2));
				input.attr('value', t);
				modal.style('display', 'block');
			});
				
		});
	
	elem.node().getValue = function () {
		return input.node().value;
	};
	return function() { return elem.node(); };
};
/* parses the GUI data into a div HTML element.
	 @param div_data object containing parameter names as keys
	 and GUI information (Array) as values.
	 The GUI array consists of the following:
	 * label: text label of the input
	 * type: the input type:
			0:number 1:checkbox 2:text 3:select_toggle 4:checkbox_toggle
			5:button 6:threshold
*/
inp.div = function (div_data, app) {
	var div = d3.select(document.createElement('div'));
  for (var key in div_data){
		var p = div_data[key];
		if(typeof p === 'function') {continue;} //Exclude Array prototype functions.
		div.append(parseInputElem.apply(null, p.concat(app)))
			.node().id = key;
  }
	
	return function() {return div.node();};
};

var parseInputElem = function (label, type, details, app) {
	var f = [
		inp.num, inp.checkbox, inp.text, inp.select_toggle,
		inp.checkbox_toggle, inp.button, inp.threshold
	][type];
	
	var args = [label].concat(details);
	args = type === 6 ? args.concat(app) : args;
	return f.apply(null, args);
};

inp.spectrumSelector = function (app) {
	var specs = app.currentSlide() ? app.currentSlide().spectra(): null;
	
	
	if ( (!specs) || specs.length === 0){
		return function () {
			return d3.select(document.createElement('div')).text('No Spectra to show').node();
		};
	} 
	
	var spec_container = app.currentSlide().specContainer();		
	var elem = 	d3.select(
		inp.select_multi('Select Spectrum', specs)()
		).classed('spec-selector', true);
	
	elem.selectAll('li')
	  	.each(function(s){
				d3.select(this).select('.checkbox')					
					.style('color', getComputedStyle(s.select('path').node()).stroke)
					.style('opacity', getComputedStyle(s.select('path').node()).strokeOpacity)
					.select('.label').text( s.label() );
					
				d3.select(this).on('mouseenter', function () {
					spec_container.highlightSpec(s);
				})//mouseover
				.on('mouseleave', function () {
					spec_container.highlightSpec();
				});//mouseout
			});//end each
	
	elem.node().getValue = function () {
		return elem.selectAll('li')
			.filter(function () {
				return d3.select(this).select('input').node().checked === true;
			})
			.data().map(function(e){
	        return e.s_id();
	    });
	};
	elem.node().id = 'sid';
	
	return function(){return elem.node();};
};
inp.preview = function(auto){
	var div_data = {
		"prev_auto":["Instant Preview", 1, typeof auto !== 'undefined'],
		"prev_btn":["Preview", 5, null],
	};
	return inp.div(div_data);
};
inp.popover = function (title) {
	var div = d3.select(document.createElement('div'))
		.classed('popover right', true);
	
	div.append('div').classed('arrow', true);
	var inner = div.append('div').classed('popover-inner', true);
	inner.append('h3').classed('popover-title', true).text(title);
	inner.append('div').classed('popover-content', true);
	
	return function() {return div.node();};
};

module.exports = inp;