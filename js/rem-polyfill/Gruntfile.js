(function() {
  'use strict';
  module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      gruntfile: 'Gruntfile.coffee',
      banner: '/**\n' + ' * Module: <%= pkg.name %> - v<%= pkg.version %>\n' + ' * Description: <%= pkg.description %>\n' + ' * Date Built: <%= grunt.template.today("yyyy-mm-dd") %>\n' + ' * Copyright (c) <%= grunt.template.today("yyyy") %>' + '  | <%= pkg.authors %>;\n' + '**/\n',
      clean: ['js/<%= pkg.name %>.min.js'],
      jshint: {
        options: {
          jshintrc: '.jshintrc'
        },
        basic: {
          src: ['js/<%= pkg.name %>.js']
        }
      },
      uglify: {
        options: {
          banner: '<%= banner %>'
        },
        minify: {
          files: {
            'js/<%= pkg.name %>.min.js': 'js/<%= pkg.name %>.js'
          }
        }
      }
    });
    return grunt.registerTask('default', ['clean', 'jshint', 'uglify']);
  };

}).call(this);

