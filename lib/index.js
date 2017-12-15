'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = renamePropsWithWarning;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var shouldWarn = process.env.ENV !== 'production';

// attempt to get the wrapped component's name
function getComponentName(target) {
  if (target.displayName && typeof target.displayName === 'string') {
    return target.displayName;
  }

  return target.name || 'Component';
}

// deprecation warning for consumer
function defaultWarningMessage(_ref) {
  var componentName = _ref.componentName,
      prop = _ref.prop,
      renamedProps = _ref.renamedProps;

  return componentName + ' Warning: Prop "' + prop + '" is deprecated, use "' + renamedProps[prop] + '" instead.';
}

function renamePropsWithWarning(WrappedComponent, renamedProps) {
  var _class, _temp;

  var warningMessage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultWarningMessage;

  // bail early if in production
  if (!shouldWarn) return WrappedComponent;

  return _temp = _class = function (_Component) {
    _inherits(WithRenamedProps, _Component);

    function WithRenamedProps() {
      _classCallCheck(this, WithRenamedProps);

      return _possibleConstructorReturn(this, (WithRenamedProps.__proto__ || Object.getPrototypeOf(WithRenamedProps)).apply(this, arguments));
    }

    _createClass(WithRenamedProps, [{
      key: 'componentDidMount',


      // warn on deprecated props
      value: function componentDidMount() {
        var _this2 = this;

        Object.keys(renamedProps).forEach(function (prop) {
          if (prop in _this2.props) {
            console.warn(warningMessage({
              componentName: getComponentName(WrappedComponent),
              prop: prop,
              renamedProps: renamedProps
            }));
          }
        });
      }

      // map prop names `old` --> `new`

    }, {
      key: 'render',
      value: function render() {
        var props = _extends({}, this.props);

        Object.keys(renamedProps).forEach(function (prop) {
          if (prop in props) {
            if (!(renamedProps[prop] in props)) {
              props[renamedProps[prop]] = props[prop];
            }
            delete props[prop];
          }
        });

        // only pass new props
        return _react2.default.createElement(WrappedComponent, props);
      }
    }]);

    return WithRenamedProps;
  }(_react.Component), _class.displayName = 'WithRenamedProps(' + getComponentName(WrappedComponent) + ')', _temp;
}