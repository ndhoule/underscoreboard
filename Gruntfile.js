module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    meta : {
      pkg : grunt.file.readJSON('package.json'),
      src : {
        assets : ['assets/js/**/*.js', '!assets/js/lib/**'],
        app    : ['app/**/*.js', '!app/public/**'],
        public : ['app/public/js/**/*.js', '!app/public/js/lib/**', '!app/public/js/main.min.js'],
      }
    },
    compass: {
      options: {
        require        : 'bootstrap-sass',
        sassDir        : 'assets/sass',
        cssDir         : 'app/public/css',
        relativeAssets : true,
        imagesDir      : 'app/public/img',
        javascriptsDir : 'app/public/js'
      },
      dev: {
        options: {
          environment: 'development'
        }
      },
      dist: {
        options: {
          environment    : 'production',
          outputStyle    : 'compressed',
          noLineComments : true,
          force          : true
        }
      }
    },
    buster: {
      test: {
        config: 'spec/buster.js'
      }
    },
    requirejs: {
      options: {
        baseUrl: 'assets/js',
        name: 'main',
        out: 'app/public/js/main.min.js',
        paths: {
          jquery       : 'lib/require-jquery',
          ace          : '../../app/public/js/lib/ace',
          domReady     : 'lib/domReady',
          bootstrap    : 'lib/bootstrap.min',
          backbone     : 'lib/backbone-amd-0.9.10-min',
          underscore   : 'lib/underscore.min',

          // Views
          editorView  : 'views/editorView'
        },
        shim: {
          'bootstrap' : ['jquery'],
          'underscore': {
            exports: '_'
          }
        },
      },
      dev: {
        options: {
          optimize: 'none'
        }
      },
      dist: {
        options: {
          optimize: 'uglify2',
          mangle: true,
          preserveLicenseComments: false
        }
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        '<%= meta.src.assets %>',
        '<%= meta.src.app %>',
        '<%= meta.src.public %>'
      ],
      dist: 'app/public/js/main.js',
      options: {
        jshintrc: '.jshintrc'
      }
    },
    watch: {
      dev: {
        files: '<%= meta.src.assets %>',
        tasks: ['requirejs:dev', 'compass:dev']
      },
      dist: {
        files: '<%= meta.src.assets %>',
        tasks: ['requirejs:dist', 'compass:dist']
      }
    }
  });

  // Load third-party modules
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-buster');

  // Define tasks
  grunt.registerTask('dev', ['compass', 'requirejs:dev']);
  grunt.registerTask('test', ['jshint:all', 'buster:test']);
  grunt.registerTask('dist', ['compass:dist', 'requirejs:dist', 'jshint:dist']);
  grunt.registerTask('precommit', ['jshint:dist', 'buster:test']);

  // Define default task
  grunt.registerTask('default', ['test']);
};
