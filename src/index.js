// @flow

import React, { Component, type ComponentType } from 'react';

const shouldWarn = process.env.ENV !== 'production';

type WarningArgs = {
  componentName: string,
  prop: string,
  renamedProps: RenamedProps
};
type WarningFn = WarningArgs => string;
type RenamedProps = { [key: string]: string };
type Props = { [key: string]: any };

// attempt to get the wrapped component's name
function getComponentName(target: ComponentType<*>): string {
  if (target.displayName && typeof target.displayName === 'string') {
    return target.displayName;
  }

  return target.name || 'Component';
}

// deprecation warning for consumer
function defaultWarningMessage({ componentName, prop, renamedProps }: WarningArgs): string {
  return `${componentName} Warning: Prop "${prop}" is deprecated, use "${renamedProps[prop]}" instead.`;
}

export default function renamePropsWithWarning(
  WrappedComponent: ComponentType<*>,
  renamedProps: RenamedProps,
  warningMessage: WarningFn = defaultWarningMessage
): ComponentType<*> {
  // bail early if in production
  if (!shouldWarn) return WrappedComponent;

  return class WithRenamedProps extends Component<Props> {
    static displayName = `WithRenamedProps(${getComponentName(WrappedComponent)})`;

    // warn on deprecated props
    componentDidMount() {
      Object.keys(renamedProps).forEach(prop => {
        if (prop in this.props) {
          console.warn(
            warningMessage({
              componentName: getComponentName(WrappedComponent),
              prop,
              renamedProps
            })
          );
        }
      });
    }

    // map prop names `old` --> `new`
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

      // only pass new props
      return <WrappedComponent {...props} />;
    }
  };
}
