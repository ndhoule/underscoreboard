module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    meta : {
      pkg    : grunt.file.readJSON('package.json'),
      banner : '/*! <%= meta.pkg.title || meta.pkg.name %> - v<%= meta.pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= meta.pkg.homepage ? "* " + meta.pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= meta.pkg.author.name %>;' +
        ' Licensed <%= _.pluck(meta.pkg.licenses, "type").join(", ") %> */\n',
      // Include all files except those in a 'lib' directory
      src    : ['client/**/*.js', 'server/**/*.js', '!**/lib/**'],
      jade   : ['server/views/**/*.jade'],
      style  : ['client/sass/style.scss', 'client/sass/_main.scss']
    },
    compass: {
      options: {
        require        : 'bootstrap-sass',
        sassDir        : 'client/sass',
        cssDir         : 'client/css',
        imagesDir      : 'client/img',
        javascriptsDir : 'client/js'
      },
      dev: {
        environment: 'development'
      },
      dist: {
        environment: 'production'
      }
    },
    jade: {
      dist: {
        options: {
          data: {
            debug: false,
            title: '<%= meta.pkg.title || meta.pkg.name %>'
          }
        },
        files: {
          "index.html": ['server/views/index.jade']
        }
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        '<%= meta.src %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    watch: {
      scripts: {
        files: '<%= meta.src %>',
        tasks: ['jshint']
      },
      compass: {
        files: '<%= meta.style %>',
        tasks: ['compass:dev'],
        options: {
          interrupt: true
        }
      }
    }
  });

  // Load third-party modules
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Define tasks
  grunt.registerTask('dev', ['compass', 'jshint']);
  grunt.registerTask('dist', ['compass:dist', 'jade:dist', 'jshint']);

  // Define default task
  grunt.registerTask('default', ['test']);
};
