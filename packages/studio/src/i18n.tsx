import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';

export type StudioLocale = 'zh' | 'en';

const DEFAULT_LOCALE: StudioLocale = 'zh';
const STORAGE_KEY = 'remotion.studioLocale';

const en = {
	localeChinese: '中文',
	localeEnglish: 'English',
	menuFile: 'File',
	menuView: 'View',
	menuTools: 'Tools',
	menuPackages: 'Packages',
	menuHelp: 'Help',
	menuAboutRemotion: 'About Remotion',
	menuChangelog: 'Changelog',
	menuLicense: 'License',
	menuAcknowledgements: 'Acknowledgements',
	menuRestartStudioServer: 'Restart Studio Server',
	menuSetInputProps: 'Set input props...',
	menuOverrideInputProps: 'Override input props',
	menuRender: 'Render...',
	menuRenderOnWeb: 'Render on web...',
	menuOpenInEditor: 'Open in {{editorName}}',
	menuOpenInEditorQuick: 'Open in editor...',
	menuPreviewSize: 'Preview size',
	menuZoomAndPanGestures: 'Zoom and Pan Gestures',
	menuDisableZoomAndPanGestures: 'Disable Zoom and Pan Gestures',
	menuEnableZoomAndPanGestures: 'Enable Zoom and Pan Gestures',
	menuShowRulers: 'Show Rulers',
	menuHideRulers: 'Hide Rulers',
	menuShowGuides: 'Show Guides',
	menuHideGuides: 'Hide Guides',
	menuLeftSidebar: 'Left Sidebar',
	menuRightSidebar: 'Right Sidebar',
	menuLanguage: 'Language',
	menuResponsive: 'Responsive',
	menuExpanded: 'Expanded',
	menuCollapsed: 'Collapsed',
	menuExpand: 'Expand',
	menuCollapse: 'Collapse',
	menuTransparencyAsCheckerboard: 'Transparency as checkerboard',
	menuDisableCheckerboardTransparency: 'Disable Checkerboard Transparency',
	menuEnableCheckerboardTransparency: 'Enable Checkerboard Transparency',
	menuQuickSwitcher: 'Quick Switcher',
	menuSwitchComposition: 'Switch composition',
	menuInMark: 'In Mark',
	menuOutMark: 'Out Mark',
	menuClearInOutMarks: 'Clear In/Out Marks',
	menuGoToFrame: 'Go to frame',
	menuFullscreen: 'Fullscreen',
	menuGoFullscreen: 'Go Fullscreen',
	menuAskAi: 'Ask AI',
	menuColorPicker: 'Color Picker',
	menuShowColorPicker: 'Show Color Picker',
	menuTimingEditor: 'Timing Editor',
	menuOpenTimingEditor: 'Open spring() Editor',
	menuInstall: 'Install...',
	menuShortcuts: 'Shortcuts',
	menuShortcutsDisabled: 'Shortcuts (disabled)',
	menuShowAllKeyboardShortcuts: 'Show all Keyboard Shortcuts',
	menuShowAllKeyboardShortcutsDisabled:
		'Show all Keyboard Shortcuts (disabled)',
	menuDocs: 'Docs',
	menuVisitDocumentation: 'Visit Documentation',
	menuFileIssue: 'File an issue',
	menuFileGitHubIssue: 'File GitHub issue',
	menuJoinDiscordCommunity: 'Join Discord community',
	menuInstagram: 'Instagram',
	menuFollowInstagram: 'Follow Remotion on Instagram',
	menuX: 'X',
	menuFollowX: 'Follow Remotion on X',
	menuYouTube: 'YouTube',
	menuWatchYouTube: 'Watch Remotion on YouTube',
	menuLinkedIn: 'LinkedIn',
	menuFollowLinkedIn: 'Follow Remotion on LinkedIn',
	menuTikTok: 'TikTok',
	menuFollowTikTok: 'Follow Remotion on TikTok',
	tabCompositions: 'Compositions',
	tabAssets: 'Assets',
	tabControls: 'Controls',
	tabProps: 'Props',
	tabRenders: 'Renders',
	compositionSearchPlaceholder: 'Search...',
	currentStill: 'Still',
	currentDuration: 'Duration {{duration}}',
	previewFit: 'Fit',
	previewSize: 'Preview Size',
	previewShowTransparencyAsCheckerboard: 'Show transparency as checkerboard',
	previewMuteVideo: 'Mute video',
	previewUnmuteVideo: 'Unmute video',
	previewLoopVideo: 'Loop video',
	previewEnterFullscreen: 'Enter fullscreen preview',
	sidebarToggleLeft: 'Toggle Left Sidebar',
	sidebarToggleRight: 'Toggle Right Sidebar',
	renderButtonRender: 'Render',
	renderButtonRenderViaCli: 'Render via CLI',
	renderButtonRenderOnWeb: 'Render on web',
	renderButtonServerSideRender: 'Server-side render',
	renderButtonClientSideRender: 'Client-side render',
	renderButtonCopyCliCommand:
		'Copy a CLI command to render this composition {{shortcut}}',
	renderButtonExportCurrentComposition:
		'Export the current composition {{shortcut}}',
	renderButtonConnectStudioServerToRender:
		'Connect to the Studio server to render',
	timelineMarkIn: 'Mark In',
	timelineMarkOut: 'Mark Out',
	timelineRightClickToClear: 'right click to clear',
	notificationRestartStudioToRender: 'Restart the studio to render',
	notificationCouldNotOpenEditor: 'Could not open {{editorName}}',
	notificationCannotUpdateDefaultPropsNoZod:
		'Cannot update default props: No Zod schema',
	notificationCannotUpdateDefaultPropsReason:
		'Cannot update default props: {{reason}}. See console for more information.',
	notificationCannotUpdateDefaultPropsError:
		'Cannot update default props: {{message}}',
	notificationStudioServerOffline: 'Studio server is offline',
	notificationRenderingFailed: 'Rendering "{{compositionId}}" failed',
	renderQueueServerDisconnected: 'The studio server has disconnected.',
	renderQueueEmpty: 'No renders in the queue.',
	quickSwitcherCompositions: 'Compositions',
	quickSwitcherActions: 'Actions',
	quickSwitcherDocumentation: 'Documentation',
	quickSwitcherSearchCompositions: 'Search compositions...',
	quickSwitcherNoResults: 'No {{scope}} matching "{{query}}"',
	quickSwitcherScopeCommands: 'commands',
	quickSwitcherScopeCompositions: 'compositions',
	quickSwitcherScopeDocumentation: 'documentation',
	shortcutsDisabledIntro: 'Keyboard shortcuts disabled either due to:',
	shortcutsDisabledReasonA: 'a) --disable-keyboard-shortcuts being passed',
	shortcutsDisabledReasonB:
		'b) Config.setKeyboardShortcutsEnabled(false) being set or',
	shortcutsDisabledReasonC: 'c) a Remotion version mismatch.',
	shortcutsSectionPlayback: 'Playback',
	shortcutsSectionSidebar: 'Sidebar',
	shortcutsSectionView: 'View',
	shortcutsSectionNavigation: 'Navigation',
	shortcutsSectionPlaybackRange: 'Playback range',
	shortcutsSectionZoom: 'Zoom',
	shortcutsSectionPropsEditor: 'Props Editor',
	shortcutsSectionAi: 'AI',
	shortcutsOneSecondBack: '1 second back',
	shortcutsPreviousFrame: 'Previous frame',
	shortcutsPlayPause: 'Play / Pause',
	shortcutsNextFrame: 'Next frame',
	shortcutsOneSecondForward: '1 second forward',
	shortcutsJumpToBeginning: 'Jump to beginning',
	shortcutsJumpToEnd: 'Jump to end',
	shortcutsReversePlayback: 'Reverse playback',
	shortcutsPause: 'Pause',
	shortcutsPlaySpeedUp: 'Play / Speed up',
	shortcutsGoToFrame: 'Go to frame',
	shortcutsPauseAndReturnToPlaybackStart: 'Pause & return to playback start',
	shortcutsToggleLeftSidebar: 'Toggle left sidebar',
	shortcutsToggleRightSidebar: 'Toggle right sidebar',
	shortcutsToggleBothSidebars: 'Toggle both sidebars',
	shortcutsEnterFullscreen: 'Enter fullscreen',
	shortcutsExitFullscreen: 'Exit fullscreen',
	shortcutsPreviousComposition: 'Previous composition',
	shortcutsNextComposition: 'Next composition',
	shortcutsRenderComposition: 'Render composition',
	shortcutsToggleCheckerboardBackground: 'Toggle checkerboard background',
	shortcutsShowKeyboardShortcuts: 'Show keyboard shortcuts',
	shortcutsQuickSwitcher: 'Quick Switcher',
	shortcutsSetInPoint: 'Set In Point',
	shortcutsSetOutPoint: 'Set Out Point',
	shortcutsClearInOutPoints: 'Clear In/Out Points',
	shortcutsZoomIn: 'Zoom in',
	shortcutsZoomOut: 'Zoom out',
	shortcutsResetZoom: 'Reset zoom',
	shortcutsUndo: 'Undo',
	shortcutsRedo: 'Redo',
	shortcutsAskAi: 'Ask AI',
	documentTitleProductName: 'Remotion Studio',
} as const;

