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
      src    : ['server/app.js', 'server/routes/**/*', 'client/js/main.js', 'client/js/createEditor.js', 'client/mocha/SpecHelper.js', 'client/mocha/spec/**/*'],
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
