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

      jade   : ['app/views/**/*.jade'],
      style  : ['assets/sass/style.scss', 'assets/sass/_main.scss'],
      src : {
        assets : ['assets/js/**/*.js', '!assets/js/lib/**'],
        app : ['app/**/*.js', '!app/**/lib/**'],
        // TODO: Fix the ignore here. This ends up scanning the lib directory
        // no matter what. I suspect it's an upstream bug as I'm following the
        // docs, but who knows...
        public : ['app/public/js/**/*.js', '!app/public/js/lib/**', '!app/public/js/main.js'],
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
          createEditor : 'createEditor',
          io           : '../../node_modules/socket.io/node_modules/socket.io-client/dist/socket.io'
        }
      },
      dev: {
        options: {
          optimize: 'none',
        }
      },
      dist: {
        options: {
          optimize: 'uglify2',
        }
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
          "index.html": ['app/views/index.jade']
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
      public: {
        files: '<%= meta.src.public %>',
        tasks: ['jshint']
      },
      app: {
        files: '<%= meta.src.app %>',
        tasks: ['jshint']
      },
      assets: {
        files: '<%= meta.src.assets %>',
        tasks: ['requirejs:dev']
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
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-buster');

  // Define tasks
  grunt.registerTask('dev', ['compass', 'jshint:all']);
  grunt.registerTask('dist', ['compass:dist', 'requirejs:dist', 'jshint:dist']);

  // Define default task
  grunt.registerTask('default', ['test']);
};
