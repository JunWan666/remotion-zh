import React from 'react';
import {cmdOrCtrlCharacter} from '../error-overlay/remotion-overlay/ShortcutHint';
import {
	INPUT_BACKGROUND,
	INPUT_BORDER_COLOR_UNHOVERED,
} from '../helpers/colors';
import {areKeyboardShortcutsDisabled} from '../helpers/use-keybinding';
import {useStudioI18n} from '../i18n';
import {ArrowLeft, ArrowRight, ShiftIcon} from '../icons/keys';
import {Column, Row, Spacing} from './layout';

const left: React.CSSProperties = {
	width: 85,
	paddingTop: 8,
	paddingBottom: 8,
};

const key: React.CSSProperties = {
	background: INPUT_BACKGROUND,
	padding: '3px 6px',
	color: 'white',
	borderRadius: 3,
	border: '1px solid ' + INPUT_BORDER_COLOR_UNHOVERED,
	borderBottomWidth: 3,
	fontSize: 14,
	fontFamily: 'monospace',
};

const right: React.CSSProperties = {
	fontSize: 14,
	color: '#eee',
};

const container: React.CSSProperties = {
	paddingLeft: 20,
	paddingRight: 40,
	paddingTop: 10,
	paddingBottom: 10,
};

const title: React.CSSProperties = {
	fontWeight: 'bold',
	color: 'white',
	fontSize: 14,
	marginBottom: 10,
};

const keyboardShortcutsDisabled: React.CSSProperties = {
	padding: 12,
	width: '100%',
	fontSize: 14,
	backgroundColor: 'rgba(255, 255, 255, 0.1)',
};

const ul: React.CSSProperties = {
	marginTop: 0,
	marginBottom: 0,
};

const li: React.CSSProperties = {
	fontSize: 14,
};

