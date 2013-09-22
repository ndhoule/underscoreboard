/*global Underscoreboard, setTimeout, clearTimeout, document, window, console*/

require.config({
  paths: {
    // Third-party libraries
    ace: '../bower_components/ace/lib/ace',
    backbone: '../bower_components/backbone/backbone',
    bootstrapAffix: '../bower_components/sass-bootstrap/js/affix',
    bootstrapAlert: '../bower_components/sass-bootstrap/js/alert',
    bootstrapButton: '../bower_components/sass-bootstrap/js/button',
    bootstrapCarousel: '../bower_components/sass-bootstrap/js/carousel',
    bootstrapCollapse: '../bower_components/sass-bootstrap/js/collapse',
    bootstrapDropdown: '../bower_components/sass-bootstrap/js/dropdown',
    bootstrapModal: '../bower_components/sass-bootstrap/js/modal',
    bootstrapPopover: '../bower_components/sass-bootstrap/js/popover',
    bootstrapScrollspy: '../bower_components/sass-bootstrap/js/scrollspy',
    bootstrapTab: '../bower_components/sass-bootstrap/js/tab',
    bootstrapTooltip: '../bower_components/sass-bootstrap/js/tooltip',
    bootstrapTransition: '../bower_components/sass-bootstrap/js/transition',
    domReady: '../bower_components/requirejs-domReady/domReady',
    jquery: '../bower_components/jquery/jquery',
    sockjs: '//cdnjs.cloudflare.com/ajax/libs/sockjs-client/0.3.4/sockjs.min',
    underscore: '../bower_components/lodash/dist/lodash.underscore',
    underscoreString: '../bower_components/underscore.string/dist/underscore.string.min',

    hbs: '../bower_components/require-handlebars-plugin/hbs',
    json2: '../bower_components/require-handlebars-plugin/hbs/json2',
    i18nprecompile: '../bower_components/require-handlebars-plugin/hbs/i18nprecompile',
    handlebars: '../bower_components/require-handlebars-plugin/Handlebars',

    // User libraries
    underscoreUtils: 'lib/underscore.utils',

    // Event aggregator
    vent: 'vent',

    // Views
    editorView: 'views/editorView',
    modalView: 'views/modalView',
    navbar: 'views/navbar',
    testRunnerView: 'views/testRunnerView',

    // Models
    appModel: 'models/appModel',
    editor: 'models/editor',

    // Collections
    editors: 'collections/editors'
  },

  hbs: {
    disableI18n: true
  },

  shim: {
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    bootstrapAffix: {
      deps: ['jquery']
    },
    bootstrapAlert: {
      deps: ['jquery']
    },
    bootstrapButton: {
      deps: ['jquery']
    },
    bootstrapCarousel: {
      deps: ['jquery']
    },
    bootstrapCollapse: {
      deps: ['jquery']
    },
    bootstrapDropdown: {
      deps: ['jquery']
    },
    bootstrapModal: {
      deps: ['jquery', 'bootstrapTransition']
    },
    bootstrapPopover: {
      deps: ['jquery']
    },
    bootstrapScrollspy: {
      deps: ['jquery']
    },
    bootstrapTab: {
      deps: ['jquery']
    },
    bootstrapTooltip: {
      deps: ['jquery']
    },
    bootstrapTransition: {
      deps: ['jquery']
    },
    underscoreUtils: {
      deps: ['underscore']
    }
  }
});


require([
  'domReady',
  'underscore',
  'appModel',
  'editor',
  'editors',
  'editorView',
  'testRunnerView',
  'modalView',
  'navbar'
], function(domReady, _, AppModel, Editor, Editors, EditorView, TestRunnerView, ModalView, Navbar) {
  'use strict';

  window.Underscoreboard = (window.Underscoreboard || Object.create(null));

  domReady(function() {
    var App = window.Underscoreboard.App = new AppModel();

    App.modalView = new ModalView();

    App.editors = new Editors([
      new Editor({ player: 'player' }),
      new Editor({ player: 'opponent' })
    ]);

    App.playerView = new EditorView({
      model: App.editors.findWhere({ player: 'player' }),
      el: _.first(document.getElementsByClassName('editor-player'))
    });

    App.opponentView = new EditorView({
      model: App.editors.findWhere({ player: 'opponent' }),
      el: _.first(document.getElementsByClassName('editor-opponent'))
    });

    App.testRunnerView = new TestRunnerView({
      el: _.first(document.getElementsByClassName('test-runner'))
    });

    App.navbar = new Navbar({
      el: _.first(document.getElementsByClassName('nav'))
    });
  });
});
