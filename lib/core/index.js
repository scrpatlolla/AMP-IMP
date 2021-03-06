'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _ReactInjection = require('react-dom/lib/ReactInjection');

var _noImportant = require('aphrodite/no-important');

var _html = require('html');

var _ampvalidator = require('../utils/ampvalidator');

var _Tags = require('./Tags');

var _Tags2 = _interopRequireDefault(_Tags);

var _Template = require('../components/Template');

var _Template2 = _interopRequireDefault(_Template);

var _defaults = require('./defaults');

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('rampt:core');

var DOMInjected = false;
/**
 * A class that manages ReactDOMServer & ModularCSS to
 * transpile ReactElements into a single valid AMP HTML document.
 * @param {Object} options - its defaults is a set of DOMProperty needed to
 * prevent React in ignore AMP's attrs and custom-elements.
 * @export
 * @constructor
 */

var Core = function () {
  function Core(options) {
    _classCallCheck(this, Core);

    this.settings = _extends({}, _defaults2.default, options, {
      template: _extends({}, _defaults2.default.template, options.template),
      DOMPropertyConfig: _extends({}, _defaults2.default.DOMPropertyConfig, options.DOMPropertyConfig)
    });
    debug('RAMPT settings: ', JSON.stringify(this.settings));
    if (!DOMInjected) {
      debug('Injecting AMP DOMProperties.');
      _ReactInjection.DOMProperty.injectDOMPropertyConfig(this.settings.DOMPropertyConfig);
      DOMInjected = true;
    } else {
      debug('Custom DOMProperties were injected already');
    }

    this.tags = new _Tags2.default(this.settings.tags);
    this.renderStatic = this.renderStatic.bind(this);
    this.renderToFile = this.renderToFile.bind(this);
  }

  /**
   * Aphrodite's css server-side rendering
   * 'https://github.com/Khan/aphrodite'
   * @param {ReactElement} component
   * @returns {Object} - { css, html }
   */


  _createClass(Core, [{
    key: 'aphrodite',
    value: function aphrodite(component) {
      debug('Running aphrodite.');
      return _noImportant.StyleSheetServer.renderStatic(function () {
        return _server2.default.renderToStaticMarkup(component);
      });
    }

    /**
     * Creates a Promise and fulfills it with the given component rendered into a
     * a valid AMP HTML document reduced to a single string.
     * The component is allowed to contain childrens with custom AMP elements.
     * @param {ReactElement} component - The component root to render into body.
     * @param {Object} config - required and contains few optional
     * parameters for AMP template.
     * @returns {Promise[string]} - String that contains the static markup
     */

  }, {
    key: 'renderStatic',
    value: function renderStatic(component) {
      var _this = this;

      var template = this.settings.template;

      return new Promise(function (fulfill, reject) {
        try {
          var _aphrodite = _this.aphrodite(component),
              html = _aphrodite.html,
              css = _aphrodite.css;

          debug('Executing reactDOMServer.');

          var document = template.doctype + _server2.default.renderToStaticMarkup(_react2.default.createElement(_Template2.default, {
            html: template.html,
            head: _extends({}, template.head, {
              styles: css.content,
              scripts: (0, _Tags.getScripts)(),
              metas: (0, _Tags.getMetas)()
            }),
            body: html
          }));

          if (template.prettyPrint) {
            document = (0, _html.prettyPrint)(document);
          }

          if (_this.settings.ampValidations) {
            debug('AMP validation is enabled.');
            return (0, _ampvalidator.validateMarkup)(document).then(fulfill).catch(function (ampErrors) {
              reject({ validation: ampErrors, markup: document });
            });
          }
          return fulfill(document);
        } catch (error) {
          return reject({
            markup: error
          });
        }
      });
    }

    /**
    * Calls for render and writes the content into disc.
    * @param {String} output path.
    * @param {ReactElement} component - The component root to render into body.
    * @param {Object} config - required and contains few optional
    * parameters for AMP template.
    * @returns {Promise}
    */

  }, {
    key: 'renderToFile',
    value: function renderToFile(file) {
      for (var _len = arguments.length, toRender = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        toRender[_key - 1] = arguments[_key];
      }

      return this.renderStatic.apply(this, toRender).then(function (staticMarkup) {
        debug('Rendering to file --> ', file);
        _fs2.default.writeFileSync(file, staticMarkup);
        return staticMarkup;
      });
    }
  }]);

  return Core;
}();

exports.default = Core;
//# sourceMappingURL=index.js.map