<footer className="m-footer">
	<div className="m-footer-container">
			<div className="m-footer-links">
				{
					(() => {

						const getItems = (value) => {
							return value.map((item, index) => {
								return <li key={index}><a className="href" href={item.href}>{item.name}</a></li>;
							});
						};

						let dom = [];
						for (let key in props.links) {
							dom.push(
								<div className="group" key={key}>
									<p className="title">{key}</p>
									<ul>{getItems(props.links[key])}</ul>
								</div>
							);
						}
						return dom;
					})()
				}
			</div>
			<div className="m-footer-title">
				<p className="copyright">© {(new Date()).getFullYear()} <a className="href" href={props.copyRight.href}>{props.copyRight.name}</a></p>
				<p>Build by <a className="href" href="https://hellosean1025.github.io/ydoc/">ydoc</a></p>
			</div>
	</div>
</footer>