module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    meta: {
      pkg: grunt.file.readJSON('package.json'),
      src: {
        assets: ['assets/js/**/*.js', '!assets/js/lib/**'],
        app: ['app/**/*.js', '!app/public/**'],
        public: ['app/public/js/**/*.js', '!app/public/js/lib/**', '!app/public/js/main.min.js']
      }
    },

    compass: {
      options: {
        require: 'bootstrap-sass',
        sassDir: 'assets/sass',
        cssDir: 'app/public/css',
        relativeAssets: true,
        imagesDir: 'app/public/img',
        javascriptsDir: 'app/public/js'
      },
      dev: {
        options: {
          environment: 'development'
        }
      },
      dist: {
        options: {
          environment: 'production',
          outputStyle: 'compressed',
          noLineComments: true,
          force: true
        }
      }
    },

    karma: {
      continuous: {
        configFile: 'karma.conf.js',
        singleRun: true,
        reporters: ['progress', 'growl'],
        browsers: ['PhantomJS']
      }
    },

    requirejs: {
      options: {
        baseUrl: 'assets/js',
        name: 'main',
        out: 'app/public/js/main.min.js',
        paths: {
          ace: '../../app/public/js/lib/ace',
          backbone: 'lib/backbone-amd-0.9.10-min',
          bootstrap: 'lib/bootstrap.min',
          domReady: 'lib/domReady',
          jquery: 'lib/require-jquery',
          sockjs: 'lib/sockjs-0.3.min',
          underscore: 'lib/underscore.min',

          // Views
          editorView: 'views/editorView'
        },
        shim: {
          'bootstrap': ['jquery'],
          'underscore': {
            exports: '_'
          }
        }
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
      options: {
        jshintrc: '.jshintrc'
      }
    },

    watch: {
    }
  });

  // Load third-party modules
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');

  // Tasks
  grunt.registerTask('dev', ['compass:dev', 'requirejs:dev']);
  grunt.registerTask('test', ['jshint:all', 'karma:continuous']);
  grunt.registerTask('dist', ['compass:dist', 'requirejs:dist', 'jshint:all']);

  // Runs just before a commit. Don't put tasks that generate files here as
  // they won't be included in your commit.
  grunt.registerTask('precommit', ['jshint:all', 'karma:continuous']);

  // Default task (runs when running `grunt` without arguments)
  grunt.registerTask('default', ['test']);
};
