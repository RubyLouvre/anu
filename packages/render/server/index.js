import ReactPartialRenderer from "./ReactPartialRenderer";

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
import {Readable} from "stream";


class ReactMarkupReadableStream extends Readable {
    constructor(element, makeStaticMarkup) {
        // Calls the stream.Readable(options) constructor. Consider exposing built-in
        // features like highWaterMark in the future.
        super({});
        this.partialRenderer = new ReactPartialRenderer(element, makeStaticMarkup);
    }
  
    _read(size) {
        try {
            this.push(this.partialRenderer.read(size));
        } catch (err) {
            this.emit("error", err);
        }
    }
}

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