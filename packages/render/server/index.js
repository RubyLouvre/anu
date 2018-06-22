import ReactPartialRenderer from './Renderer';
import { miniCreateClass } from 'react-core/util';
/**
 * Render a ReactElement to its initial HTML. This should only be used on the
 * server.
 * See https://reactjs.org/docs/react-dom-server.html#rendertostring
 */
export function renderToString(element) {
    const renderer = new ReactPartialRenderer(element, false);
    const markup = renderer.read(Infinity);
    return markup;
}

/**
 * Similar to renderToString, except this doesn't create extra DOM attributes
 * such as data-react-id that React uses internally.
 * See https://reactjs.org/docs/react-dom-server.html#rendertostaticmarkup
 */
export function renderToStaticMarkup(element) {
    const renderer = new ReactPartialRenderer(element, true);
    const markup = renderer.read(Infinity);
    return markup;
}
import {Readable} from 'stream';


var ReactMarkupReadableStream = miniCreateClass(function ReactMarkupReadableStream(element, makeStaticMarkup){
    this.partialRenderer = new ReactPartialRenderer(element, makeStaticMarkup);
},{
    _read(size) {
        try {
            this.push(this.partialRenderer.read(size));
        } catch (err) {
            this.emit('error', err);
        }
    }
},Readable );

/**
 * Render a ReactElement to its initial HTML. This should only be used on the
 * server.
 * See https://reactjs.org/docs/react-dom-stream.html#rendertonodestream
 */
export function renderToNodeStream(element) {
    return new ReactMarkupReadableStream(element, false);
}
  
/**
   * Similar to renderToNodeStream, except this doesn't create extra DOM attributes
   * such as data-react-id that React uses internally.
   * See https://reactjs.org/docs/react-dom-stream.html#rendertostaticnodestream
   */
export function renderToStaticNodeStream(element) {
    return new ReactMarkupReadableStream(element, true);
}