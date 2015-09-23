module.exports = function (app) {
	app.append('div').classed('logo', true)
		.text('SpecdrawJS')
		.on('click', function () {
			app.modals().proto('SpecdrawJS', 
			'A javascript library for interactive processing and visualization of NMR spectra.'+
			'<br> Author: Ahmed Mohamed'+
			'<br> For bug reports, go to <a href="https://github.com/ahmohamed/specdraw.js/issues" target="_blank"> Github Repository </a>',
			function (modal) {
				modal.hide();
			}).show();
		});
};