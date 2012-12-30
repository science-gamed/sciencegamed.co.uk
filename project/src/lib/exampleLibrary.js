// This is an example library, included to demonstrate how modules
// can include code from other files (see js/app.js)

define( [], function () {
	
	'use strict';

	return {
		helloworld: function () {
			console.log( 'This is an example library! w00t!' );
			return true;
		}
	};

});