<div className="m-aside">
	<div className="m-summary" id="js-menu">
		<div className="m-summary-content" id="js-menu-content">
			{
				(() => {
					const getItems = (articles) => {
						return articles.map((item, index) => {
							// const distPath = props.distPath;
							// const activeItem = distPath.substring(distPath.lastIndexOf('\/') + 1, distPath.length);
							// const activeFlag = (item.ref.indexOf(activeItem) === 0);
							// console.log(props.releativePath, item.ref);
							// console.log(JSON.stringify(relePath(props.releativePath, item.ref), null, 2));

							return (
								<li className="item" key={index}>
									{
										item.articles.length ? (
											<div className="m-summary-block">
												{item.title ? <a href={relePath(props.releativePath, item.ref)} className="href" >{item.title}</a> : ''}
												<ul className={'m-summary-list' + (item.title ? ' indent' : '')}>{getItems(item.articles)}</ul>
											</div>
										) : <a href={relePath(props.releativePath, item.ref)} className="href" >{item.title}</a>
									}

								</li>
							);
						});
					};

					return props.summary.map((item, index) => {
						return (
							<div className="m-summary-block" key={index}>
								{item.title ? <div className="m-summary-title">{item.title}</div> : ''}
								<ul className={'m-summary-list' + (item.title ? ' indent' : '')}>{getItems(item.articles)}</ul>
							</div>
						);
					});
				})()
			}
		</div>
	</div>
	<div className="m-summary-switch" id="js-summary-switch" >
		<svg viewBox="0 0 926.23699 573.74994" version="1.1" x="0px" y="0px" width="15" height="15" className="bottom">
			<g transform="translate(904.92214,-879.1482)"><path d="m -673.67664,1221.6502 -231.2455,-231.24803 55.6165,-55.627 c 30.5891,-30.59485 56.1806,-55.627 56.8701,-55.627 0.6894,0 79.8637,78.60862 175.9427,174.68583 l 174.6892,174.6858 174.6892,-174.6858 c 96.079,-96.07721 175.253196,-174.68583 175.942696,-174.68583 0.6895,0 26.281,25.03215 56.8701,55.627 l 55.6165,55.627 -231.245496,231.24803 c -127.185,127.1864-231.5279,231.248 -231.873,231.248 -0.3451,0 -104.688,-104.0616 -231.873,-231.248 z" fill="#fff"></path></g></svg>
		<svg viewBox="0 0 926.23699 573.74994" version="1.1" x="0px" y="0px" width="15" height="15" className="top">
			<g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g id="aaa" fill="#fff" fillRule="nonzero">
					<path d="M231.2455,342.502 L0,111.25397 L55.6165,55.62697 C86.2056,25.03212 111.7971,-2.99999998e-05 112.4866,-2.99999998e-05 C113.176,-2.99999998e-05 192.3503,78.60859 288.4293,174.6858 L463.1185,349.3716 L637.8077,174.6858 C733.8867,78.60859 813.060896,-2.99999997e-05 813.750396,-2.99999997e-05 C814.439896,-2.99999997e-05 840.031396,25.03212 870.620496,55.62697 L926.236996,111.25397 L694.9915,342.502 C567.8065,469.6884 463.4636,573.75 463.1185,573.75 C462.7734,573.75 358.4305,469.6884 231.2455,342.502 Z" id="Shape" transform="translate(463.118498, 286.874985) scale(1, -1) translate(-463.118498, -286.874985) "></path>
				</g>
			</g>
		</svg>
	</div>
</div>