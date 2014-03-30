define([
  'backbone',
  'editor'
], function(Backbone, editor) {
  return Backbone.Collection.extend({
    model: editor
  });
});
