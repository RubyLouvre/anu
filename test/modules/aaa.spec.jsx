import { beforeHook, afterHook, browser } from 'karma-event-driver-ext/cjs/event-driver-hooks';
import React from 'dist/React'

describe('node模块', function () {
    this.timeout(200000);
    before(async () => {
        await beforeHook();
    });
    after(async () => {
        await afterHook(false);
    });

    var body = document.body, div
    beforeEach(function () {
        div = document.createElement('div')
        body.appendChild(div)
    })
    afterEach(function () {
        body.removeChild(div)

    })


it('should remove orphaned elements replaced by Components', () => {
		class Comp extends React.Component {
			render() {
				return <span>span in a component</span>;
			}
		}
		let root;
		function test(content) {
			root = React.render(content, div);
		}

		test(<Comp />);
		console.log(root)
		test(<div>just a div</div>);
		console.log(root)
		test(<Comp />);
		console.log(root)
        console.log(div)
		expect(div.innerHTML).to.equal('<span>span in a component</span>');
	});
    
})