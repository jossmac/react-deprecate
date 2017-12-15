// @flow
import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import PropTypes from 'prop-types';
import renamePropsWithWarning from '../src';

class Mock extends Component {
  static propTypes = { label: PropTypes.string }
  render () { return <span>{this.props.label}</span>; }
}

const MockComponent = renamePropsWithWarning(Mock, {
  description: 'label',
  val: 'value',
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
  jest.spyOn(global.console, 'warn');

  const MockWithCustomWarning = renamePropsWithWarning(Mock, {
    description: 'label',
    val: 'value',
  }, () => 'Some custom warning!');

  it('should warn', () => {
    const wrapper = shallow(<MockComponent description={text} />);
    expect(console.warn).toBeCalled();
    expect(console.warn).toBeCalledWith('Mock Warning: Prop "description" is deprecated, use "label" instead.');
  });
  it('should be customisable', () => {
    const wrapper = shallow(<MockWithCustomWarning description={text} />);
    expect(console.warn).toBeCalledWith('Some custom warning!');
  });
});
