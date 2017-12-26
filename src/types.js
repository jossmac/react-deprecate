// @flow

export type ProvidedProps = { [key: string]: any };

export type WithRenamedPropsState = { remappedProps: ProvidedProps };

export type IsDeprecatedFn = (
  prop: string,
  providedProps: ProvidedProps,
) => boolean;

export type DeprecatedProps = {
  [key: string]:
    | string
    | null
    | {
        mapTo: string | null,
        isDeprecated?: IsDeprecatedFn,
      },
};

export type WarningArgs = {
  componentName: string,
  deprecatedProps: DeprecatedProps,
  mapTo: string | null,
  prop: string,
  value: any,
};

export type WarningFn = (args: WarningArgs) => string;
