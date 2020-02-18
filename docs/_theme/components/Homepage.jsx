<div className="g-home">
  <section className="m-section home">
    <div className="m-section-container">
      <div className="m-section-title">
        <h4 className="name">{props.banner.name}</h4>
        <p className="desc">{props.banner.desc}</p>
        <div className="m-section-btngroup">
          {
            props.banner.btns.map((item, index) => {
              return <a href={item.href} key={index}><div className={'btn ' + (item.primary ? '' : 'btn-ghost')}>{item.name}</div></a>
            })
          }
        </div>
        {props.banner.caption ? <p className="caption">{props.banner.caption}</p> : null}
      </div>
      <div className="m-section-banner">
        <img src="./ydoc/images/dogbg@1x.png" alt="bg" srcSet="./ydoc/images/dogbg@2x.png 2x" />
      </div>
    </div>
  </section>
  <section className="m-section feature">
    <div className="m-section-container">
      <div className="m-section-box">
        {
          props.features.map((item, index) => {
            return <div className="item" key={index}>
              <h6 className="title">{item.name}</h6>
              <p className="desc">{item.desc}</p>
            </div>
          })
        }
      </div>
    </div>
  </section>
</div>