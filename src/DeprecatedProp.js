// @flow

import type { IsDeprecatedFn, ProvidedProps, DeprecatedProps } from './types';

const defaultIsDeprecatedCheck: IsDeprecatedFn = (prop, providedProps) =>
  prop in providedProps;

export default class DeprecatedProp {
  key: string;
  mapTo: string | null;
  isDeprecated: boolean;

  constructor(
    key: string,
    providedProps: ProvidedProps = {},
    deprecatedProps: DeprecatedProps,
  ) {
    const providedOptions = deprecatedProps[key];
    const defaultOptions = {
      mapTo: null,
      isDeprecated: defaultIsDeprecatedCheck,
    };
    const options =
      typeof providedOptions === 'string'
        ? {
            ...defaultOptions,
            mapTo: providedOptions,
          }
        : {
            ...defaultOptions,
            ...providedOptions,
          };

    this.key = key;
    this.mapTo = options.mapTo;
    this.isDeprecated = options.isDeprecated(key, providedProps);
  }
}
