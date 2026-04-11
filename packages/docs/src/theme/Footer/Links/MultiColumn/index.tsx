import {useColorMode} from '@docusaurus/theme-common';
import Translate, {translate} from '@docusaurus/Translate';
import LinkItem from '@theme/Footer/LinkItem';
import React, {useEffect, useState} from 'react';

const footerTitle: React.CSSProperties = {
	fontFamily: 'GTPlanar',
};

const ColumnLinkItem = ({item}) => {
	return item.html ? (
		<li
			// Developer provided the HTML, so assume it's safe.
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{__html: item.html}}
			className="footer__item"
		/>
	) : (
		<li key={item.href ?? item.to} className="footer__item">
			<LinkItem item={item} />
		</li>
	);
};

const Column = ({column}) => {
	return (
		<div className="col footer__col">
			<div style={footerTitle} className="footer__title">
				{column.title}
			</div>
			<ul className="footer__items clean-list">
				{column.items.map((item, i) => (
					// eslint-disable-next-line react/no-array-index-key
					<ColumnLinkItem key={i} item={item} />
				))}
			</ul>
		</div>
	);
};

const copyright: React.CSSProperties = {
	textAlign: 'left',
	color: 'var(--ifm-footer-link-color)',
	fontSize: '0.8em',
	marginTop: 15,
	marginRight: 38,
};

export default ({columns}) => {
	const {colorMode} = useColorMode();
	const [src, setSrc] = useState('/img/new-logo.png');
	const footerLogoAlt = translate({
		id: 'theme.custom.footer.logoAlt',
		description: 'Alt text for the footer logo on the docs site',
		message: 'Remotion logo',
	});

	useEffect(() => {
		if (colorMode === 'dark') {
			setSrc('/img/remotion-white.png');
		} else {
			setSrc('/img/new-logo.png');
		}
	}, [colorMode]);

	return (
		<div className="row footer__links">
			<div
				style={{
					padding: '0 var(--ifm-spacing-horizontal)',
					marginBottom: 20,
				}}
			>
				<img
					key={colorMode}
					src={src}
					alt={footerLogoAlt}
					style={{
						height: 32,
						marginRight: 80,
					}}
				/>
				<p style={copyright}>
					<Translate
						id="theme.custom.footer.copyrightLine1"
						description="First line of footer copyright text"
						values={{year: new Date().getFullYear()}}
					>
						{'Copyright {year} Remotion AG.'}
					</Translate>
					<br />
					<Translate
						id="theme.custom.footer.copyrightLine2"
						description="Second line of footer copyright text"
					>
						Website created with Docusaurus.
					</Translate>
				</p>
			</div>
			{columns.map((column, i) => (
				// eslint-disable-next-line react/no-array-index-key
				<Column key={i} column={column} />
			))}
		</div>
	);
};
