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

      jade   : ['server/views/**/*.jade'],
      style  : ['app/sass/style.scss', 'app/sass/_main.scss'],
      src : {
        app    : ['app/js/**/*.js', '!app/js/lib/**'],
        server : ['server/**/*.js', '!server/**/lib/**'],
        // TODO: Fix the ignore here. This ends up scanning the lib directory
        // no matter what. I suspect it's an upstream bug as I'm following the
        // docs, but who knows...
        client : ['client/js/**/*.js', '!client/js/lib/**', '!client/js/main.js'],
      }
    },
    compass: {
      options: {
        require        : 'bootstrap-sass',
        sassDir        : 'app/sass',
        cssDir         : 'client/css',
        relativeAssets : true,
        imagesDir      : 'client/img',
        javascriptsDir : 'client/js'
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
        config: 'test/buster.js'
      }
    },
    requirejs: {
      options: {
        baseUrl: 'app/js',
        name: 'main',
        out: 'client/js/main.min.js',
        paths: {
          jquery       : 'lib/require-jquery',
          ace          : '../../client/js/lib/ace',
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
          "index.html": ['server/views/index.jade']
        }
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        '<%= meta.src.app %>',
        '<%= meta.src.server %>',
        '<%= meta.src.client %>'
      ],
      dist: 'client/js/main.js',
      options: {
        jshintrc: '.jshintrc'
      }
    },
    watch: {
      client: {
        files: '<%= meta.src.client %>',
        tasks: ['jshint']
      },
      server: {
        files: '<%= meta.src.server %>',
        tasks: ['jshint']
      },
      app: {
        files: '<%= meta.src.app %>',
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