const zh: Record<keyof typeof en, string> = {
	localeChinese: '中文',
	localeEnglish: 'English',
	menuFile: '文件',
	menuView: '视图',
	menuTools: '工具',
	menuPackages: '包',
	menuHelp: '帮助',
	menuAboutRemotion: '关于 Remotion',
	menuChangelog: '更新日志',
	menuLicense: '许可证',
	menuAcknowledgements: '鸣谢',
	menuRestartStudioServer: '重启 Studio 服务',
	menuSetInputProps: '设置输入 Props...',
	menuOverrideInputProps: '覆盖输入 Props',
	menuRender: '渲染...',
	menuRenderOnWeb: '在网页中渲染...',
	menuOpenInEditor: '在 {{editorName}} 中打开',
	menuOpenInEditorQuick: '在编辑器中打开...',
	menuPreviewSize: '预览尺寸',
	menuZoomAndPanGestures: '缩放与平移手势',
	menuDisableZoomAndPanGestures: '禁用缩放与平移手势',
	menuEnableZoomAndPanGestures: '启用缩放与平移手势',
	menuShowRulers: '显示标尺',
	menuHideRulers: '隐藏标尺',
	menuShowGuides: '显示参考线',
	menuHideGuides: '隐藏参考线',
	menuLeftSidebar: '左侧边栏',
	menuRightSidebar: '右侧边栏',
	menuLanguage: '语言',
	menuResponsive: '自适应',
	menuExpanded: '展开',
	menuCollapsed: '收起',
	menuExpand: '展开',
	menuCollapse: '收起',
	menuTransparencyAsCheckerboard: '将透明区域显示为棋盘格',
	menuDisableCheckerboardTransparency: '关闭棋盘格透明背景',
	menuEnableCheckerboardTransparency: '启用棋盘格透明背景',
	menuQuickSwitcher: '快速切换器',
	menuSwitchComposition: '切换合成',
	menuInMark: '入点标记',
	menuOutMark: '出点标记',
	menuClearInOutMarks: '清除入点/出点标记',
	menuGoToFrame: '跳转到帧',
	menuFullscreen: '全屏',
	menuGoFullscreen: '进入全屏',
	menuAskAi: '询问 AI',
	menuColorPicker: '取色器',
	menuShowColorPicker: '显示取色器',
	menuTimingEditor: '时间编辑器',
	menuOpenTimingEditor: '打开 spring() 编辑器',
	menuInstall: '安装...',
	menuShortcuts: '快捷键',
	menuShortcutsDisabled: '快捷键（已禁用）',
	menuShowAllKeyboardShortcuts: '显示全部快捷键',
	menuShowAllKeyboardShortcutsDisabled: '显示全部快捷键（已禁用）',
	menuDocs: '文档',
	menuVisitDocumentation: '查看文档',
	menuFileIssue: '提交问题',
	menuFileGitHubIssue: '提交 GitHub Issue',
	menuJoinDiscordCommunity: '加入 Discord 社区',
	menuInstagram: 'Instagram',
	menuFollowInstagram: '在 Instagram 关注 Remotion',
	menuX: 'X',
	menuFollowX: '在 X 上关注 Remotion',
	menuYouTube: 'YouTube',
	menuWatchYouTube: '在 YouTube 观看 Remotion',
	menuLinkedIn: 'LinkedIn',
	menuFollowLinkedIn: '在 LinkedIn 关注 Remotion',
	menuTikTok: 'TikTok',
	menuFollowTikTok: '在 TikTok 关注 Remotion',
	tabCompositions: '合成',
	tabAssets: '资源',
	tabControls: '控件',
	tabProps: '属性',
	tabRenders: '渲染',
	compositionSearchPlaceholder: '搜索...',
	currentStill: '静态图',
	currentDuration: '时长 {{duration}}',
	previewFit: '适应',
	previewSize: '预览尺寸',
	previewShowTransparencyAsCheckerboard: '以棋盘格显示透明区域',
	previewMuteVideo: '静音视频',
	previewUnmuteVideo: '取消静音',
	previewLoopVideo: '循环播放视频',
	previewEnterFullscreen: '进入全屏预览',
	sidebarToggleLeft: '切换左侧边栏',
	sidebarToggleRight: '切换右侧边栏',
	renderButtonRender: '渲染',
	renderButtonRenderViaCli: '通过 CLI 渲染',
	renderButtonRenderOnWeb: '在网页中渲染',
	renderButtonServerSideRender: '服务端渲染',
	renderButtonClientSideRender: '客户端渲染',
	renderButtonCopyCliCommand: '复制渲染当前合成的 CLI 命令 {{shortcut}}',
	renderButtonExportCurrentComposition: '导出当前合成 {{shortcut}}',
	renderButtonConnectStudioServerToRender: '请连接 Studio 服务后再渲染',
	timelineMarkIn: '标记入点',
	timelineMarkOut: '标记出点',
	timelineRightClickToClear: '右键清除',
	notificationRestartStudioToRender: '请先重启 Studio 再渲染',
	notificationCouldNotOpenEditor: '无法打开 {{editorName}}',
	notificationCannotUpdateDefaultPropsNoZod:
		'无法更新默认 Props：未找到 Zod schema',
	notificationCannotUpdateDefaultPropsReason:
		'无法更新默认 Props：{{reason}}。更多信息请查看控制台。',
	notificationCannotUpdateDefaultPropsError: '无法更新默认 Props：{{message}}',
	notificationStudioServerOffline: 'Studio 服务当前离线',
	notificationRenderingFailed: '渲染 "{{compositionId}}" 失败',
	renderQueueServerDisconnected: 'Studio 服务已断开连接。',
	renderQueueEmpty: '渲染队列为空。',
	quickSwitcherCompositions: '合成',
	quickSwitcherActions: '操作',
	quickSwitcherDocumentation: '文档',
	quickSwitcherSearchCompositions: '搜索合成...',
	quickSwitcherNoResults: '没有匹配 "{{query}}" 的{{scope}}',
	quickSwitcherScopeCommands: '命令',
	quickSwitcherScopeCompositions: '合成',
	quickSwitcherScopeDocumentation: '文档',
	shortcutsDisabledIntro: '快捷键已禁用，可能原因如下：',
	shortcutsDisabledReasonA: 'a) 传入了 --disable-keyboard-shortcuts 参数',
	shortcutsDisabledReasonB:
		'b) 设置了 Config.setKeyboardShortcutsEnabled(false)，或',
	shortcutsDisabledReasonC: 'c) Remotion 版本不匹配。',
	shortcutsSectionPlayback: '播放',
	shortcutsSectionSidebar: '边栏',
	shortcutsSectionView: '视图',
	shortcutsSectionNavigation: '导航',
	shortcutsSectionPlaybackRange: '播放区间',
	shortcutsSectionZoom: '缩放',
	shortcutsSectionPropsEditor: '属性编辑器',
	shortcutsSectionAi: 'AI',
	shortcutsOneSecondBack: '后退 1 秒',
	shortcutsPreviousFrame: '上一帧',
	shortcutsPlayPause: '播放 / 暂停',
	shortcutsNextFrame: '下一帧',
	shortcutsOneSecondForward: '前进 1 秒',
	shortcutsJumpToBeginning: '跳到开头',
	shortcutsJumpToEnd: '跳到结尾',
	shortcutsReversePlayback: '反向播放',
	shortcutsPause: '暂停',
	shortcutsPlaySpeedUp: '播放 / 加速',
	shortcutsGoToFrame: '跳转到帧',
	shortcutsPauseAndReturnToPlaybackStart: '暂停并回到播放起点',
	shortcutsToggleLeftSidebar: '切换左侧边栏',
	shortcutsToggleRightSidebar: '切换右侧边栏',
	shortcutsToggleBothSidebars: '切换两侧边栏',
	shortcutsEnterFullscreen: '进入全屏',
	shortcutsExitFullscreen: '退出全屏',
	shortcutsPreviousComposition: '上一个合成',
	shortcutsNextComposition: '下一个合成',
	shortcutsRenderComposition: '渲染当前合成',
	shortcutsToggleCheckerboardBackground: '切换棋盘格背景',
	shortcutsShowKeyboardShortcuts: '显示快捷键',
	shortcutsQuickSwitcher: '快速切换器',
	shortcutsSetInPoint: '设置入点',
	shortcutsSetOutPoint: '设置出点',
	shortcutsClearInOutPoints: '清除入点/出点',
	shortcutsZoomIn: '放大',
	shortcutsZoomOut: '缩小',
	shortcutsResetZoom: '重置缩放',
	shortcutsUndo: '撤销',
	shortcutsRedo: '重做',
	shortcutsAskAi: '询问 AI',
	documentTitleProductName: 'Remotion Studio',
};

