/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		
		// Main watch task. Kick this off by entering `grunt watch`. Now, any time you change the files below,
		// the relevant tasks will execute
		watch: {
			sass: {
				files: 'project/sass-styles/*.scss',
				tasks: 'shell:sassupdate',
				interrupt: true
			},
			css: {
				files: 'project/css-temp/*',
				tasks: 'mincss',
				interrupt: true
			}
		},

		// Compile .scss files
		shell: {
			sassupdate: {
				command: 'rm -r project/css-temp/*; sass --update -f --debug-info project/sass-styles:project/css-temp'
			}
		},
		
		// Concatenate all the files in project/css-temp and minify as project/src/min.css
		mincss: {
			compress: {
				files: {
					'project/src/min.css': 'project/css-temp/*.css'
				}
			}
		},

		// Copy the files we need from the src folder to appfog/public
		copy: {
			src: {
				files: {
					'appfog/public/': [ 'project/src/*.html', 'project/src/min.css', 'project/src/assets/**' ]
				},
				options: {
					basePath: 'project/src'
				}
			}
		},

		open: {
			root: 'project/src'
		}

	});

	grunt.loadNpmTasks('grunt-contrib-mincss');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-shell');

	grunt.loadNpmTasks('gui-open');

	grunt.registerTask( 'optim', [ 'shell:imageOptim' ] );
	
	grunt.registerTask( 'build', [ 'default', 'copy' ] );

	// Default task.
	grunt.registerTask( 'default', [ 'shell:sassupdate', 'mincss' ] );

};
