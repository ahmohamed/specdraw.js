function modal_input(app, node, callback) {
	var modals = 	app.modals();
	var nano = modals.proto(undefined, '',
		function(modal) {
			modal.hide();
	    var input = d3.select(modal.modal.el)
				.select("input").node().value;
			callback(input);
	  });
	
	var el = d3.select(nano.modal.el).select(".nanoModalContent");
	el.append(node);
	return nano.show;
}

module.exports = function (app, callback) {
	return function () {
		callback = callback || app.currentSlide().addSpec;
		modal_input ( app,
			require('../input_elem').text('File URL', 'http://'),
			function (input) {
				require('./process_data').get_spectrum(input,	callback);
			}
		)();
	};
	
};