const messages = {
	en,
	zh,
} as const;

export type TranslationKey = keyof typeof en;
type TranslationValues = string | number | boolean | null | undefined;
type TranslationParams = Record<string, TranslationValues>;

const formatMessage = (
	template: string,
	params: TranslationParams = {},
): string => {
	return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
		return String(params[key] ?? '');
	});
};

const isLocale = (value: string | null): value is StudioLocale => {
	return value === 'zh' || value === 'en';
};

const loadStoredLocale = (): StudioLocale => {
	if (typeof window === 'undefined') {
		return DEFAULT_LOCALE;
	}

	try {
		const value = window.localStorage.getItem(STORAGE_KEY);
		return isLocale(value) ? value : DEFAULT_LOCALE;
	} catch {
		return DEFAULT_LOCALE;
	}
};

const persistLocale = (locale: StudioLocale) => {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		window.localStorage.setItem(STORAGE_KEY, locale);
	} catch {
		// localStorage may not be available
	}
};

const setDocumentLang = (locale: StudioLocale) => {
	if (typeof document === 'undefined') {
		return;
	}

	document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
};

let currentLocale: StudioLocale =
	typeof window === 'undefined' ? DEFAULT_LOCALE : loadStoredLocale();

export const translateWithLocale = (
	locale: StudioLocale,
	key: TranslationKey,
	params?: TranslationParams,
) => {
	return formatMessage(messages[locale][key] ?? messages.en[key], params);
};

