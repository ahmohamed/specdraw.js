module.exports = function (data, xscale, tolerance) {
	var ppm_range = Math.abs(xscale.domain()[0] - xscale.domain()[1]);
	var pixels = Math.abs(xscale.range()[0] - xscale.range()[1]);
	var ppm_per_pixel = ppm_range / pixels;
	tolerance *= ppm_per_pixel;
	
  var dataResample = require('simplify')(data, tolerance);
	return dataResample;
};
