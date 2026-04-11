import type React from 'react';
import {useCallback, useContext, useEffect} from 'react';
import {Internals} from 'remotion';
import {StudioServerConnectionCtx} from '../helpers/client-id';
import {
	refreshDocumentTitle,
	setCurrentCanvasContentId,
	setRenderJobs,
} from '../helpers/document-title';
import {SHOW_BROWSER_RENDERING} from '../helpers/show-browser-rendering';
import {useKeybinding} from '../helpers/use-keybinding';
import {useStudioI18n} from '../i18n';
import {showNotification} from './Notifications/NotificationCenter';
import {RenderQueueContext} from './RenderQueue/context';

export const TitleUpdater: React.FC = () => {
	const renderQueue = useContext(RenderQueueContext);
	const {canvasContent} = useContext(Internals.CompositionManager);
	const {jobs} = renderQueue;
	const {locale} = useStudioI18n();

	useEffect(() => {
		if (!canvasContent) {
			setCurrentCanvasContentId(null);
			return;
		}

		if (canvasContent.type === 'composition') {
			setCurrentCanvasContentId(canvasContent.compositionId);
			return;
		}

		if (canvasContent.type === 'output') {
			setCurrentCanvasContentId(canvasContent.path);
			return;
		}

		if (canvasContent.type === 'output-blob') {
			setCurrentCanvasContentId(canvasContent.displayName);
			return;
		}

		setCurrentCanvasContentId(canvasContent.asset);
	}, [canvasContent]);

	useEffect(() => {
		setRenderJobs(jobs);
	}, [jobs]);

	useEffect(() => {
		refreshDocumentTitle();
	}, [locale]);

	return null;
};

export const CurrentCompositionKeybindings: React.FC<{
	readonly readOnlyStudio: boolean;
}> = ({readOnlyStudio}) => {
	const keybindings = useKeybinding();
	const video = Internals.useVideo();
	const {type} = useContext(StudioServerConnectionCtx).previewServerState;
	const {t} = useStudioI18n();

	const openRenderModal = useCallback(() => {
		if (!video) {
			return;
		}

		if (type !== 'connected' && !SHOW_BROWSER_RENDERING && !readOnlyStudio) {
			showNotification(t('notificationStudioServerOffline'), 2000);
			return;
		}

		const renderButton = document.getElementById(
			'render-modal-button',
		) as HTMLDivElement;

		renderButton.click();
	}, [readOnlyStudio, t, type, video]);

	useEffect(() => {
		const binding = keybindings.registerKeybinding({
			event: 'keydown',
			key: 'r',
			commandCtrlKey: false,
			callback: openRenderModal,
			preventDefault: true,
			triggerIfInputFieldFocused: false,
			keepRegisteredWhenNotHighestContext: false,
		});

		return () => {
			binding.unregister();
		};
	}, [keybindings, openRenderModal]);

	return null;
};
