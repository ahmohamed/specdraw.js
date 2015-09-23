function bin(data, binsize) {
	var out = [];
	var bin_index = 0, 
			bin_xval = 0,
			bin_yval = 0;
	for (var i = 0; i < data.length; i++) {
		bin_xval += data[i].x;
		bin_yval += data[i].y;
		bin_index++;
		if(bin_index === binsize){
			out.push( {x:bin_xval/bin_index, y:bin_yval/bin_index} );
			bin_index = bin_xval = bin_yval = 0;
		}
	}
	if(bin_index > 0){
		out.push( {x:bin_xval/bin_index, y:bin_yval/bin_index} );
	}
	return out;
}

module.exports = function (spec_line, binsize) {
	var x_extent = Math.abs( spec_line.range().x[0] - spec_line.range().x[1] );
	var nbins = x_extent / binsize;
	var bin_points = Math.floor( spec_line.datum().length / nbins );
	
	var binned_data = bin(spec_line.datum(), bin_points);
	console.log(binned_data);
	spec_line.datum(binned_data);
};