<head>
	<meta charSet="UTF-8" />
	<meta content="text/html; charset=utf-8" httpEquiv="Content-Type" />
	<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<Icon distPath={props.distPath} />
	<meta name="theme-color" content="#ffffff" />
	<meta httpEquiv="Cache-Control" content="no-transform" />
	<meta httpEquiv="Cache-Control" content="no-siteapp" />
	<title>{props.title}</title>
	<link rel="stylesheet" href={relePath(props.distPath, 'ydoc/styles/style.css')} />
	<meta name="author" content={props.config.author} />
	<meta name="keywords" content={props.config.keywords} />
	<meta name="description" content={props.config.description} />
	<meta id="releativePath" content={relePath(props.distPath, './')} />
	{props.assets.css.map(item=>{
		return <link key={item} rel="stylesheet" href={relePath(props.distPath, item)} />
	})}
</head>