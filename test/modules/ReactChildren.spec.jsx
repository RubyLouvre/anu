import React from "dist/React";
import {
  beforeHook,
  afterHook,
  browser
} from "karma-event-driver-ext/cjs/event-driver-hooks";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";
import ReactShallowRenderer from "lib/ReactShallowRenderer";

import ReactDOMServer from "dist/ReactDOMServer";
//https://github.com/facebook/react/blob/master/src/isomorphic/children/__tests__/ReactChildren-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactChildren", function() {
  this.timeout(200000);
  before(async () => {
    await beforeHook();
  });
  after(async () => {
    await afterHook(false);
  });

  var body = document.body,
    div;
  beforeEach(function() {
    div = document.createElement("div");
    body.appendChild(div);
  });
  afterEach(function() {
    body.removeChild(div);
  });
  it('should support identity for simple', () => {
    var context = {};
    var callback = spyOn.createSpy(function(kid, index) {
      expect(this).toBe(context);
      expect(index).toBe(0);
      return kid;
    });

    var simpleKid = <span key="simple" />;

    // First pass children into a component to fully simulate what happens when
    // using structures that arrive from transforms.

    var instance = <div>{simpleKid}</div>;
    React.Children.forEach(instance.props.children, callback, context);
    expect(callback).toHaveBeenCalledWith(simpleKid, 0);
    callback.calls.reset();
    var mappedChildren = React.Children.map(
      instance.props.children,
      callback,
      context,
    );
    expect(callback).toHaveBeenCalledWith(simpleKid, 0);
    expect(mappedChildren[0]).toEqual(<span key=".$simple" />);
  });

  it('should treat single arrayless child as being in array', () => {
    var context = {};
    var callback = spyOn.createSpy(function(kid, index) {
      expect(this).toBe(context);
      expect(index).toBe(0);
      return kid;
    });

    var simpleKid = <span />;
    var instance = <div>{simpleKid}</div>;
    React.Children.forEach(instance.props.children, callback, context);
    expect(callback).toHaveBeenCalledWith(simpleKid, 0);
    callback.calls.reset();
    var mappedChildren = React.Children.map(
      instance.props.children,
      callback,
      context,
    );
    expect(callback).toHaveBeenCalledWith(simpleKid, 0);
    expect(mappedChildren[0]).toEqual(<span key=".0" />);
  });

  it('should treat single child in array as expected', () => {
    var context = {};
    var callback = spyOn.createSpy(function(kid, index) {
      expect(this).toBe(context);
      return kid;
    });

    var simpleKid = <span key="simple" />;
    var instance = <div>{[simpleKid]}</div>;
    React.Children.forEach(instance.props.children, callback, context);
    expect(callback).toHaveBeenCalledWith(simpleKid, 0);
    callback.calls.reset();
    var mappedChildren = React.Children.map(
      instance.props.children,
      callback,
      context,
    );
    expect(callback).toHaveBeenCalledWith(simpleKid, 0);
    expect(mappedChildren[0]).toEqual(<span key=".$simple" />);
  });

  it('should be called for each child', () => {
    var zero = <div key="keyZero" />;
    var one = null;
    var two = <div key="keyTwo" />;
    var three = null;
    var four = <div key="keyFour" />;
    var context = {};

    var callback = spyOn.createSpy(function(kid, index) {
      expect(this).toBe(context);
      return kid;
    });

    var instance = (
      <div>
        {zero}
        {one}
        {two}
        {three}
        {four}
      </div>
    );

    function assertCalls() {
      expect(callback).toHaveBeenCalledWith(zero, 0);
      expect(callback).toHaveBeenCalledWith(one, 1);
      expect(callback).toHaveBeenCalledWith(two, 2);
      expect(callback).toHaveBeenCalledWith(three, 3);
      expect(callback).toHaveBeenCalledWith(four, 4);
      callback.calls.reset();
    }

    React.Children.forEach(instance.props.children, callback, context);
    assertCalls();

    var mappedChildren = React.Children.map(
      instance.props.children,
      callback,
      context,
    );
    assertCalls();
    expect(mappedChildren).toEqual([
      <div key=".$keyZero" />,
      <div key=".$keyTwo" />,
      <div key=".$keyFour" />,
    ]);
  });

  it('should traverse children of different kinds', () => {
    var div = <div key="divNode" />;
    var span = <span key="spanNode" />;
    var a = <a key="aNode" />;

    var context = {};
    var callback = spyOn.createSpy(function(kid, index) {
      expect(this).toBe(context);
      return kid;
    });
    var instance = (
      <div>
        {div}
        {[[span]]}
        {[a]}
        {'string'}
        {1234}
        {true}
        {false}
        {null}
        {undefined}
      </div>
    );

    function assertCalls() {
      expect(callback.calls.count()).toBe(9);
      expect(callback).toHaveBeenCalledWith(div, 0);
      expect(callback).toHaveBeenCalledWith(span, 1);
      expect(callback).toHaveBeenCalledWith(a, 2);
      expect(callback).toHaveBeenCalledWith('string', 3);
      expect(callback).toHaveBeenCalledWith(1234, 4);
      expect(callback).toHaveBeenCalledWith(null, 5);
      expect(callback).toHaveBeenCalledWith(null, 6);
      expect(callback).toHaveBeenCalledWith(null, 7);
      expect(callback).toHaveBeenCalledWith(null, 8);
      callback.calls.reset();
    }

    React.Children.forEach(instance.props.children, callback, context);
    assertCalls();

    var mappedChildren = React.Children.map(
      instance.props.children,
      callback,
      context,
    );
    assertCalls();
    expect(mappedChildren).toEqual([
      <div key=".$divNode" />,
      <span key=".1:0:$spanNode" />,
      <a key=".2:$aNode" />,
      'string',
      1234,
    ]);
  });

})