import {useContext, useMemo} from 'react';
import {Internals} from 'remotion';
import {NoReactInternals} from 'remotion/no-react';
import {restartStudio} from '../api/restart-studio';
import {askAiModalRef} from '../components/AskAiModal';
import {Row} from '../components/layout';
import type {Menu} from '../components/Menu/MenuItem';
import type {
	ComboboxValue,
	SelectionItem,
} from '../components/NewComposition/ComboBox';
import {showNotification} from '../components/Notifications/NotificationCenter';
import type {TQuickSwitcherResult} from '../components/QuickSwitcher/QuickSwitcherResult';
import {getPreviewSizeLabel, getUniqueSizes} from '../components/SizeSelector';
import {inOutHandles} from '../components/TimelineInOutToggle';
import {cmdOrCtrlCharacter} from '../error-overlay/remotion-overlay/ShortcutHint';
import {type StudioLocale, useStudioI18n} from '../i18n';
import {Checkmark} from '../icons/Checkmark';
import {drawRef} from '../state/canvas-ref';
import {CheckerboardContext} from '../state/checkerboard';
import {EditorShowGuidesContext} from '../state/editor-guides';
import {EditorShowRulersContext} from '../state/editor-rulers';
import {EditorZoomGesturesContext} from '../state/editor-zoom-gestures';
import type {ModalState} from '../state/modals';
import {ModalsContext} from '../state/modals';
import type {SidebarCollapsedState} from '../state/sidebar';
import {SidebarContext} from '../state/sidebar';
import {checkFullscreenSupport} from './check-fullscreen-support';
import {StudioServerConnectionCtx} from './client-id';
import {getGitMenuItem} from './get-git-menu-item';
import {useMobileLayout} from './mobile-layout';
import {openInEditor} from './open-in-editor';
import {pickColor} from './pick-color';
import {SHOW_BROWSER_RENDERING} from './show-browser-rendering';
import {areKeyboardShortcutsDisabled} from './use-keybinding';

type Structure = Menu[];
type Translate = ReturnType<typeof useStudioI18n>['t'];

const openExternal = (link: string) => {
	window.open(link, '_blank');
};

const rotate: React.CSSProperties = {
	transform: `rotate(90deg)`,
};
const ICON_SIZE = 16;

const getFileMenu = ({
	readOnlyStudio,
	closeMenu,
	previewServerState,
	setSelectedModal,
	t,
}: {
	readOnlyStudio: boolean;
	closeMenu: () => void;
	previewServerState: 'connected' | 'init' | 'disconnected';
	setSelectedModal: (value: React.SetStateAction<ModalState | null>) => void;
	t: Translate;
}) => {
	const items: ComboboxValue[] = [
		window.remotion_isReadOnlyStudio
			? {
					id: 'input-props-override',
					value: 'input-props-override',
					label: t('menuSetInputProps'),
					onClick: () => {
						closeMenu();
						setSelectedModal({
							type: 'input-props-override',
						});
					},
					type: 'item' as const,
					keyHint: null,
					leftItem: null,
					subMenu: null,
					quickSwitcherLabel: t('menuOverrideInputProps'),
				}
			: null,
		readOnlyStudio
			? null
			: {
					id: 'render',
					value: 'render',
					label: t('menuRender'),
					onClick: () => {
						closeMenu();
						if (previewServerState !== 'connected') {
							showNotification(t('notificationRestartStudioToRender'), 2000);
							return;
						}

						const renderButton = document.getElementById(
							'render-modal-button-server',
						) as HTMLButtonElement;

						renderButton.click();
					},
					type: 'item' as const,
					keyHint: 'R',
					leftItem: null,
					subMenu: null,
					quickSwitcherLabel: t('menuRender'),
				},
		SHOW_BROWSER_RENDERING && !readOnlyStudio
			? {
					id: 'render-on-web',
					value: 'render-on-web',
					label: t('menuRenderOnWeb'),
					onClick: () => {
						closeMenu();

						const renderButton = document.getElementById(
							'render-modal-button-client',
						) as HTMLButtonElement;

						renderButton.click();
					},
					type: 'item' as const,
					keyHint: null,
					leftItem: null,
					subMenu: null,
					quickSwitcherLabel: t('menuRenderOnWeb'),
				}
			: null,
		window.remotion_editorName && !readOnlyStudio
			? {
					type: 'divider' as const,
					id: 'open-in-editor-divider',
				}
			: null,
		window.remotion_editorName && !readOnlyStudio
			? {
					id: 'open-in-editor',
					value: 'open-in-editor',
					label: t('menuOpenInEditor', {
						editorName: window.remotion_editorName,
					}),
					onClick: async () => {
						await openInEditor({
							originalFileName: `${window.remotion_cwd}`,
							originalLineNumber: 1,
							originalColumnNumber: 1,
							originalFunctionName: null,
							originalScriptCode: null,
						})
							.then((res) => res.json())
							.then(({success}) => {
								if (!success) {
									showNotification(
										t('notificationCouldNotOpenEditor', {
											editorName: window.remotion_editorName,
										}),
										2000,
									);
								}
							})
							.catch((err) => {
								// eslint-disable-next-line no-console
								console.error(err);
								showNotification(
									t('notificationCouldNotOpenEditor', {
										editorName: window.remotion_editorName,
									}),
									2000,
								);
							});
					},
					type: 'item' as const,
					keyHint: null,
					leftItem: null,
					subMenu: null,
					quickSwitcherLabel: t('menuOpenInEditorQuick'),
				}
			: null,

		getGitMenuItem(),
	].filter(NoReactInternals.truthy);
	if (items.length === 0) {
		return null;
	}

	return {
		id: 'file' as const,
		label: t('menuFile'),
		leaveLeftPadding: false,
		items,
		quickSwitcherLabel: null,
	};
};

