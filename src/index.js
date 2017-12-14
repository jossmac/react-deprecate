// @flow

import React, { Component, type ComponentType } from 'react';

type RenamedProps = {
  [key: string]: string,
};
type Props = {
  [key: string]: any,
};

function getComponentName(target: ComponentType<*>): string {
  if (target.displayName && typeof target.displayName === 'string') {
    return target.displayName;
  }

  return target.name || 'Component';
}

export default function renamePropsWithWarning(
  WrappedComponent: ComponentType<*>,
  renamedProps: RenamedProps,
): ComponentType<*> {
  return class WithRenamedProps extends Component<Props> {
    static displayName = `WithRenamedProps(${getComponentName(
      WrappedComponent,
    )})`;
    componentDidMount() {
      Object.keys(renamedProps).forEach(prop => {
        if (prop in this.props) {
          // eslint-disable-next-line
          console.warn(`${getComponentName(WrappedComponent)} Warning: Prop "${prop}" is deprecated, use "${renamedProps[prop]}" instead.`); // prettier-ignore
        }
      });
    }
    render() {
      const props = { ...this.props };
      Object.keys(renamedProps).forEach(prop => {
        if (prop in props) {
          if (!(renamedProps[prop] in props)) {
            props[renamedProps[prop]] = props[prop];
          }
          delete props[prop];
        }
      });

      return <WrappedComponent {...props} />;
    }
  };
}
