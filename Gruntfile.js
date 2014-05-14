
module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        banner: '/*!\n' +
                ' * <%= pkg.name %>\n' +
                ' * <%= pkg.description %>\n'+
                ' * <%= pkg.author %>\n'+
                ' */\n\n',

        copy:{

            extension:{
                files:[{
                    src:[
                        '*.png',
                        'manifest.json'
                    ],
                    dest: 'dist',
                    expand: true,
                    flatten: true,
                    filter: 'isFile'
                }]
            }
        },

        clean: {
            build: ['dist/*']
        },

        concat:{
             app:{
                separator:"\n",
                src:[
                    'jquery.js',
                    'background.js'
                ],
                dest:'dist/background.js'
            }
        },

        uglify:{
            options: {
                banner: '<%= banner %>',
                mangle: true,
                compress: true
            },
            extension:{
                files:{
                    'dist/background.js':'dist/background.js'
                }
            }
        },

        watch: {
            scripts:{
                files: 'background.js',
                tasks: ['clean', 'copy','jshint','concat:app','uglify']
            }
        },

        jshint: {
            all: ['background.js']
        }
    });

    grunt.registerTask('default',['watch']);
    grunt.registerTask('build', ['clean','copy','jshint','concat','uglify'] );
};