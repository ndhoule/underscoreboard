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
      style  : ['client/sass/style.scss', 'client/sass/_main.scss']
    },
    jshint: {
      all: [
        'Gruntfile.js',
        '<%= meta.src %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    }
  });

  // Load third-party modules
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Define tasks
  grunt.registerTask('test', ['jshint']);

  // Define default task
  grunt.registerTask('default', ['test']);
};
