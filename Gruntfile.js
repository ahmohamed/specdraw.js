module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            dist: {
                src: [
									'src/start.js','src/d1/d1.js', 'src/d1/integrate.js','src/d1/line.js','src/d1/pp.js','src/d1/main_focus.js','src/d2/d2.js','src/d2/crosshair_2d.js','src/d2/main_focus.js','src/d2/spec2d.js','src/main_app.js','src/slide.js','src/slideChanger.js','src/pro/read_menu.js','src/pro/output.js','src/pro/plugins.js','src/end.js'
								],
                dest: "<%= pkg.name %>.js"
            }
        },
        browserify: {
            dist: {
                files: {
                    "<%= pkg.name %>.js": ["<%= pkg.name %>.js",
										'src/pro/ajax.js',
										'src/modals.js',
										'src/elem.js',
										'src/menu.js',
										'src/events.js',
										'src/utils.js',
										'src/pro/worker.js',
										'src/pro/process_data.js',
										'src/d1/crosshair.js',
										'src/d1/main-brush.js',
										'src/d1/scale-brush.js',
										'src/d1/threshold.js',
										]
                }
            }
        },
        uglify: {
            options: {
                mangle: true
            },
            my_target: {
                files: {
                    "<%= pkg.name %>.min.js": ["<%= pkg.name %>.js"]
                }
            }
        },
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
		grunt.loadNpmTasks("grunt-browserify");

    grunt.registerTask("dev", ["concat", "browserify"]);
    grunt.registerTask("default", ["dev", "uglify"]);
};
