// @flow

import React, { Component, type ComponentType } from 'react';
import DeprecatedProp from './DeprecatedProp';
import type {
  DeprecatedProps,
  WarningFn,
  ProvidedProps,
  WithRenamedPropsState,
} from './types';

const shouldWarn = process.env.ENV !== 'production';

// Attempt to get the wrapped component's name
function getComponentName(target: ComponentType<*>): string {
  if (target.displayName && typeof target.displayName === 'string') {
    return target.displayName;
  }

  return target.name || 'Component';
}

// Default deprecation warning for consumer
export const defaultWarningMessage: WarningFn = ({
  componentName,
  mapTo,
  prop,
}): string => {
  if (mapTo) {
    return `${componentName} Warning: Prop "${prop}" is deprecated, use "${mapTo}" instead.`;
  }

  return `${componentName} Warning: Prop "${prop}" is deprecated.`;
};

export default function renamePropsWithWarning(
  WrappedComponent: ComponentType<*>,
  deprecatedProps: DeprecatedProps = {},
  warningMessage: WarningFn = defaultWarningMessage,
): ComponentType<*> {
  // Bail early if in production
  if (!shouldWarn) return WrappedComponent;

  const componentName = getComponentName(WrappedComponent);

  return class WithRenamedProps extends Component<
    ProvidedProps,
    WithRenamedPropsState,
  > {
    static displayName = `WithRenamedProps(${componentName})`;

    constructor(props) {
      super(props);
      this.state = {
        remappedProps: this.remapProps(props),
      };
    }

    componentWillReceiveProps(newProps) {
      const remappedProps = this.remapProps(newProps);
      this.setState({ remappedProps });
    }

    remapProps = providedProps => {
      const remappedProps = { ...providedProps };

      Object.keys(deprecatedProps).forEach(propName => {
        const prop = new DeprecatedProp(
          propName,
          remappedProps,
          deprecatedProps,
        );
        if (prop.isDeprecated) {
          console.warn(
            warningMessage({
              componentName,
              deprecatedProps,
              mapTo: prop.mapTo,
              prop: prop.key,
              value: providedProps[prop.key],
            }),
          );
          if (prop.mapTo && !(prop.mapTo in remappedProps)) {
            remappedProps[prop.mapTo] = remappedProps[prop.key];
            delete remappedProps[prop.key];
          }
        }
      });

      return remappedProps;
    };

    render() {
      return <WrappedComponent {...this.state.remappedProps} />;
    }
  };
}
