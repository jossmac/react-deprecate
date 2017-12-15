# React Deprecate

Higher order component to support old props and warn users about the prop change.

## Install

```bash
yarn add react-deprecate
```

## Usage

```jsx
import React, { Component } from 'react';
import renamePropsWithWarning from 'react-deprecate';

// Your component with the breaking name change
class LibComponent extends Component {
  static propTypes = { label: PropTypes.string }
  render () {
    return <span>{this.props.label}</span>;
  }
}

// Wrapped, with options `old` --> `new`.
// Optional third argument is a custom message renderer.
export default renamePropsWithWarning(
  LibComponent,
  { description: 'label', val: 'value' },
  ({ componentName, prop, renamedProps }) => 'Your message.'
);

// Old AND new props supported:
// `description/val` mapped to `label/value` with a console warning in Development
class UserComponent extends Component {
  render () {
    return <LibComponent description="Some text" />;
  }
}
```

## License

Copyright &copy; 2017 Joss Mackison. MIT Licensed.
