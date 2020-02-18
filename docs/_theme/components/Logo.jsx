<a href={relePath(props.distPath, "index.html")} target="_self">
  {
    props.nav.logo ? <img className="logo" width="36" src={relePath(props.distPath, props.nav.logo)} /> : null
  }
  {
    props.nav.title ? <h6 className="name">{props.nav.title}</h6> : null
  }
</a>