spec.slideChanger = function () {
	function _main (svg) {
		var inner;
		if(svg.select('.slide-changer').size() === 0){
			var elem = svg.append("g")
				.attr("class", "slide-changer");
		
			var width = svg.attr("width"),
					height = svg.attr("height");
		
			var slideout = elem.append("svg:foreignObject")
				.attr("width", width)
				.attr("height", height)
				.style('pointer-events', 'all')
				.append("xhtml:div")
				.classed("slideout", true)
				.on('click', function () {
					slideout.toggleClass('active');
				})
		
			slideout.append('xhtml:p').text('Slides');
			inner = slideout.append('xhtml:div')
				.classed('slideout_inner', true)
				.text('Switch Slide');			
		}else{
			inner = svg.select('.slideout_inner');
		}
		
		var slides = svg.selectAll('.spec-slide');
		/*slides.each(function (d,i) {
			var this_slide = this;
			inner.append('xhtml:div').text('slide ' + i)
				.on('click', function () {
					slides.classed('active', false);
					d3.select(this_slide).classed('active', true);
					console.log(this_slide)
					svg.node().dispatcher = this_slide.slideDispatcher;
				});
		});*/
		
		inner.selectAll('div')
			.data(slides[0]).enter()
			.append('xhtml:div')
				.text(function(d,i){return 'slide ' + i;})
			
		inner.selectAll('div')
			.on('click', function (d) {
				slides.classed('active', false);
				d3.select(d).classed('active', true);
				svg.node().dispatcher = d.slideDispatcher;
			});
	}
	
	return _main;
};