export const translate = (key: TranslationKey, params?: TranslationParams) => {
	return translateWithLocale(currentLocale, key, params);
};

const I18nContext = createContext<{
	locale: StudioLocale;
	setLocale: (locale: StudioLocale) => void;
	t: (key: TranslationKey, params?: TranslationParams) => string;
}>({
	locale: DEFAULT_LOCALE,
	setLocale: () => undefined,
	t: (key, params) => translateWithLocale(DEFAULT_LOCALE, key, params),
});

export const StudioI18nProvider: React.FC<{
	readonly children: React.ReactNode;
}> = ({children}) => {
	const [locale, setLocaleState] = useState<StudioLocale>(() =>
		loadStoredLocale(),
	);

	const setLocale = useCallback((nextLocale: StudioLocale) => {
		currentLocale = nextLocale;
		persistLocale(nextLocale);
		setDocumentLang(nextLocale);
		setLocaleState(nextLocale);
	}, []);

	useEffect(() => {
		currentLocale = locale;
		persistLocale(locale);
		setDocumentLang(locale);
	}, [locale]);

	const t = useCallback(
		(key: TranslationKey, params?: TranslationParams) => {
			return translateWithLocale(locale, key, params);
		},
		[locale],
	);

	const value = useMemo(() => {
		return {
			locale,
			setLocale,
			t,
		};
	}, [locale, setLocale, t]);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useStudioI18n = () => {
	return useContext(I18nContext);
};
