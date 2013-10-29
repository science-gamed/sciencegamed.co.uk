/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({

		// Main watch task. Kick this off by entering `grunt watch`. Now, any time you change the files below,
		// the relevant tasks will execute
		watch: {
			sass: {
				files: 'project/styles/*.scss',
				tasks: 'sass',
				interrupt: true
			},

			content: {
				files: 'project/content/**/*',
				tasks: 'parse',
				interrupt: true
			},

			data: {
				files: 'project/data/**/*',
				tasks: [ 'dir2json', 'generate:partials', 'generate:pages' ],
				interrupt: true
			}
		},

		clean: {
			tmp: [ 'tmp' ],
			generated: [ 'generated' ],

			ghpages: [ '../gh-pages', '!../.git' ]
		},


		// Compile .scss files
		sass: {
			options: {
				style: 'compressed'
			},
			dev: {
				files: {
					'generated/min.css': 'project/styles/*.scss'
				},
				options: {
					debugInfo: true
				}
			}
		},


		// Copy the files we need from the src folder...
		copy: {
			// ...to generated
			rootToGenerated: {
				files: [{
					expand: true,
					cwd: 'project/root',
					src: ['**'],
					dest: 'generated'
				}]
			},

			// ...to gh-pages sibling
			generatedToPages: {
				files: [{
					expand: true,
					cwd: 'generated',
					src: ['**'],
					dest: '../gh-pages'
				}]
			}
		},

		// Parse markdown content into JSON
		parse: {
			blog: {
				files: {
					'project/data/content/blogposts.json': 'project/content/blogposts/**/*.md'
				},
				cwd: 'project/content/blogposts/',
				parser: require( 'post-to-json' )
			},

			articles: {
				files: {
					'project/data/content/articles.json': 'project/content/articles/**/*.md'
				},
				cwd: 'project/content/articles/',
				parser: require( 'post-to-json' )
			},

			misc: {
				files: {
					'project/data/content/misc.json': 'project/content/misc/**/*.md'
				},
				cwd: 'project/content/misc/',
				parser: require( 'post-to-json' )
			}
		},

		// Combine contents of `project/data` into a single `data.json` file
		dir2json: {
			data: {
				root: 'project/data/',
				dest: 'tmp/data.json'
			}
		},

		generate: {
			options: {
				data: 'tmp/data.json'
			},
			partials: {
				files: [
					{
						cwd: 'project/partial-generators/',
						src: '**/*.js',
						dest: 'project/data/partials/'
					}
				]
			},
			pages: {
				files: [
					{
						cwd: 'project/page-generators/',
						src: '**/*.js',
						dest: 'generated/'
					}
				]
			}
		},

		connect: {
			server: {
				options: {
					port: 1234,
					base: 'generated',
					keepalive: true
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-clean');


	grunt.loadNpmTasks('grunt-dir2json');

	grunt.loadNpmTasks('grunt-sg-parse');
	grunt.loadNpmTasks('grunt-sg-generate');

	grunt.registerTask( 'build', [ 'default', 'copy:generatedToPages' ] );

	// Default task.
	grunt.registerTask( 'default', [
		'clean:tmp',
		'clean:generated',
		'sass',
		'parse',
		'dir2json',
		'generate:partials',
		'generate:pages',
		'copy:rootToGenerated'
	]);

};
