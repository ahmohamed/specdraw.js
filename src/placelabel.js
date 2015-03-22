(function(){ "use strict";

var collide = function(node) {
  var n_width = node.bbox.width/2,
      n_height = node.bbox.height/2,
      nx1 = node.x - n_width,
      nx2 = node.x + n_width,
      ny1 = node.y - n_height,
      ny2 = node.y + n_height;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node) && (quad.point.fixed) ) {
      var dx = node.x - quad.point.x,
        	adx = Math.abs(dx),
          dy = node.y - quad.point.y,
          ady = Math.abs(dy),
          mdx = quad.point.bbox.width/2 + n_width,
          mdy = quad.point.bbox.height/2 + n_height;
      
      /********  This part should be modified*********/
      	  if (adx < mdx  &&  ady < mdy) {          
            var l = Math.sqrt(dx * dx + dy * dy);
    
            var lx = (adx - mdx) / l * 0.5
            var ly = (ady - mdy) / l * 0.5
            


            // choose the direction with less overlap
           //if (lx > ly  &&  ly > 0) lx = 0;
            //else if (ly > lx  &&  lx > 0) ly = 0;


            dx *= lx
            dy *= ly
            node.x -= dx
            node.y -= dy
						if(quad.point.fixed){
							quad.point.x += dx
	            quad.point.y += dy            	
						}
            
          }
      
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}

var place_label = function(vis, peaks,  xScale, yScale){
	var w = svg.attr("width"), 
		h = svg.attr("height");

	var labelAnchors = [];
	var labelAnchorLinks = [];


	for(var i = 0; i < peaks.length; i++) {
	var node = {
			label : d3.round(peaks[i].x ,3) + "," + d3.round(peaks[i].y ,3),
			p: peaks[i]
		};
  
		labelAnchors.push({
			node : node,
			fixed:true
		});
		labelAnchors.push({
			node : node
		});

	labelAnchorLinks.push({
			source : i * 2,
			target : i * 2 + 1,
			weight : 1
		});
	};




	var anchorLink = vis.selectAll("line.anchorLink").data(labelAnchorLinks).enter().append("svg:line").attr("class", "anchorLink").style("stroke", "#999");

	var anchorNode = vis.selectAll("g.anchorNode").data(labelAnchors).enter().append("svg:g").attr("class", "anchorNode");
	anchorNode.append("svg:circle").attr("r", 0).style("fill", "#FFF");
	anchorNode.append("svg:text").text(function(d, i) {
		return i % 2 == 0 ? '\u2715' : d.node.label
		})
		.style("text-anchor", "middle")
		.attr("dy", ".35em");

	// Add bounding box info to force nodes.
	labelAnchors.forEach(function(d,i){
	  d.bbox = anchorNode[0][i].childNodes[1].getBBox();
	});

	var force = d3.layout.force().nodes(labelAnchors).links(labelAnchorLinks).gravity(0).linkDistance(20).linkStrength(10).charge(-50).size([w, h]);



	var updateLink = function() {
		this.attr("x1", function(d) {
			return d.source.x;
		}).attr("y1", function(d) {
			return d.source.y;
		}).attr("x2", function(d) {
			return d.target.x;
		}).attr("y2", function(d) {
			return d.target.y;
		});

	}

	var updateNode = function() {
		this.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		});
	}


	force.on("tick", function() {
		var q = d3.geom.quadtree(labelAnchors),
			i = 0;

	  while (++i < labelAnchors.length) q.visit(collide(labelAnchors[i]));        
		
		anchorNode.each(function(d, i) {
			//fix node positions.
			if(i % 2 == 0) {
					d.x = xScale(peaks[i/2].x);
					d.y = yScale(peaks[i/2].y);
			}
		});
		
		});
		
		force.start();
		for (var i = 1000; i > 0; --i) force.tick();
	  force.stop();	
		
		
		anchorNode.call(updateNode);		
		anchorLink.call(updateLink);
}
window.place_label = place_label;
console.log("placelabel");

})();