export const KeyboardShortcutsExplainer: React.FC = () => {
	const {t} = useStudioI18n();

	return (
		<div>
			{areKeyboardShortcutsDisabled() ? (
				<div style={keyboardShortcutsDisabled}>
					{t('shortcutsDisabledIntro')}
					<ul style={ul}>
						<li style={li}>{t('shortcutsDisabledReasonA')}</li>
						<li style={li}>{t('shortcutsDisabledReasonB')}</li>
						<li style={li}>{t('shortcutsDisabledReasonC')}</li>
					</ul>
				</div>
			) : null}
			<Row style={container}>
				<Column>
					<div style={title}>{t('shortcutsSectionPlayback')}</div>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>
								<ShiftIcon />
							</kbd>
							<Spacing x={0.3} />
							<kbd style={key}>
								<ArrowLeft />
							</kbd>
						</div>
						<div style={right}>{t('shortcutsOneSecondBack')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>
								<ArrowLeft />
							</kbd>
						</div>
						<div style={right}>{t('shortcutsPreviousFrame')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>Space</kbd>
						</div>
						<div style={right}>{t('shortcutsPlayPause')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>
								<ArrowRight />
							</kbd>
						</div>
						<div style={right}>{t('shortcutsNextFrame')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>
								<ShiftIcon />
							</kbd>
							<Spacing x={0.3} />
							<kbd style={key}>
								<ArrowRight />
							</kbd>
						</div>
						<div style={right}>{t('shortcutsOneSecondForward')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>A</kbd>
						</div>
						<div style={right}>{t('shortcutsJumpToBeginning')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>E</kbd>
						</div>
						<div style={right}>{t('shortcutsJumpToEnd')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>J</kbd>
						</div>
						<div style={right}>{t('shortcutsReversePlayback')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>K</kbd>
						</div>
						<div style={right}>{t('shortcutsPause')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>L</kbd>
						</div>
						<div style={right}>{t('shortcutsPlaySpeedUp')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>G</kbd>
						</div>
						<div style={right}>{t('shortcutsGoToFrame')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>Enter</kbd>
						</div>
						<div style={right}>
							{t('shortcutsPauseAndReturnToPlaybackStart')}
						</div>
					</Row>
					<br />
					<div style={title}>{t('shortcutsSectionSidebar')}</div>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>{cmdOrCtrlCharacter}</kbd>
							<Spacing x={0.3} />
							<kbd style={key}>B</kbd>
						</div>
						<div style={right}>{t('shortcutsToggleLeftSidebar')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>{cmdOrCtrlCharacter}</kbd>
							<Spacing x={0.3} />
							<kbd style={key}>J</kbd>
						</div>
						<div style={right}>{t('shortcutsToggleRightSidebar')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>{cmdOrCtrlCharacter}</kbd>
							<Spacing x={0.3} />
							<kbd style={key}>G</kbd>
						</div>
						<div style={right}>{t('shortcutsToggleBothSidebars')}</div>
					</Row>
					<br />
					<div style={title}>{t('shortcutsSectionView')}</div>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>F</kbd>
						</div>
						<div style={right}>{t('shortcutsEnterFullscreen')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>Esc</kbd>
						</div>
						<div style={right}>{t('shortcutsExitFullscreen')}</div>
					</Row>
				</Column>
				<Spacing x={8} />
				<Column>
					<div style={title}>{t('shortcutsSectionNavigation')}</div>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>PageUp</kbd>
						</div>
						<div style={right}>{t('shortcutsPreviousComposition')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>PageDown</kbd>
						</div>
						<div style={right}>{t('shortcutsNextComposition')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>R</kbd>
						</div>
						<div style={right}>{t('shortcutsRenderComposition')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>T</kbd>
						</div>
						<div style={right}>
							{t('shortcutsToggleCheckerboardBackground')}
						</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>?</kbd>
						</div>
						<div style={right}>{t('shortcutsShowKeyboardShortcuts')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>{cmdOrCtrlCharacter}</kbd>
							<Spacing x={0.3} />
							<kbd style={key}>K</kbd>
						</div>
						<div style={right}>{t('shortcutsQuickSwitcher')}</div>
					</Row>
					<br />
					<div style={title}>{t('shortcutsSectionPlaybackRange')}</div>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>I</kbd>
						</div>
						<div style={right}>{t('shortcutsSetInPoint')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>O</kbd>
						</div>
						<div style={right}>{t('shortcutsSetOutPoint')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>X</kbd>
						</div>
						<div style={right}>{t('shortcutsClearInOutPoints')}</div>
					</Row>
					<br />
					<div style={title}>{t('shortcutsSectionZoom')}</div>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>+</kbd>
						</div>
						<div style={right}>{t('shortcutsZoomIn')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>-</kbd>
						</div>
						<div style={right}>{t('shortcutsZoomOut')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>0</kbd>
						</div>
						<div style={right}>{t('shortcutsResetZoom')}</div>
					</Row>{' '}
					<br />
					<div style={title}>{t('shortcutsSectionPropsEditor')}</div>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>{cmdOrCtrlCharacter}</kbd>
							<Spacing x={0.3} />
							<kbd style={key}>Z</kbd>
						</div>
						<div style={right}>{t('shortcutsUndo')}</div>
					</Row>
					<Row align="center">
						<div style={left}>
							<kbd style={key}>{cmdOrCtrlCharacter}</kbd>
							<Spacing x={0.3} />
							<kbd style={key}>Y</kbd>
						</div>
						<div style={right}>{t('shortcutsRedo')}</div>
					</Row>
					{process.env.ASK_AI_ENABLED && (
						<>
							<br />
							<div style={title}>{t('shortcutsSectionAi')}</div>
							<Row align="center">
								<div style={left}>
									<kbd style={key}>{cmdOrCtrlCharacter}</kbd>
									<Spacing x={0.3} />
									<kbd style={key}>I</kbd>
								</div>
								<div style={right}>{t('shortcutsAskAi')}</div>
							</Row>
						</>
					)}
				</Column>
			</Row>
		</div>
	);
};
