import Link from '@docusaurus/Link';
import {useColorMode} from '@docusaurus/theme-common';
import Translate, {translate} from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import '@remotion/promo-pages/dist/Homepage.css';
import {NewLanding} from '@remotion/promo-pages/dist/Homepage.js';
import '@remotion/promo-pages/dist/tailwind.css';
import Layout from '@theme/Layout';
import React from 'react';

if (
	typeof window !== 'undefined' &&
	window.location?.origin?.includes('convert.remotion.dev')
) {
	window.location.href = 'https://remotion.dev/convert';
}

const Inner: React.FC = () => {
	const {colorMode, setColorMode} = useColorMode();

	return <NewLanding colorMode={colorMode} setColorMode={setColorMode} />;
};

const noticeStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: '1.5rem',
	flexWrap: 'wrap',
	margin: '1rem auto 0',
	padding: '1rem 1.25rem',
	maxWidth: 'min(1200px, calc(100% - 24px))',
	border: '1px solid var(--ifm-color-emphasis-300)',
	borderRadius: '20px',
	background:
		'linear-gradient(135deg, rgba(0, 140, 255, 0.08), rgba(0, 0, 0, 0.02))',
};

const noticeCopyStyle: React.CSSProperties = {
	flex: '1 1 520px',
};

const noticeBadgeStyle: React.CSSProperties = {
	display: 'inline-flex',
	alignItems: 'center',
	padding: '0.35rem 0.7rem',
	marginBottom: '0.75rem',
	borderRadius: '999px',
	fontSize: '0.8rem',
	fontWeight: 600,
	letterSpacing: '0.02em',
	color: 'var(--ifm-color-primary-darkest)',
	backgroundColor: 'rgba(0, 140, 255, 0.12)',
};

const noticeTitleStyle: React.CSSProperties = {
	fontSize: '1.05rem',
	fontWeight: 700,
	lineHeight: 1.4,
	marginBottom: '0.5rem',
};

const noticeDescriptionStyle: React.CSSProperties = {
	fontSize: '0.95rem',
	lineHeight: 1.6,
	color: 'var(--ifm-color-emphasis-700)',
	marginBottom: '0.4rem',
};

const noticeHintStyle: React.CSSProperties = {
	fontSize: '0.92rem',
	lineHeight: 1.6,
	color: 'var(--ifm-color-emphasis-600)',
};

const noticeLinkStyle: React.CSSProperties = {
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0.8rem 1rem',
	borderRadius: '999px',
	fontWeight: 700,
	whiteSpace: 'nowrap',
	textDecoration: 'none',
	color: '#fff',
	backgroundColor: 'var(--ifm-color-primary)',
	boxShadow: '0 10px 24px rgba(0, 140, 255, 0.18)',
};

const LocalizationNotice: React.FC = () => {
	const docsUrl = useBaseUrl('/docs');

	return (
		<div style={noticeStyle}>
			<div style={noticeCopyStyle}>
				<div style={noticeBadgeStyle}>
					<Translate
						id="homepage.localization.badge"
						description="Badge shown in the homepage localization notice"
					>
						Chinese localization preview
					</Translate>
				</div>
				<div style={noticeTitleStyle}>
					<Translate
						id="homepage.localization.title"
						description="Headline for the homepage localization notice"
					>
						This fork is adapting Remotion for Simplified Chinese users.
					</Translate>
				</div>
				<div style={noticeDescriptionStyle}>
					<Translate
						id="homepage.localization.description"
						description="Description for the homepage localization notice"
					>
						Chinese navigation, site chrome, and key docs actions are available
						now. Most documentation content still falls back to English and will
						be translated progressively.
					</Translate>
				</div>
				<div style={noticeHintStyle}>
					<Translate
						id="homepage.localization.switchHint"
						description="Hint telling users where to switch languages"
					>
						Use the language switcher in the top-right corner to switch between
						Simplified Chinese and English.
					</Translate>
				</div>
			</div>
			<Link to={docsUrl} style={noticeLinkStyle}>
				<Translate
					id="homepage.localization.openDocs"
					description="CTA button in the homepage localization notice"
				>
					Open docs
				</Translate>
			</Link>
		</div>
	);
};

const Homepage: React.FC = () => {
	const pageTitle = translate({
		id: 'homepage.meta.title',
		description: 'Homepage title for the Chinese localization fork',
		message: 'Remotion Chinese localization',
	});

	const pageDescription = translate({
		id: 'homepage.meta.description',
		description: 'Homepage description for the Chinese localization fork',
		message:
			'A Simplified Chinese localization fork of Remotion with a switchable English interface.',
	});

	return (
		<Layout title={pageTitle} description={pageDescription}>
			<LocalizationNotice />
			<Inner />
		</Layout>
	);
};

export default Homepage;
