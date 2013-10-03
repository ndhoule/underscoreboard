'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: {
      grunt: 'Gruntfile.js',
      assets: 'assets',
      vendor: '<%= config.assets %>/vendor',
      server: ['index.js', 'lib/**/*.js', 'config/**/*.js', 'routes/**/*.js'],
      test: {
        server: 'test/server',
        client: 'test/client'
      },
      public: '.tmp/public'
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'test/server/config'
        },
        src: ['<%= config.test.server %>/**/*Spec.js']
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        '<%= config.grunt %>',
        '<%= config.assets %>/scripts/**/*.js',
        '<%= config.test.client %>/**/*Spec.js',
        '!<%= config.assets %>/scripts/lib/*',
        '!<%= config.assets %>/scripts/test_runner/lib/*',
        '!<%= config.assets %>/vendor/*',
      ]
    },

    mkdir: {
      dev: {
        options: {
          create: [
            '<%= config.public %>',
            '<%= config.public %>/images',
            '<%= config.public %>/scripts',
            '<%= config.public %>/styles',
            '<%= config.public %>/vendor'
          ]
        }
      },
      dist: {
        options: {
          create: [
            '<%= config.public %>',
            '<%= config.public %>/images',
            '<%= config.public %>/scripts',
            '<%= config.public %>/styles'
          ]
        }
      }
    },

    copy: {
      dev: {
        files: [
          {
            expand: true,
            cwd: '<%= config.assets %>/',
            src: '**',
            dest: '<%= config.public %>/'
          }
        ]
      },
      dist: {
        files: [
          {
            expand: true,
            flatten: true,
            src: '<%= config.assets %>/vendor/requirejs/require.js',
            dest: '<%= config.public %>/vendor/requirejs'
          },
          {
            expand: true,
            flatten: true,
            src: '<%= config.assets %>/favicon.ico',
            dest: '<%= config.public %>'
          },
          {
            expand: true,
            flatten: true,
            src: '<%= config.assets %>/images/**/*',
            dest: '<%= config.public %>/images'
          }
        ]
      }
    },

    clean: {
      dev: ['<%= config.public %>'],
      dist: ['<%= config.public %>']
    },

    // TODO
    //imagemin: {
    //  dist: {
    //    files: [
    //      {
    //        expand: true,
    //        src: ['<%= config.public %>/images/**/*.{png,jpg,gif}'],
    //        dest: '.'
    //      }
    //    ]
    //  }
    //},

    requirejs: {
      // https://github.com/jrburke/r.js/blob/master/build/example.build.js
      options: {
        baseUrl: '<%= config.assets %>',
        findNestedDependencies: true,
        mainConfigFile: '<%= config.assets %>/scripts/requirejs-config.js',
        name: 'scripts/main',
        out: '<%= config.public %>/scripts/main.js'
      },
      dev: {
        options: {
          optimize: 'none',
          preserveLicenseComments: true
        }
      },
      dist: {
        options: {
          optimize: 'uglify2',
          out: '<%= config.public %>/scripts/main.js',
          preserveLicenseComments: false,
          uglify2: {
            output: {
              beautify: false
            },
            compress: {
              sequences: true
            }
          }
        }
      }
    },

    // TODO
    //htmlbuild: {},

    sass: {
      options: {
        includePaths: ['<%= config.assets %>/vendor/sass-bootstrap/lib']
      },
      dev: {
        options: {
          sourceComments: 'map'
        },
        files: {
          '<%= config.public %>/styles/main.css': '<%= config.assets %>/styles/main.scss'
        }
      },
      dist: {
        options: {
          sourceComments: 'none'
        },
        files: {
          '<%= config.public %>/styles/main.css': '<%= config.assets %>/styles/main.scss'
        }
      }
    },

    cssmin: {
      dist: {
        files: {
          '<%= config.public %>/styles/main.css': '<%= config.public %>/styles/main.css'
        }
      }
    },

    watch: {
      // TODO
      //test: {},
      dev: {
        files: [
          '<%= config.assets %>/**/*',
          '!<%= config.assets %>/vendor/**/*'
        ],
        tasks: ['build']
      }
    },
  });

  grunt.registerTask('build', function(target) {
    if (target === 'dist') {
      return grunt.task.run([
        'clean:dist',
        'mkdir:dist',
        'requirejs:dist',
        'sass:dist',
        'cssmin:dist',
        'copy:dist'
        // TODO
        //'imagemin:dist'
      ]);
    }

    grunt.task.run([
      'clean:dev',
      'mkdir:dev',
      'sass:dev',
      'copy:dev'
    ]);
  });

  grunt.registerTask('test', [
    'jshint',
    'mochaTest:test'
  ]);

  grunt.registerTask('precommit', 'test');

  grunt.registerTask('default', 'build');
};
