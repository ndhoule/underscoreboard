require(['./requirejs-config'], function() {
  'use strict';

  require([
    'backbone',
    'underscore',
    'domReady',
    'app',
    'vent',
    'editor',
    'editors',
    'editorView',
    'testRunnerView',
    'navbarView',
    'scripts/views/welcomeModal'
  ], function(Backbone, _, domReady, App, vent, Editor, Editors, EditorView, TestRunnerView, NavbarView, ModalView) {
    window.Underscoreboard = new App();

    Underscoreboard.vent = vent;

    Underscoreboard.models.editors = new Editors([
      new Editor({ player: 'player' }),
      new Editor({ player: 'opponent' })
    ]);

    domReady(function() {
      Underscoreboard.views.modal = new ModalView({
        closeButton: false,
        keyboard: false,
        backdrop: 'static',
        fade: true,
        show: false,
        model: new Backbone.Model({
          title: 'DAT MODAL.',
          body: 'DAT BODY.'
        })
      });

      Underscoreboard.views.player = new EditorView({
        model: Underscoreboard.models.editors.findWhere({ player: 'player' }),
        el: _.first(document.getElementsByClassName('editor-player'))
      });

      Underscoreboard.views.opponent = new EditorView({
        model: Underscoreboard.models.editors.findWhere({ player: 'opponent' }),
        el: _.first(document.getElementsByClassName('editor-opponent'))
      });

      Underscoreboard.views.testRunner = new TestRunnerView({
        el: _.first(document.getElementsByClassName('test-runner'))
      });

      Underscoreboard.views.navbar = new NavbarView({
        el: _.first(document.getElementsByClassName('nav'))
      });

      vent.trigger('ready');
    });
  });
});
