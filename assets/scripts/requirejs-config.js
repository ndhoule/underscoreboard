require.config({
  baseUrl: '/',

  paths: {
    // Third-party libraries
    ace: 'vendor/ace/lib/ace',
    alertify: 'vendor/alertify/alertify',
    backbone: 'vendor/backbone/backbone',
    'backbone.statemachine': 'vendor/backbone.statemachine/backbone.statemachine',
    bootstrapAffix: 'vendor/sass-bootstrap/js/affix',
    bootstrapAlert: 'vendor/sass-bootstrap/js/alert',
    bootstrapButton: 'vendor/sass-bootstrap/js/button',
    bootstrapCarousel: 'vendor/sass-bootstrap/js/carousel',
    bootstrapCollapse: 'vendor/sass-bootstrap/js/collapse',
    bootstrapDropdown: 'vendor/sass-bootstrap/js/dropdown',
    bootstrapModal: 'vendor/sass-bootstrap/js/modal',
    bootstrapPopover: 'vendor/sass-bootstrap/js/popover',
    bootstrapScrollspy: 'vendor/sass-bootstrap/js/scrollspy',
    bootstrapTab: 'vendor/sass-bootstrap/js/tab',
    bootstrapTooltip: 'vendor/sass-bootstrap/js/tooltip',
    bootstrapTransition: 'vendor/sass-bootstrap/js/transition',
    domReady: 'vendor/requirejs-domready/domReady',
    jquery: 'vendor/jquery/dist/jquery',
    // TODO: Replace with bower package
    sockjs: '//cdnjs.cloudflare.com/ajax/libs/sockjs-client/0.3.4/sockjs.min',
    underscore: 'vendor/underscore/underscore',
    underscoreString: 'vendor/underscore.string/dist/underscore.string.min',

    handlebars: 'vendor/require-handlebars-plugin/Handlebars',
    hbs: 'vendor/require-handlebars-plugin/hbs',
    i18nprecompile: 'vendor/require-handlebars-plugin/hbs/i18nprecompile',
    json2: 'vendor/require-handlebars-plugin/hbs/json2',

    // Main application
    app: 'scripts/app',

    // Event aggregator
    vent: 'scripts/vent',

    // Models
    editor: 'scripts/models/editor',

    // Collections
    editors: 'scripts/collections/editors',

    // Views
    editorView: 'scripts/views/editorView',
    modalView: 'scripts/views/modalView',
    navbarView: 'scripts/views/navbarView',
    testRunnerView: 'scripts/views/testRunnerView'
  },

  hbs: {
    disableI18n: true
  },

  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    'backbone.statemachine': ['backbone'],
    bootstrapAffix: ['jquery'],
    bootstrapAlert: ['jquery'],
    bootstrapButton: ['jquery'],
    bootstrapCarousel: ['jquery'],
    bootstrapCollapse: ['jquery'],
    bootstrapDropdown: ['jquery'],
    bootstrapModal: ['jquery', 'bootstrapTransition'],
    bootstrapPopover: ['jquery'],
    bootstrapScrollspy: ['jquery'],
    bootstrapTab: ['jquery'],
    bootstrapTooltip: ['jquery'],
    bootstrapTransition: ['jquery']
  }
});
