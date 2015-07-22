/*global jQuery */
(function(factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'jqueryui/autocomplete'], function() {
      var module = factory.apply(this, arguments);
      return module;
    });
  }
  else {
    return jQuery && factory.call(this, jQuery);
  }
}(function($) {
  'use strict';

  function retFalse() { return false; }

  return $.widget('be.autosuggest', $.ui.autocomplete, {

    options: {
      focus: retFalse,
      noMatchTemplate: null,
      hasMatch: function(items) {
        var term = this.term.toLowerCase();

        return items.some(function(value) {
          return term === String(value.label || value.value || value).toLowerCase();
        });
      },
      prepend: false
    },

    _noMatch: function(ul, items) {
      var templater = this.options.noMatchTemplate,
          prepend = this.options.prepend;

      if ($.isFunction(templater)) {
        $(templater({
          term: this.term,
          items: items
        }))
        [prepend ? 'prependTo' : 'appendTo'](this.menu.element)
        .on('mouseover', function() {
          $(this).parent().find('.ui-state-focus').removeClass('ui-state-focus');
        });
      }
    },

    _hasNoMatch: function(content) {
      return this.options.noMatchTemplate && !this.options.hasMatch.call(this, content);
    },

    __response: function(content) {
      // by default, an autocomplete will not show a menu if there is no content
      // however, if a noMatchtemplate is provided, no content still needs to
      // show that item, so force the showing of the menu
      if (this._hasNoMatch(content) && (!content || !content.length) && !this.options.disabled && !this.cancelSearch) {
        content = [];
        this._trigger('response', null, { content: content });
        this._suggest(content);
        this._trigger('open');
      }
      else {
        this._super(content);
      }
    },

    _suggest: function(items) {
      this._super(items);
      if (this._hasNoMatch(items)) {
        this._noMatch(items);
      }
    },

    _create: function() {
      this._super();
      if (this.options.messages && this.options.messages.placeholder) {
        this.element.prop('placeholder', this.options.messages.placeholder);
      }
    },

    _resizeMenu: function() {
      var ul = this.menu.element,
      width = this.options.width;

      if ($.isNumeric(width)) {
        ul.outerWidth(width);
      }
      else {
        this._super();
      }
    },

    _renderItem: function(ul, item) {
      var templater = this.options.itemTemplate;
      if ($.isFunction(templater)) {
        return $(templater(item)).appendTo(ul);
      }

      return this._super(ul, item);
    },

    clear: function() {
      this._value('');
    }

  });
}));