export const useMenuStructure = (
	closeMenu: () => void,
	readOnlyStudio: boolean,
) => {
	const {locale, setLocale, t} = useStudioI18n();
	const {setSelectedModal} = useContext(ModalsContext);
	const {checkerboard, setCheckerboard} = useContext(CheckerboardContext);
	const {editorZoomGestures, setEditorZoomGestures} = useContext(
		EditorZoomGesturesContext,
	);
	const {editorShowRulers, setEditorShowRulers} = useContext(
		EditorShowRulersContext,
	);
	const {editorShowGuides, setEditorShowGuides} = useContext(
		EditorShowGuidesContext,
	);
	const {size, setSize} = useContext(Internals.PreviewSizeContext);
	const {type} = useContext(StudioServerConnectionCtx).previewServerState;

	const {
		setSidebarCollapsedState,
		sidebarCollapsedStateLeft,
		sidebarCollapsedStateRight,
	} = useContext(SidebarContext);
	const sizes = useMemo(() => getUniqueSizes(size), [size]);

	const isFullscreenSupported = checkFullscreenSupport();

	const {remotion_packageManager} = window;

	const sizePreselectIndex = sizes.findIndex(
		(s) => String(size.size) === String(s.size),
	);

	const mobileLayout = useMobileLayout();
	const structure = useMemo((): Structure => {
		let struct: Structure = [
			{
				id: 'remotion' as const,
				label: (
					<Row align="center" justify="center">
						<svg
							width={ICON_SIZE}
							height={ICON_SIZE}
							viewBox="-100 -100 400 400"
							style={rotate}
						>
							<path
								fill="#fff"
								stroke="#fff"
								strokeWidth="100"
								strokeLinejoin="round"
								d="M 2 172 a 196 100 0 0 0 195 5 A 196 240 0 0 0 100 2.259 A 196 240 0 0 0 2 172 z"
							/>
						</svg>
					</Row>
				),
				leaveLeftPadding: false,
				items: [
					{
						id: 'about',
						value: 'about',
						label: t('menuAboutRemotion'),
						onClick: () => {
							closeMenu();
							openExternal('https://remotion.dev');
						},
						type: 'item' as const,
						keyHint: null,
						leftItem: null,
						subMenu: null,
						quickSwitcherLabel: t('menuAboutRemotion'),
					},
					{
						id: 'changelog',
						value: 'changelog',
						label: t('menuChangelog'),
						onClick: () => {
							closeMenu();
							openExternal('https://github.com/remotion-dev/remotion/releases');
						},
						type: 'item' as const,
						keyHint: null,
						leftItem: null,
						subMenu: null,
						quickSwitcherLabel: t('menuChangelog'),
					},
					{
						id: 'license',
						value: 'license',
						label: t('menuLicense'),
						onClick: () => {
							closeMenu();
							openExternal(
								'https://github.com/remotion-dev/remotion/blob/main/LICENSE.md',
							);
						},
						type: 'item' as const,
						keyHint: null,
						leftItem: null,
						subMenu: null,
						quickSwitcherLabel: t('menuLicense'),
					},
					{
						id: 'acknowledgements',
						value: 'acknowledgements',
						label: t('menuAcknowledgements'),
						onClick: () => {
							closeMenu();
							openExternal('https://remotion.dev/acknowledgements');
						},
						type: 'item' as const,
						keyHint: null,
						leftItem: null,
						subMenu: null,
						quickSwitcherLabel: t('menuAcknowledgements'),
					},
					{
						type: 'divider' as const,
						id: 'timeline-divider-1',
					},
					{
						id: 'restart-studio',
						value: 'restart-studio',
						label: t('menuRestartStudioServer'),
						onClick: () => {
							closeMenu();
							restartStudio();
						},
						type: 'item' as const,
						keyHint: null,
						leftItem: null,
						subMenu: null,
						quickSwitcherLabel: t('menuRestartStudioServer'),
					},
				],
				quickSwitcherLabel: null,
			},
			getFileMenu({
				readOnlyStudio,
				closeMenu,
				previewServerState: type,
				setSelectedModal,
				t,
			}),
			{
				id: 'view' as const,
				label: t('menuView'),
				leaveLeftPadding: true,
				items: [
					{
						id: 'preview-size',
						keyHint: null,
						label: t('menuPreviewSize'),
						onClick: () => undefined,
						type: 'item' as const,
						value: 'preview-size',
						leftItem: null,
						subMenu: {
							leaveLeftSpace: true,
							preselectIndex: sizePreselectIndex,
							items: sizes.map((newSize) => ({
								id: String(newSize.size),
								keyHint: newSize.size === 1 ? '0' : null,
								label: getPreviewSizeLabel(newSize, t),
								leftItem:
									String(newSize.size) === String(size.size) ? (
										<Checkmark />
									) : null,
								onClick: () => {
									closeMenu();
									setSize(() => newSize);
								},
								subMenu: null,
								type: 'item' as const,
								value: newSize.size,
								quickSwitcherLabel: null,
							})),
							quickSwitcherLabel: null,
						},
						quickSwitcherLabel: null,
					},
					{
						id: 'editor-zoom-gestures',
						keyHint: null,
						label: t('menuZoomAndPanGestures'),
						onClick: () => {
							closeMenu();
							setEditorZoomGestures((c) => !c);
						},
						type: 'item' as const,
						value: 'editor-zoom-gestures',
						leftItem: editorZoomGestures ? <Checkmark /> : null,
						subMenu: null,
						quickSwitcherLabel: editorZoomGestures
							? t('menuDisableZoomAndPanGestures')
							: t('menuEnableZoomAndPanGestures'),
					},
					{
						id: 'show-rulers',
						keyHint: null,
						label: t('menuShowRulers'),
						onClick: () => {
							closeMenu();
							setEditorShowRulers((c) => !c);
						},
						type: 'item' as const,
						value: 'show-ruler',
						leftItem: editorShowRulers ? <Checkmark /> : null,
						subMenu: null,
						quickSwitcherLabel: editorShowRulers
							? t('menuHideRulers')
							: t('menuShowRulers'),
					},
					{
						id: 'show-guides',
						keyHint: null,
						label: t('menuShowGuides'),
						onClick: () => {
							closeMenu();
							setEditorShowGuides((c) => !c);
						},
						type: 'item' as const,
						value: 'show-guides',
						leftItem: editorShowGuides ? <Checkmark /> : null,
						subMenu: null,
						quickSwitcherLabel: editorShowGuides
							? t('menuHideGuides')
							: t('menuShowGuides'),
					},
					{
						id: 'timeline-divider-1',
						type: 'divider' as const,
					},
					{
						id: 'left-sidebar',
						label: t('menuLeftSidebar'),
						keyHint: null,
						type: 'item' as const,
						value: 'preview-size',
						leftItem: null,
						quickSwitcherLabel: null,
						subMenu: {
							leaveLeftSpace: true,
							preselectIndex: 0,
							items: [
								{
									id: 'left-sidebar-responsive',
									keyHint: null,
									label: t('menuResponsive'),
									leftItem:
										sidebarCollapsedStateLeft === 'responsive' ? (
											<Checkmark />
										) : null,
									onClick: () => {
										closeMenu();
										setSidebarCollapsedState({
											left: 'responsive',
											right: null,
										});
									},
									subMenu: null,
									type: 'item' as const,
									value: 'responsive' as SidebarCollapsedState,
									quickSwitcherLabel: null,
								},
								{
									id: 'left-sidebar-expanded',
									keyHint: null,
									label: t('menuExpanded'),
									leftItem:
										sidebarCollapsedStateLeft === 'expanded' ? (
											<Checkmark />
										) : null,
									onClick: () => {
										closeMenu();
										setSidebarCollapsedState({left: 'expanded', right: null});
									},
									subMenu: null,
									type: 'item' as const,
									value: 'expanded' as SidebarCollapsedState,
									quickSwitcherLabel: t('menuExpand'),
								},
								{
									id: 'left-sidebar-collapsed',
									keyHint: null,
									label: t('menuCollapsed'),
									leftItem:
										sidebarCollapsedStateLeft === 'collapsed' ? (
											<Checkmark />
										) : null,
									onClick: () => {
										closeMenu();
										setSidebarCollapsedState({
											left: 'collapsed',
											right: null,
										});
									},
									subMenu: null,
									type: 'item' as const,
									value: 'collapsed' as SidebarCollapsedState,
									quickSwitcherLabel: t('menuCollapse'),
								},
							],
						},
						onClick: () => undefined,
					},
					{
						id: 'right-sidebar',
						label: t('menuRightSidebar'),
						keyHint: null,
						type: 'item' as const,
						value: 'preview-size',
						leftItem: null,
						quickSwitcherLabel: null,
						subMenu: {
							leaveLeftSpace: true,
							preselectIndex: 0,
							items: [
								{
									id: 'sidebar-expanded',
									keyHint: null,
									label: t('menuExpanded'),
									leftItem:
										sidebarCollapsedStateRight === 'expanded' ? (
											<Checkmark />
										) : null,
									onClick: () => {
										closeMenu();
										setSidebarCollapsedState({left: null, right: 'expanded'});
									},
									subMenu: null,
									type: 'item' as const,
									value: 'expanded' as SidebarCollapsedState,
									quickSwitcherLabel: t('menuExpand'),
								},
								{
									id: 'right-sidebar-collapsed',
									keyHint: null,
									label: t('menuCollapsed'),
									leftItem:
										sidebarCollapsedStateRight === 'collapsed' ? (
											<Checkmark />
										) : null,
									onClick: () => {
										closeMenu();
										setSidebarCollapsedState({
											left: null,
											right: 'collapsed',
										});
									},
									subMenu: null,
									type: 'item' as const,
									value: 'collapsed' as SidebarCollapsedState,
									quickSwitcherLabel: t('menuCollapse'),
								},
							],
						},
						onClick: () => undefined,
					},
					{
						id: 'language',
						label: t('menuLanguage'),
						keyHint: null,
						type: 'item' as const,
						value: 'language',
						leftItem: null,
						quickSwitcherLabel: null,
						subMenu: {
							leaveLeftSpace: true,
							preselectIndex: locale === 'zh' ? 0 : 1,
							items: (
								[
									{
										id: 'language-zh',
										label: t('localeChinese'),
										value: 'zh',
									},
									{
										id: 'language-en',
										label: t('localeEnglish'),
										value: 'en',
									},
								] as const
							).map((language) => ({
								id: language.id,
								keyHint: null,
								label: language.label,
								leftItem:
									locale === (language.value as StudioLocale) ? (
										<Checkmark />
									) : null,
								onClick: () => {
									closeMenu();
									setLocale(language.value as StudioLocale);
								},
								subMenu: null,
								type: 'item' as const,
								value: language.value,
								quickSwitcherLabel: null,
							})),
							quickSwitcherLabel: null,
						},
						onClick: () => undefined,
					},
					{
						id: 'timeline-divider-2',
						type: 'divider' as const,
					},
					{
						id: 'checkerboard',
						keyHint: 'T',
						label: t('menuTransparencyAsCheckerboard'),
						onClick: () => {
							closeMenu();
							setCheckerboard((c) => !c);
						},
						type: 'item' as const,
						value: 'checkerboard',
						leftItem: checkerboard ? <Checkmark /> : null,
						subMenu: null,
						quickSwitcherLabel: checkerboard
							? t('menuDisableCheckerboardTransparency')
							: t('menuEnableCheckerboardTransparency'),
					},
					{
						id: 'timeline-divider-3',
						type: 'divider' as const,
					},
					{
						id: 'quick-switcher',
						keyHint: `${cmdOrCtrlCharacter}+K`,
						label: t('menuQuickSwitcher'),
						onClick: () => {
							closeMenu();
							setSelectedModal({
								type: 'quick-switcher',
								mode: 'compositions',
								invocationTimestamp: Date.now(),
							});
						},
						type: 'item' as const,
						value: 'quick-switcher',
						leftItem: null,
						subMenu: null,
						quickSwitcherLabel: t('menuSwitchComposition'),
					},
					{
						id: 'in-out-divider-5',
						type: 'divider' as const,
					},
					{
						id: 'in-mark',
						keyHint: 'I',
						label: t('menuInMark'),
						leftItem: null,
						onClick: () => {
							closeMenu();
							inOutHandles.current?.inMarkClick(null);
						},
						subMenu: null,
						type: 'item' as const,
						value: 'in-mark',
						quickSwitcherLabel: t('menuInMark'),
					},
					{
						id: 'out-mark',
						keyHint: 'O',
						label: t('menuOutMark'),
						leftItem: null,
						onClick: () => {
							closeMenu();
							inOutHandles.current?.outMarkClick(null);
						},
						subMenu: null,
						type: 'item' as const,
						value: 'out-mark',
						quickSwitcherLabel: t('menuOutMark'),
					},
					{
						id: 'x-mark',
						keyHint: 'X',
						label: t('menuClearInOutMarks'),
						leftItem: null,
						onClick: () => {
							closeMenu();
							inOutHandles.current?.clearMarks();
						},
						subMenu: null,
						type: 'item' as const,
						value: 'clear-marks',
						quickSwitcherLabel: t('menuClearInOutMarks'),
					},
					{
						id: 'goto-time',
						keyHint: 'G',
						label: t('menuGoToFrame'),
						leftItem: null,
						onClick: () => {
							closeMenu();
							Internals.timeValueRef.current?.goToFrame();
						},
						subMenu: null,
						type: 'item' as const,
						value: 'clear-marks',
						quickSwitcherLabel: t('menuGoToFrame'),
					},
					{
						id: 'fullscreen-divider',
						type: 'divider' as const,
					},
					isFullscreenSupported
						? {
								id: 'fullscreen',
								keyHint: null,
								label: t('menuFullscreen'),
								leftItem: null,
								onClick: () => {
									closeMenu();
									drawRef.current?.requestFullscreen();
								},
								subMenu: null,
								type: 'item' as const,
								value: 'fullscreen',
								quickSwitcherLabel: t('menuGoFullscreen'),
							}
						: null,
				].filter(Internals.truthy),
			},
			{
				id: 'tools' as const,
				label: t('menuTools'),
				leaveLeftPadding: false,
				items: [
					process.env.ASK_AI_ENABLED
						? {
								id: 'ask-ai',
								value: 'ask-ai',
								label: t('menuAskAi'),
								onClick: () => {
									closeMenu();
									askAiModalRef.current?.toggle();
								},
								leftItem: null,
								keyHint: `${cmdOrCtrlCharacter}+I`,
								subMenu: null,
								type: 'item' as const,
								quickSwitcherLabel: t('menuAskAi'),
							}
						: null,
					'EyeDropper' in window
						? {
								id: 'color-picker',
								value: 'color-picker',
								label: t('menuColorPicker'),
								onClick: () => {
									closeMenu();
									pickColor();
								},
								leftItem: null,
								keyHint: null,
								subMenu: null,
								type: 'item' as const,
								quickSwitcherLabel: t('menuShowColorPicker'),
							}
						: null,
					{
						id: 'spring-editor',
						value: 'spring-editor',
						label: t('menuTimingEditor'),
						onClick: () => {
							closeMenu();
							window.open('https://www.remotion.dev/timing-editor', '_blank');
						},
						leftItem: null,
						keyHint: null,
						subMenu: null,
						type: 'item' as const,
						quickSwitcherLabel: t('menuOpenTimingEditor'),
					},
				].filter(Internals.truthy),
				quickSwitcherLabel: null,
			},
			readOnlyStudio || remotion_packageManager === 'unknown'
				? null
				: {
						id: 'install' as const,
						label: t('menuPackages'),
						leaveLeftPadding: false,
						items: [
							{
								id: 'install-packages',
								value: 'install-packages',
								label: t('menuInstall'),
								onClick: () => {
									closeMenu();
									setSelectedModal({
										type: 'install-packages',
										packageManager: remotion_packageManager,
									});
								},
								type: 'item' as const,
								keyHint: null,
								leftItem: null,
								subMenu: null,
								quickSwitcherLabel: t('menuInstall'),
							},
						],
					},
			{
				id: 'help' as const,
				label: t('menuHelp'),
				leaveLeftPadding: false,
				items: [
					{
						id: 'shortcuts',
						value: 'shortcuts',
						label: areKeyboardShortcutsDisabled()
							? t('menuShortcutsDisabled')
							: t('menuShortcuts'),
						onClick: () => {
							closeMenu();

							setSelectedModal({
								type: 'quick-switcher',
								mode: 'docs',
								invocationTimestamp: Date.now(),
							});
						},
						keyHint: '?',
						leftItem: null,
						subMenu: null,
						type: 'item' as const,
						quickSwitcherLabel: areKeyboardShortcutsDisabled()
							? t('menuShowAllKeyboardShortcutsDisabled')
							: t('menuShowAllKeyboardShortcuts'),
					},
					{
						id: 'docs',
						value: 'docs',
						label: t('menuDocs'),
						onClick: () => {
							closeMenu();
							openExternal('https://remotion.dev/docs');
						},
						type: 'item' as const,
						keyHint: null,
						leftItem: null,
						subMenu: null,
						quickSwitcherLabel: t('menuVisitDocumentation'),
					},
					{
						id: 'file-issue',
						value: 'file-issue',
						label: t('menuFileIssue'),
						onClick: () => {
							closeMenu();
							openExternal(
								'https://github.com/remotion-dev/remotion/issues/new/choose',
							);
						},
						type: 'item' as const,
						keyHint: null,
						leftItem: null,
						subMenu: null,
						quickSwitcherLabel: t('menuFileGitHubIssue'),
					},
					{
						id: 'discord',
						value: 'discord',
						label: t('menuJoinDiscordCommunity'),
						onClick: () => {
							closeMenu();
							openExternal('https://discord.com/invite/6VzzNDwUwV');
						},
						type: 'item' as const,
						keyHint: null,
						leftItem: null,
						subMenu: null,
						quickSwitcherLabel: null,
					},
					{
						id: 'help-divider-6',
						type: 'divider' as const,
					},
					{
						id: 'insta',
						value: 'insta',
						label: t('menuInstagram'),
						onClick: () => {
							closeMenu();
							openExternal('https://instagram.com/remotion');
						},
						type: 'item' as const,
						keyHint: null,
						leftItem: null,
						subMenu: null,
						quickSwitcherLabel: t('menuFollowInstagram'),
					},
					{
						id: 'x',
						value: 'x',
						label: t('menuX'),
						onClick: () => {
							closeMenu();
							openExternal('https://x.com/remotion');
						},
						type: 'item' as const,
						keyHint: null,
						leftItem: null,
						subMenu: null,
						quickSwitcherLabel: t('menuFollowX'),
					},
					{
						id: 'youtube',
						value: 'youtube',
						label: t('menuYouTube'),
						onClick: () => {
							closeMenu();
							openExternal('https://www.youtube.com/@remotion_dev');
						},
						type: 'item' as const,
						keyHint: null,
						leftItem: null,
						subMenu: null,
						quickSwitcherLabel: t('menuWatchYouTube'),
					},
					{
						id: 'linkedin',
						value: 'linkedin',
						label: t('menuLinkedIn'),
						onClick: () => {
							closeMenu();
							openExternal('https://www.linkedin.com/company/remotion-dev/');
						},
						type: 'item' as const,
						keyHint: null,
						leftItem: null,
						subMenu: null,
						quickSwitcherLabel: t('menuFollowLinkedIn'),
					},
					{
						id: 'tiktok',
						value: 'tiktok',
						label: t('menuTikTok'),
						onClick: () => {
							closeMenu();
							openExternal('https://www.tiktok.com/@remotion');
						},
						type: 'item' as const,
						keyHint: null,
						leftItem: null,
						subMenu: null,
						quickSwitcherLabel: t('menuFollowTikTok'),
					},
				],
			},
		].filter(Internals.truthy);
		if (mobileLayout) {
			struct = [
				{
					...struct[0],
					items: [
						...struct.slice(1).map((s) => {
							return {
								...s,
								keyHint: null,
								onClick: () => undefined,
								type: 'item' as const,
								value: s.id,
								leftItem: null,
								subMenu: {
									items: s.items,
									leaveLeftSpace: true,
									preselectIndex: 0,
								},
								quickSwitcherLabel: null,
							} as SelectionItem;
						}),
						...struct[0].items,
					],
				},
			];
		}

		return struct;
	}, [
		readOnlyStudio,
		closeMenu,
		type,
		sizePreselectIndex,
		sizes,
		editorZoomGestures,
		editorShowRulers,
		editorShowGuides,
		sidebarCollapsedStateLeft,
		sidebarCollapsedStateRight,
		checkerboard,
		isFullscreenSupported,
		remotion_packageManager,
		mobileLayout,
		size.size,
		setSize,
		setEditorZoomGestures,
		setEditorShowRulers,
		setEditorShowGuides,
		setSidebarCollapsedState,
		setCheckerboard,
		setSelectedModal,
		locale,
		setLocale,
		t,
	]);

	return structure;
};

