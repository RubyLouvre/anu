const ReactDOMServerIntegrationUtils = require('./utils/ReactDOMServerIntegrationTestUtils');

let React;
let ReactDOM;
let ReactDOMServer;

function initModules() {
  // Reset warning cache.
  jest.resetModuleRegistry();
  React = require('react');
  ReactDOM = require('react-dom');
  ReactDOMServer = require('react-server-renderer');

  // Make them available to the helpers.
  return {
    ReactDOM,
    ReactDOMServer,
  };
}

const {
  resetModules,
  itRenders,
  clientCleanRender,
} = ReactDOMServerIntegrationUtils(initModules);

describe('ReactDOMServerIntegration', () => {
  beforeEach(() => {
    resetModules();
  });

  describe('property to attribute mapping', function() {
    describe('string properties', function() {
      itRenders('simple numbers', async render => {
        const e = await render(<div width={30} />);
        expect(e.getAttribute('width')).toBe('30');
      });

      itRenders('simple strings', async render => {
        const e = await render(<div width={'30'} />);
        expect(e.getAttribute('width')).toBe('30');
      });

      itRenders('no string prop with true value', async render => {
        const e = await render(<a href={true} />, 1);
        expect(e.hasAttribute('href')).toBe(false);
      });

      itRenders('no string prop with false value', async render => {
        const e = await render(<a href={false} />, 1);
        expect(e.hasAttribute('href')).toBe(false);
      });

      itRenders('no string prop with null value', async render => {
        const e = await render(<div width={null} />);
        expect(e.hasAttribute('width')).toBe(false);
      });

      itRenders('no string prop with function value', async render => {
        const e = await render(<div width={function() {}} />, 1);
        expect(e.hasAttribute('width')).toBe(false);
      });

      itRenders('no string prop with symbol value', async render => {
        const e = await render(<div width={Symbol('foo')} />, 1);
        expect(e.hasAttribute('width')).toBe(false);
      });
    });

    describe('boolean properties', function() {
      itRenders('boolean prop with true value', async render => {
        const e = await render(<div hidden={true} />);
        expect(e.getAttribute('hidden')).toBe('');
      });

      itRenders('boolean prop with false value', async render => {
        const e = await render(<div hidden={false} />);
        expect(e.getAttribute('hidden')).toBe(null);
      });

      itRenders('boolean prop with self value', async render => {
        const e = await render(<div hidden="hidden" />);
        expect(e.getAttribute('hidden')).toBe('');
      });

      // this does not seem like correct behavior, since hidden="" in HTML indicates
      // that the boolean property is present. however, it is how the current code
      // behaves, so the test is included here.
      itRenders('boolean prop with "" value', async render => {
        const e = await render(<div hidden="" />);
        expect(e.getAttribute('hidden')).toBe(null);
      });

      // this seems like it might mask programmer error, but it's existing behavior.
      itRenders('boolean prop with string value', async render => {
        const e = await render(<div hidden="foo" />);
        expect(e.getAttribute('hidden')).toBe('');
      });

      // this seems like it might mask programmer error, but it's existing behavior.
      itRenders('boolean prop with array value', async render => {
        const e = await render(<div hidden={['foo', 'bar']} />);
        expect(e.getAttribute('hidden')).toBe('');
      });

      // this seems like it might mask programmer error, but it's existing behavior.
      itRenders('boolean prop with object value', async render => {
        const e = await render(<div hidden={{foo: 'bar'}} />);
        expect(e.getAttribute('hidden')).toBe('');
      });

      // this seems like it might mask programmer error, but it's existing behavior.
      itRenders('boolean prop with non-zero number value', async render => {
        const e = await render(<div hidden={10} />);
        expect(e.getAttribute('hidden')).toBe('');
      });

      // this seems like it might mask programmer error, but it's existing behavior.
      itRenders('boolean prop with zero value', async render => {
        const e = await render(<div hidden={0} />);
        expect(e.getAttribute('hidden')).toBe(null);
      });

      itRenders('no boolean prop with null value', async render => {
        const e = await render(<div hidden={null} />);
        expect(e.hasAttribute('hidden')).toBe(false);
      });

      itRenders('no boolean prop with function value', async render => {
        const e = await render(<div hidden={function() {}} />, 1);
        expect(e.hasAttribute('hidden')).toBe(false);
      });

      itRenders('no boolean prop with symbol value', async render => {
        const e = await render(<div hidden={Symbol('foo')} />, 1);
        expect(e.hasAttribute('hidden')).toBe(false);
      });
    });

    describe('download property (combined boolean/string attribute)', function() {
      itRenders('download prop with true value', async render => {
        const e = await render(<a download={true} />);
        expect(e.getAttribute('download')).toBe('');
      });

      itRenders('download prop with false value', async render => {
        const e = await render(<a download={false} />);
        expect(e.getAttribute('download')).toBe(null);
      });

      itRenders('download prop with string value', async render => {
        const e = await render(<a download="myfile" />);
        expect(e.getAttribute('download')).toBe('myfile');
      });

      itRenders('download prop with string "false" value', async render => {
        const e = await render(<a download="false" />);
        expect(e.getAttribute('download')).toBe('false');
      });

      itRenders('download prop with string "true" value', async render => {
        const e = await render(<a download={'true'} />);
        expect(e.getAttribute('download')).toBe('true');
      });

      itRenders('download prop with number 0 value', async render => {
        const e = await render(<a download={0} />);
        expect(e.getAttribute('download')).toBe('0');
      });

      itRenders('no download prop with null value', async render => {
        const e = await render(<div download={null} />);
        expect(e.hasAttribute('download')).toBe(false);
      });

      itRenders('no download prop with undefined value', async render => {
        const e = await render(<div download={undefined} />);
        expect(e.hasAttribute('download')).toBe(false);
      });

      itRenders('no download prop with function value', async render => {
        const e = await render(<div download={function() {}} />, 1);
        expect(e.hasAttribute('download')).toBe(false);
      });

      itRenders('no download prop with symbol value', async render => {
        const e = await render(<div download={Symbol('foo')} />, 1);
        expect(e.hasAttribute('download')).toBe(false);
      });
    });

    describe('className property', function() {
      itRenders('className prop with string value', async render => {
        const e = await render(<div className="myClassName" />);
        expect(e.getAttribute('class')).toBe('myClassName');
      });

      itRenders('className prop with empty string value', async render => {
        const e = await render(<div className="" />);
        expect(e.getAttribute('class')).toBe('');
      });

      itRenders('no className prop with true value', async render => {
        const e = await render(<div className={true} />, 1);
        expect(e.hasAttribute('class')).toBe(false);
      });

      itRenders('no className prop with false value', async render => {
        const e = await render(<div className={false} />, 1);
        expect(e.hasAttribute('class')).toBe(false);
      });

      itRenders('no className prop with null value', async render => {
        const e = await render(<div className={null} />);
        expect(e.hasAttribute('className')).toBe(false);
      });

      itRenders('badly cased className with a warning', async render => {
        const e = await render(<div classname="test" />, 1);
        expect(e.hasAttribute('class')).toBe(false);
        expect(e.hasAttribute('classname')).toBe(true);
      });

      itRenders(
        'className prop when given the alias with a warning',
        async render => {
          const e = await render(<div class="test" />, 1);
          expect(e.className).toBe('test');
        },
      );

      itRenders(
        'className prop when given a badly cased alias',
        async render => {
          const e = await render(<div cLASs="test" />, 1);
          expect(e.className).toBe('test');
        },
      );
    });

    describe('htmlFor property', function() {
      itRenders('htmlFor with string value', async render => {
        const e = await render(<div htmlFor="myFor" />);
        expect(e.getAttribute('for')).toBe('myFor');
      });

      itRenders('no badly cased htmlfor', async render => {
        const e = await render(<div htmlfor="myFor" />, 1);
        expect(e.hasAttribute('for')).toBe(false);
        expect(e.getAttribute('htmlfor')).toBe('myFor');
      });

      itRenders('htmlFor with an empty string', async render => {
        const e = await render(<div htmlFor="" />);
        expect(e.getAttribute('for')).toBe('');
      });

      itRenders('no htmlFor prop with true value', async render => {
        const e = await render(<div htmlFor={true} />, 1);
        expect(e.hasAttribute('for')).toBe(false);
      });

      itRenders('no htmlFor prop with false value', async render => {
        const e = await render(<div htmlFor={false} />, 1);
        expect(e.hasAttribute('for')).toBe(false);
      });

      itRenders('no htmlFor prop with null value', async render => {
        const e = await render(<div htmlFor={null} />);
        expect(e.hasAttribute('htmlFor')).toBe(false);
      });
    });

    describe('numeric properties', function() {
      itRenders(
        'positive numeric property with positive value',
        async render => {
          const e = await render(<input size={2} />);
          expect(e.getAttribute('size')).toBe('2');
        },
      );

      itRenders('numeric property with zero value', async render => {
        const e = await render(<ol start={0} />);
        expect(e.getAttribute('start')).toBe('0');
      });

      itRenders(
        'no positive numeric property with zero value',
        async render => {
          const e = await render(<input size={0} />);
          expect(e.hasAttribute('size')).toBe(false);
        },
      );

      itRenders('no numeric prop with function value', async render => {
        const e = await render(<ol start={function() {}} />, 1);
        expect(e.hasAttribute('start')).toBe(false);
      });

      itRenders('no numeric prop with symbol value', async render => {
        const e = await render(<ol start={Symbol('foo')} />, 1);
        expect(e.hasAttribute('start')).toBe(false);
      });

      itRenders(
        'no positive numeric prop with function value',
        async render => {
          const e = await render(<input size={function() {}} />, 1);
          expect(e.hasAttribute('size')).toBe(false);
        },
      );

      itRenders('no positive numeric prop with symbol value', async render => {
        const e = await render(<input size={Symbol('foo')} />, 1);
        expect(e.hasAttribute('size')).toBe(false);
      });
    });

    describe('props with special meaning in React', function() {
      itRenders('no ref attribute', async render => {
        class RefComponent extends React.Component {
          render() {
            return <div ref="foo" />;
          }
        }
        const e = await render(<RefComponent />);
        expect(e.getAttribute('ref')).toBe(null);
      });

      itRenders('no children attribute', async render => {
        const e = await render(React.createElement('div', {}, 'foo'));
        expect(e.getAttribute('children')).toBe(null);
      });

      itRenders('no key attribute', async render => {
        const e = await render(<div key="foo" />);
        expect(e.getAttribute('key')).toBe(null);
      });

      itRenders('no dangerouslySetInnerHTML attribute', async render => {
        const e = await render(
          <div dangerouslySetInnerHTML={{__html: '<foo />'}} />,
        );
        expect(e.getAttribute('dangerouslySetInnerHTML')).toBe(null);
      });

      itRenders('no suppressContentEditableWarning attribute', async render => {
        const e = await render(<div suppressContentEditableWarning={true} />);
        expect(e.getAttribute('suppressContentEditableWarning')).toBe(null);
      });

      itRenders('no suppressHydrationWarning attribute', async render => {
        const e = await render(<span suppressHydrationWarning={true} />);
        expect(e.getAttribute('suppressHydrationWarning')).toBe(null);
      });
    });

    describe('inline styles', function() {
      itRenders('simple styles', async render => {
        const e = await render(<div style={{color: 'red', width: '30px'}} />);
        expect(e.style.color).toBe('red');
        expect(e.style.width).toBe('30px');
      });

      itRenders('relevant styles with px', async render => {
        const e = await render(
          <div
            style={{
              left: 0,
              margin: 16,
              opacity: 0.5,
              padding: '4px',
            }}
          />,
        );
        expect(e.style.left).toBe('0px');
        expect(e.style.margin).toBe('16px');
        expect(e.style.opacity).toBe('0.5');
        expect(e.style.padding).toBe('4px');
      });

      itRenders('custom properties', async render => {
        const e = await render(<div style={{'--foo': 5}} />);
        // This seems like an odd way computed properties are exposed in jsdom.
        // In a real browser we'd read it with e.style.getPropertyValue('--foo')
        expect(e.style.Foo).toBe('5');
      });

      itRenders('no undefined styles', async render => {
        const e = await render(
          <div style={{color: undefined, width: '30px'}} />,
        );
        expect(e.style.color).toBe('');
        expect(e.style.width).toBe('30px');
      });

      itRenders('no null styles', async render => {
        const e = await render(<div style={{color: null, width: '30px'}} />);
        expect(e.style.color).toBe('');
        expect(e.style.width).toBe('30px');
      });

      itRenders('no empty styles', async render => {
        const e = await render(<div style={{color: null, width: null}} />);
        expect(e.style.color).toBe('');
        expect(e.style.width).toBe('');
        expect(e.hasAttribute('style')).toBe(false);
      });

      itRenders('unitless-number rules with prefixes', async render => {
        const {style} = await render(
          <div
            style={{
              lineClamp: 10,
              WebkitLineClamp: 10,
              MozFlexGrow: 10,
              msFlexGrow: 10,
              msGridRow: 10,
              msGridRowEnd: 10,
              msGridRowSpan: 10,
              msGridRowStart: 10,
              msGridColumn: 10,
              msGridColumnEnd: 10,
              msGridColumnSpan: 10,
              msGridColumnStart: 10,
            }}
          />,
        );

        expect(style.lineClamp).toBe('10');
        expect(style.WebkitLineClamp).toBe('10');
        expect(style.MozFlexGrow).toBe('10');
        // jsdom is inconsistent in the style property name
        // it uses on the client and when processing server markup.
        // But it should be there either way.
        expect(style.MsFlexGrow || style.msFlexGrow).toBe('10');
        expect(style.MsGridRow || style.msGridRow).toBe('10');
        expect(style.MsGridRowEnd || style.msGridRowEnd).toBe('10');
        expect(style.MsGridRowSpan || style.msGridRowSpan).toBe('10');
        expect(style.MsGridRowStart || style.msGridRowStart).toBe('10');
        expect(style.MsGridColumn || style.msGridColumn).toBe('10');
        expect(style.MsGridColumnEnd || style.msGridColumnEnd).toBe('10');
        expect(style.MsGridColumnSpan || style.msGridColumnSpan).toBe('10');
        expect(style.MsGridColumnStart || style.msGridColumnStart).toBe('10');
      });
    });

    describe('aria attributes', function() {
      itRenders('simple strings', async render => {
        const e = await render(<div aria-label="hello" />);
        expect(e.getAttribute('aria-label')).toBe('hello');
      });

      // this probably is just masking programmer error, but it is existing behavior.
      itRenders('aria string prop with false value', async render => {
        const e = await render(<div aria-label={false} />);
        expect(e.getAttribute('aria-label')).toBe('false');
      });

      itRenders('no aria prop with null value', async render => {
        const e = await render(<div aria-label={null} />);
        expect(e.hasAttribute('aria-label')).toBe(false);
      });

      itRenders('"aria" attribute with a warning', async render => {
        // Reserved for future use.
        const e = await render(<div aria="hello" />, 1);
        expect(e.getAttribute('aria')).toBe('hello');
      });
    });

    describe('cased attributes', function() {
      itRenders(
        'badly cased aliased HTML attribute with a warning',
        async render => {
          const e = await render(<meta httpequiv="refresh" />, 1);
          expect(e.hasAttribute('http-equiv')).toBe(false);
          expect(e.getAttribute('httpequiv')).toBe('refresh');
        },
      );

      itRenders('badly cased SVG attribute with a warning', async render => {
        const e = await render(
          <svg>
            <text textlength="10" />
          </svg>,
          1,
        );
        // The discrepancy is expected as long as we emit a warning
        // both on the client and the server.
        if (render === clientCleanRender) {
          // On the client, "textlength" is treated as a case-sensitive
          // SVG attribute so the wrong attribute ("textlength") gets set.
          expect(e.firstChild.getAttribute('textlength')).toBe('10');
          expect(e.firstChild.hasAttribute('textLength')).toBe(false);
        } else {
          // When parsing HTML (including the hydration case), the browser
          // correctly maps "textlength" to "textLength" SVG attribute.
          // So it happens to work on the initial render.
          expect(e.firstChild.getAttribute('textLength')).toBe('10');
          expect(e.firstChild.hasAttribute('textlength')).toBe(false);
        }
      });

      itRenders('no badly cased aliased SVG attribute alias', async render => {
        const e = await render(
          <svg>
            <text strokedasharray="10 10" />
          </svg>,
          1,
        );
        expect(e.firstChild.hasAttribute('stroke-dasharray')).toBe(false);
        expect(e.firstChild.getAttribute('strokedasharray')).toBe('10 10');
      });

      itRenders(
        'no badly cased original SVG attribute that is aliased',
        async render => {
          const e = await render(
            <svg>
              <text stroke-dasharray="10 10" />
            </svg>,
            1,
          );
          expect(e.firstChild.getAttribute('stroke-dasharray')).toBe('10 10');
        },
      );
    });

    describe('unknown attributes', function() {
      itRenders('unknown attributes', async render => {
        const e = await render(<div foo="bar" />);
        expect(e.getAttribute('foo')).toBe('bar');
      });

      itRenders('unknown data- attributes', async render => {
        const e = await render(<div data-foo="bar" />);
        expect(e.getAttribute('data-foo')).toBe('bar');
      });

      itRenders('badly cased reserved attributes', async render => {
        const e = await render(<div CHILDREN="5" />, 1);
        expect(e.getAttribute('CHILDREN')).toBe('5');
      });

      itRenders('"data" attribute', async render => {
        // For `<object />` acts as `src`.
        const e = await render(<object data="hello" />);
        expect(e.getAttribute('data')).toBe('hello');
      });

      itRenders('no unknown data- attributes with null value', async render => {
        const e = await render(<div data-foo={null} />);
        expect(e.hasAttribute('data-foo')).toBe(false);
      });

      itRenders('unknown data- attributes with casing', async render => {
        const e = await render(<div data-fooBar="true" />, 1);
        expect(e.getAttribute('data-foobar')).toBe('true');
      });

      itRenders('unknown data- attributes with boolean true', async render => {
        const e = await render(<div data-foobar={true} />);
        expect(e.getAttribute('data-foobar')).toBe('true');
      });

      itRenders('unknown data- attributes with boolean false', async render => {
        const e = await render(<div data-foobar={false} />);
        expect(e.getAttribute('data-foobar')).toBe('false');
      });

      itRenders(
        'no unknown data- attributes with casing and null value',
        async render => {
          const e = await render(<div data-fooBar={null} />, 1);
          expect(e.hasAttribute('data-foobar')).toBe(false);
        },
      );

      itRenders('custom attributes for non-standard elements', async render => {
        // This test suite generally assumes that we get exactly
        // the same warnings (or none) for all scenarios including
        // SSR + innerHTML, hydration, and client-side rendering.
        // However this particular warning fires only when creating
        // DOM nodes on the client side. We force it to fire early
        // so that it gets deduplicated later, and doesn't fail the test.
        expect(() => {
          ReactDOM.render(<nonstandard />, document.createElement('div'));
        }).toWarnDev('The tag <nonstandard> is unrecognized in this browser.');

        const e = await render(<nonstandard foo="bar" />);
        expect(e.getAttribute('foo')).toBe('bar');
      });

      itRenders('SVG tags with dashes in them', async render => {
        const e = await render(
          <svg>
            <font-face accentHeight={10} />
          </svg>,
        );
        expect(e.firstChild.hasAttribute('accentHeight')).toBe(false);
        expect(e.firstChild.getAttribute('accent-height')).toBe('10');
      });

      itRenders('cased custom attributes', async render => {
        const e = await render(<div fooBar="test" />, 1);
        expect(e.getAttribute('foobar')).toBe('test');
      });
    });

    itRenders('no HTML events', async render => {
      const e = await render(<div onClick={() => {}} />);
      expect(e.getAttribute('onClick')).toBe(null);
      expect(e.getAttribute('onClick')).toBe(null);
      expect(e.getAttribute('click')).toBe(null);
    });

    itRenders('no unknown events', async render => {
      const e = await render(
        <div onunknownevent="alert(&quot;hack&quot;)" />,
        1,
      );
      expect(e.getAttribute('onunknownevent')).toBe(null);
    });

    itRenders('custom attribute named `on`', async render => {
      const e = await render(<div on="tap:do-something" />);
      expect(e.getAttribute('on')).toEqual('tap:do-something');
    });
  });

  // These tests mostly verify the existing behavior.
  // It may not always make sense but we can't change it in minors.
  describe('custom elements', () => {
    itRenders('class for custom elements', async render => {
      const e = await render(<div is="custom-element" class="test" />, 0);
      expect(e.getAttribute('class')).toBe('test');
    });

    itRenders('className for custom elements', async render => {
      const e = await render(<div is="custom-element" className="test" />, 0);
      expect(e.getAttribute('className')).toBe('test');
    });

    itRenders('htmlFor attribute on custom elements', async render => {
      const e = await render(<div is="custom-element" htmlFor="test" />);
      expect(e.getAttribute('htmlFor')).toBe('test');
    });

    itRenders('for attribute on custom elements', async render => {
      const e = await render(<div is="custom-element" for="test" />);
      expect(e.getAttribute('for')).toBe('test');
    });

    itRenders('unknown attributes for custom elements', async render => {
      const e = await render(<custom-element foo="bar" />);
      expect(e.getAttribute('foo')).toBe('bar');
    });

    itRenders('unknown `on*` attributes for custom elements', async render => {
      const e = await render(<custom-element onunknown="bar" />);
      expect(e.getAttribute('onunknown')).toBe('bar');
    });

    itRenders('unknown boolean `true` attributes as strings', async render => {
      const e = await render(<custom-element foo={true} />);
      expect(e.getAttribute('foo')).toBe('true');
    });

    itRenders('unknown boolean `false` attributes as strings', async render => {
      const e = await render(<custom-element foo={false} />);
      expect(e.getAttribute('foo')).toBe('false');
    });

    itRenders(
      'no unknown attributes for custom elements with null value',
      async render => {
        const e = await render(<custom-element foo={null} />);
        expect(e.hasAttribute('foo')).toBe(false);
      },
    );

    itRenders(
      'unknown attributes for custom elements using is',
      async render => {
        const e = await render(<div is="custom-element" foo="bar" />);
        expect(e.getAttribute('foo')).toBe('bar');
      },
    );

    itRenders(
      'no unknown attributes for custom elements using is with null value',
      async render => {
        const e = await render(<div is="custom-element" foo={null} />);
        expect(e.hasAttribute('foo')).toBe(false);
      },
    );
  });
});