import React, {useCallback, useMemo} from 'react';
import {BLUE, SELECTED_BACKGROUND} from '../../helpers/colors';
import {copyText} from '../../helpers/copy-text';
import {useStudioI18n} from '../../i18n';
import {CopyButton} from '../CopyButton';
import {KnownBugs} from '../KnownBugs';
import {Flex, Row, Spacing} from '../layout';
import {ModalHeader} from '../ModalHeader';
import {DismissableModal} from '../NewComposition/DismissableModal';
import {showNotification} from '../Notifications/NotificationCenter';
import type {Bug, UpdateInfo} from '../UpdateCheck';

const container: React.CSSProperties = {
	padding: 20,
	paddingTop: 0,
};

const text: React.CSSProperties = {
	fontSize: 14,
};

const title: React.CSSProperties = {
	paddingTop: 12,
	paddingBottom: 8,
	...text,
};

const code: React.CSSProperties = {
	background: SELECTED_BACKGROUND,
	padding: '12px 10px',
	fontSize: 14,
	marginTop: 10,
	marginBottom: 10,
};

const link: React.CSSProperties = {
	fontWeight: 'bold',
	color: BLUE,
	textDecoration: 'none',
	...text,
};

const commands: {[key in UpdateInfo['packageManager']]: string} = {
	npm: 'npx remotion upgrade',
	yarn: 'yarn remotion upgrade',
	pnpm: 'pnpm exec remotion upgrade',
	bun: 'bun remotion upgrade',
	unknown: 'npx remotion upgrade',
};

export const UpdateModal: React.FC<{
	readonly info: UpdateInfo;
	readonly knownBugs: Bug[];
}> = ({info, knownBugs}) => {
	const {t} = useStudioI18n();
	const hasKnownBugs = useMemo(() => {
		return knownBugs && knownBugs?.length > 0;
	}, [knownBugs]);

	const command = commands[info.packageManager];

	const onClick = useCallback(() => {
		copyText(command).catch((err) => {
			showNotification(`Could not copy: ${err.message}`, 2000);
		});
	}, [command]);

	return (
		<DismissableModal>
			<ModalHeader title={t('updateAvailableTitle')} />
			<div style={container}>
				{hasKnownBugs ? (
					<>
						<div style={title}>
							{t('updateCurrentVersionKnownBugs', {
								version: info.currentVersion,
							})}
						</div>
						<KnownBugs bugs={knownBugs as Bug[]} />
						<div style={{height: '20px'}} />
						<div style={text}>{t('updateRunCommandToUpgrade')}</div>
					</>
				) : (
					<div style={title}>{t('updateNewVersionAvailable')}</div>
				)}
				<Row align="center">
					<Flex>
						<pre onClick={onClick} style={code}>
							{command}
						</pre>
					</Flex>
					<Spacing x={1} />
					<CopyButton
						textToCopy={command}
						label={t('updateCopy')}
						labelWhenCopied={t('updateCopied')}
					/>
				</Row>
				<div style={text}>
					{t('updateUpgradeFromTo', {
						currentVersion: info.currentVersion,
						latestVersion: info.latestVersion,
					})}
				</div>
				<div style={text}>
					{t('updateReadTheReleaseNotesPrefix')}{' '}
					<a
						style={link}
						target="_blank"
						href="https://github.com/remotion-dev/remotion/releases"
					>
						{t('updateReleaseNotes')}
					</a>{' '}
					{t('updateWhatsNewInRemotion')}
				</div>
			</div>
		</DismissableModal>
	);
};
