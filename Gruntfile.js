/*
 * videojs-hlsjs-source-handler
 * https://github.com/Hyddan/videojs-hlsjs-source-handler
 *
 * Copyright (c) 2016 Daniel Hedenius
 * Licensed under the WTFPL-2.0 license.
 */

'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: {
            options: {
                force: true
            },
            lib: [
                'lib/**/*'
            ]
        },
        copy: {
            src: {
                files: [{
                    cwd: 'src/',
                    dest: 'lib/',
                    expand: true,
                    src: ['**/*']
                }]
            }
        }
    });

    grunt.registerTask('compile', ['clean:lib', 'copy:src']);
    grunt.registerTask('default', ['compile']);
};