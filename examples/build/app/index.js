'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _noImportant = require('aphrodite/no-important');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _lib = require('../../../lib');

var _styles = require('./styles');

var _styles2 = _interopRequireDefault(_styles);

var _Heading = require('./components/Heading');

var _Heading2 = _interopRequireDefault(_Heading);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function App(_ref) {
  var bannerText = _ref.bannerText;

  // Flexibility to add custom-scripts
  (0, _lib.addScript)(['amp-jwplayer', ['amp-youtube', '0.1']]);
  (0, _lib.addMeta)([{ type: 'meta', content: { 'content': 'pepe', 'name': 'people' } }]);

  return _react2.default.createElement(
    'div',
    { className: (0, _noImportant.css)(_styles2.default.blue, _styles2.default.hover) },
    _react2.default.createElement(
      'div',
      { className: 'logo' },
      _react2.default.createElement(
        'a',
        { href: 'https://github.com/Ariel-Rodriguez/react-amp-template' },
        bannerText
      )
    ),
    _react2.default.createElement(_Heading2.default, null)
  );
};

App.propTypes = {
  bannerText: _react.PropTypes.string.isRequired
};

exports.default = App;
//# sourceMappingURL=index.js.map