const getItemLabel = (item: SelectionItem) => {
	if (item.quickSwitcherLabel !== null) {
		return item.quickSwitcherLabel;
	}

	if (typeof item.label === 'string') {
		return item.label;
	}

	return item.label?.toString() as string;
};

const itemToSearchResult = (
	item: SelectionItem,
	setSelectedModal: (value: React.SetStateAction<ModalState | null>) => void,
	prefixes: string[],
): TQuickSwitcherResult[] => {
	if (item.subMenu) {
		return item.subMenu.items
			.map((subItem) => {
				if (subItem.type === 'divider') {
					return null;
				}

				return itemToSearchResult(subItem, setSelectedModal, [
					...prefixes,
					getItemLabel(item),
				]);
			})
			.flat(1)
			.filter(NoReactInternals.truthy);
	}

	return [
		{
			type: 'menu-item',
			id: item.id,
			onSelected: () => {
				setSelectedModal(null);
				item.onClick(item.id, null);
			},
			title: [...prefixes, getItemLabel(item)].join(': '),
		},
	];
};

export const makeSearchResults = (
	actions: Structure,
	setSelectedModal: (value: React.SetStateAction<ModalState | null>) => void,
) => {
	const items: TQuickSwitcherResult[] = actions
		.map((menu) => {
			return menu.items.map((item): TQuickSwitcherResult[] | null => {
				if (item.type === 'divider') {
					return null;
				}

				return itemToSearchResult(item, setSelectedModal, []);
			});
		})
		.flat(Infinity)
		.filter(NoReactInternals.truthy) as TQuickSwitcherResult[];

	return items;
};
