import React from "dist/React";
import getTestDocument from "./getTestDocument";
import ReactTestUtils from "lib/ReactTestUtils";

import ReactDOMServer from "dist/ReactDOMServer";
// https://github.com/facebook/react/blob/master/src/renderers/__tests__/ReactChildReconciler-test.js
var ReactDOM = window.ReactDOM || React;

describe("ReactChildReconciler", function() {
    this.timeout(200000);


    function normalizeCodeLocInfo(str) {
      return str && str.replace(/\(at .+?:\d+\)/g, '(at **)');
    }

    function createIterable(array) {
      return {
        '@@iterator': function() {
          var i = 0;
          return {
            next() {
              const next = {
                value: i < array.length ? array[i] : undefined,
                done: i === array.length,
              };
              i++;
              return next;
            },
          };
        },
      };
    }

    it('warns for duplicated array keys', () => {
      spyOn(console, 'error');

      class Component extends React.Component {
        render() {
          return <div>{[<div key="1" />, <div key="1" />]}</div>;
        }
      }

      ReactTestUtils.renderIntoDocument(<Component />);
    });

    it('warns for duplicated array keys with component stack info', () => {
      spyOn(console, 'error');

      class Component extends React.Component {
        render() {
          return <div>{[<div key="1" />, <div key="1" />]}</div>;
        }
      }

      class Parent extends React.Component {
        render() {
          return React.cloneElement(this.props.child);
        }
      }

      class GrandParent extends React.Component {
        render() {
          return <Parent child={<Component />} />;
        }
      }

      ReactTestUtils.renderIntoDocument(<GrandParent />);
    });

    it('warns for duplicated iterable keys', () => {
      spyOn(console, 'error');

      class Component extends React.Component {
        render() {
          return <div>{createIterable([<div key="1" />, <div key="1" />])}</div>;
        }
      }

      ReactTestUtils.renderIntoDocument(<Component />);
    });

    it('warns for duplicated iterable keys with component stack info', () => {
      spyOn(console, 'error');

      class Component extends React.Component {
        render() {
          return <div>{createIterable([<div key="1" />, <div key="1" />])}</div>;
        }
      }

      class Parent extends React.Component {
        render() {
          return React.cloneElement(this.props.child);
        }
      }

      class GrandParent extends React.Component {
        render() {
          return <Parent child={<Component />} />;
        }
      }

      ReactTestUtils.renderIntoDocument(<GrandParent />);
    });


});