{
  props.type === 'md' ? (
    <div className="m-content" id="js-content">
      <div id="markdown-body" className="m-content-container markdown-body" dangerouslySetInnerHTML={{ __html: props.content }}>
      
      </div>
      {
        (props.prev || props.next) ? (
          <div className="m-content-container m-paging">
            {props.prev ?
              <div className="m-paging-prev m-paging-item">
                <a href={relePath(props.distPath, props.prev.distPath)} className="href">
                  <span className="ui-font-ydoc">&#xf07d;</span>
                  {props.prev.title}
                </a>
              </div> : null}
            {props.next ?
              <div className="m-paging-next m-paging-item">
                <a href={relePath(props.distPath, props.next.distPath)} className="href">
                  {props.next.title}
                  <span className="ui-font-ydoc">&#xf07f;</span>
                </a>
              </div> : null}
          </div>
        ) : null
      }
    </div>
  ) : (
    <div className="m-content" id="js-content" dangerouslySetInnerHTML={{ __html: props.content }}></div>
  )
}