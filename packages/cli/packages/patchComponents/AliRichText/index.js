import React from '@react';
import './index.scss';
// import JSONDoc from './doc';
var block_el = 'p|div|section|h1|h2|h3|h4|h5|h6|header|footer|hr|ul|ol|li|pre|table|tr|theader|tfooter|dt|dl|dd|article|aside|address|blockquote|filedset'.split(
  '|'
);

var JSONDoc = function() {
  this._list = [];
};

Object.assign(JSONDoc.prototype, {
  drawImg(src) {
    this._list.push({ name: 'img', src: src });
  },
  drawLine() {
    this._list.push({ name: 'view' });
  },
  getCurrentLine() {
    if (!this._list.length) {
      this.drawLine();
    }

    return this._list[this._list.length - 1];
  }
});

function isBlockElement(name) {
  return block_el.indexOf(name) !== -1;
}
function isImg(name) {
  return name === 'img';
}
function isBr(name) {
  return name === 'br';
}
function isEndTag(tag) {
  return tag.indexOf('</') === 0;
}
function isInlineTag(name) {
  return !isBlockElement(name) && !isImg(name);
}

class AliRichText extends React.Component {
  constructor(props) {
    super(props);
    console.log('props', props);
    this.state = {
      doc: {
        _list: []
      }
    };
  }
 

  componentWillReceiveProps(nextProps) {
    if (nextProps.nodes !== this.props.nodes) {
      this.processData(nextProps.nodes);
    }
  }

  processData(text) {
    var str = text.replace(/\s*style=\"[^"]*\"\s*/g, '');
    var doc = new JSONDoc();
    str.replace(/\<\/?\s*(\w+)\s*(src=\"([^"]*)\")?\/?>/g, function(tag, name, attr, src, start) {
      if (isImg(name)) {
        doc.drawImg(src);
        let line = doc.getCurrentLine();
        line.start = start + tag.length;
      } else if (isBlockElement(name)) {
        if (!isEndTag(tag)) {
          doc.drawLine();
        }
        let line = doc.getCurrentLine();
        line.start = start + tag.length;
      } else if (isBr(name)) {
        doc.drawLine();
        let line = doc.getCurrentLine();
        line.start = start + tag.length;
      } else {
        let line = doc.getCurrentLine();
        line.content = line.content || '';
        line.content = line.content.replace(/&nbsp;/gi, ' ');
        line.content += str.substring(line.start, start);
        line.start = start + tag.length;
      }

      return tag;
    });
    
    this.setState({
      doc
    });

    return doc;
  }

  render() {
    return (
      <div class="anu-block">
        {this.state.doc._list.map(function(item) {
          return (
            <div>
              {item.src ? (
                <div>
                  <image src={item.src} mode="aspectFill" style={{width: '100%'}}/>
                </div>
              ) : (
                <div class="rich-text-line">{item.content || ''}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

export default AliRichText;
