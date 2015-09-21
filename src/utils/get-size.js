module.exports = function (node) {
	var clientwidth = node.clientWidth,
	clientheight = node.clientHeight;
	
	var br_width, br_height;
	if(typeof node.getBoundingClientRect === 'function'){
		br_width = node.getBoundingClientRect().width;
		br_height = node.getBoundingClientRect().height;
	}
	var cs_width, cs_height;
	if(typeof getComputedStyle === 'function'){
		cs_width = getComputedStyle(node).width;
		cs_height = getComputedStyle(node).height;
	}
	
	var width = d3.max(clientwidth, br_width, cs_width),
		height = d3.max(clientheight, br_height, cs_height);
	
	return [width, height];
};