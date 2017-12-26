// @flow

import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import PropTypes from 'prop-types';
import renamePropsWithWarning, { defaultWarningMessage } from '../src';

type MockProps = {
  label: string,
};
class Mock extends Component<MockProps> {
  static propTypes = { label: PropTypes.string };
  render() {
    return <span>{this.props.label}</span>;
  }
}

const MockComponent = renamePropsWithWarning(Mock, {
  description: 'label',
  val: 'value',
  notRemapped: null,
});

const text = 'A short string of innocuous text.';

describe('old properties', () => {
  it('should be removed', () => {
    const wrapper = shallow(<MockComponent description={text} val={3} />);
    expect(wrapper.prop('description')).toBe(undefined);
    expect(wrapper.prop('val')).toBe(undefined);
  });
  it('should be mapped to new props', () => {
    const wrapper = shallow(<MockComponent description={text} val={3} />);
    expect(wrapper.prop('label')).toBe(text);
    expect(wrapper.prop('value')).toBe(3);
  });
  it('should not be mapped to new props if the value is null', () => {
    const wrapper = shallow(<MockComponent notRemapped={text} />);
    expect(wrapper.prop('notRemapped')).toBe(text);
  });
});

describe('new properties', () => {
  it('should be unaffected', () => {
    const wrapper = shallow(<MockComponent label={text} value={3} />);
    expect(wrapper.prop('label')).toBe(text);
    expect(wrapper.prop('value')).toBe(3);
  });
});

describe('other properties', () => {
  it('should be unaffected', () => {
    const wrapper = shallow(<MockComponent other="property" />);
    expect(wrapper.prop('other')).toBe('property');
  });
});

describe('console warning', () => {
  const mock = jest.spyOn(global.console, 'warn');

  const MockWithCustomWarning = renamePropsWithWarning(
    Mock,
    {
      description: 'label',
      val: 'value',
    },
    () => 'Some custom warning!',
  );

  it('should warn', () => {
    const wrapper = shallow(<MockComponent description={text} />);
    expect(console.warn).toBeCalled();
    expect(console.warn).toBeCalledWith(
      'Mock Warning: Prop "description" is deprecated, use "label" instead.',
    );
  });
  it('should be customisable', () => {
    const wrapper = shallow(<MockWithCustomWarning description={text} />);
    expect(console.warn).toBeCalledWith('Some custom warning!');
  });
});

describe('extended options', () => {
  type TestClassProps = {
    remappedProp?: any,
    deprecatedProp?: any,
    neverRemapMe?: any,
  };
  class TestClass extends Component<TestClassProps> {
    render() {
      return <div />;
    }
  }
  const Test = renamePropsWithWarning(TestClass, {
    remappedProp: { mapTo: 'newRemappedProp' },
    deprecatedProp: { mapTo: null },
    neverRemapMe: {
      mapTo: 'newProp',
      isDeprecated: (prop, providedProps) => false,
    },
  });

  it('should rename the prop if a mapTo option is provided', () => {
    const wrapper = shallow(<Test remappedProp="test" />);
    expect(wrapper.props()).toEqual({
      newRemappedProp: 'test',
    });
  });

  it('should not rename the prop if the mapTo option is null', () => {
    const wrapper = shallow(<Test deprecatedProp="test" />);
    expect(wrapper.props()).toEqual({
      deprecatedProp: 'test',
    });
  });

  it('should override the default check if an isDeprecated function is provided', () => {
    const mock = jest.spyOn(global.console, 'warn');
    mock.mockReset();
    const wrapper = shallow(<Test neverRemapMe="test" />);
    expect(wrapper.props()).toEqual({
      neverRemapMe: 'test',
    });
    expect(console.warn).not.toBeCalled();
  });
});
