import type {
	DownloadProgress,
	RenderingProgressInput,
	RenderJob,
	StitchingProgressInput,
} from '@remotion/studio-shared';
import React, {useCallback, useMemo} from 'react';
import {LIGHT_TEXT} from '../../helpers/colors';
import {useStudioI18n} from '../../i18n';
import {Spacing} from '../layout';
import {openInFileExplorer} from '../RenderQueue/actions';
import {CircularProgress} from '../RenderQueue/CircularProgress';
import {RenderQueueOpenInFinderItem} from '../RenderQueue/RenderQueueOpenInFolder';
import {SuccessIcon} from '../RenderQueue/SuccessIcon';

const progressItem: React.CSSProperties = {
	padding: 10,
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
};

const label: React.CSSProperties = {
	fontSize: 14,
	width: 400,
	color: 'white',
};

const right: React.CSSProperties = {
	fontSize: 14,
	color: LIGHT_TEXT,
	textAlign: 'right',
	flex: 1,
};

const BundlingProgress: React.FC<{
	readonly progress: number;
	readonly doneIn: number | null;
}> = ({progress, doneIn}) => {
	const {t} = useStudioI18n();
	return (
		<div style={progressItem}>
			{progress === 1 ? (
				<SuccessIcon />
			) : (
				<CircularProgress progress={progress} />
			)}
			<Spacing x={1} />
			<div style={label}>
				{progress === 1
					? t('renderProgressBundled')
					: t('renderProgressBundling', {progress: progress * 100})}
			</div>
			{doneIn ? <div style={right}>{doneIn}ms</div> : null}
		</div>
	);
};

const BrowserSetupProgress: React.FC<{
	readonly progress: number;
	readonly doneIn: number | null;
	readonly alreadyAvailable: boolean;
	readonly startedBundling: boolean;
	//	to ensure it only shows already available if we have moved to the next step
}> = ({progress, doneIn, startedBundling, alreadyAvailable}) => {
	const {t} = useStudioI18n();
	return (
		<div style={progressItem}>
			{progress === 1 || alreadyAvailable ? (
				<SuccessIcon />
			) : (
				<CircularProgress progress={progress} />
			)}
			<Spacing x={1} />
			<div style={label}>
				{alreadyAvailable && startedBundling
					? t('renderProgressBrowserAlreadyAvailable')
					: progress === 1
						? t('renderProgressDownloadedHeadlessShell')
						: t('renderProgressDownloadingHeadlessShell', {
								progress: Math.round(progress * 100),
							})}
			</div>
			{doneIn ? <div style={right}>{doneIn}ms</div> : null}
		</div>
	);
};

const RenderingProgress: React.FC<{
	readonly progress: RenderingProgressInput;
}> = ({progress}) => {
	const {t} = useStudioI18n();
	return (
		<div style={progressItem}>
			{progress.frames === progress.totalFrames ? (
				<SuccessIcon />
			) : (
				<CircularProgress progress={progress.frames / progress.totalFrames} />
			)}
			<Spacing x={1} />
			<div style={label}>
				{progress.doneIn
					? t('renderProgressRenderedFrames', {
							count: progress.totalFrames,
						})
					: t('renderProgressRenderingFrames', {
							current: progress.frames,
							total: progress.totalFrames,
						})}
			</div>
			{progress.doneIn ? <div style={right}>{progress.doneIn}ms</div> : null}
		</div>
	);
};

const StitchingProgress: React.FC<{
	readonly progress: StitchingProgressInput;
}> = ({progress}) => {
	const {t} = useStudioI18n();
	return (
		<div style={progressItem}>
			{progress.frames === progress.totalFrames ? (
				<SuccessIcon />
			) : (
				<CircularProgress progress={progress.frames / progress.totalFrames} />
			)}
			<Spacing x={1} />
			<div style={label}>
				{progress.doneIn
					? t('renderProgressEncodedFrames', {
							count: progress.totalFrames,
						})
					: t('renderProgressEncodingFrames', {
							current: progress.frames,
							total: progress.totalFrames,
						})}
			</div>
			{progress.doneIn ? <div style={right}>{progress.doneIn}ms</div> : null}
		</div>
	);
};

const DownloadsProgress: React.FC<{
	readonly downloads: DownloadProgress[];
}> = ({downloads}) => {
	const {t} = useStudioI18n();
	const allHaveProgress = downloads.every((a) => a.totalBytes);
	const totalBytes = allHaveProgress
		? downloads.reduce((a, b) => a + (b.totalBytes as number), 0)
		: null;
	const downloaded = allHaveProgress
		? downloads.reduce((a, b) => a + (b.downloaded as number), 0)
		: null;

	const progress = allHaveProgress
		? (downloaded as number) / (totalBytes as number)
		: 0.1;

	return (
		<div style={progressItem}>
			{progress === 1 ? (
				<SuccessIcon />
			) : (
				<CircularProgress progress={progress} />
			)}
			<Spacing x={1} />
			<div style={label}>
				{t('renderProgressDownloadingFiles', {count: downloads.length})}
			</div>
		</div>
	);
};

const OpenFile: React.FC<{
	readonly job: RenderJob;
}> = ({job}) => {
	const labelStyle = useMemo(() => {
		return {
			...label,
			textAlign: 'left' as const,
			appearance: 'none' as const,
			border: 0,
			paddingLeft: 0,
			cursor: job.deletedOutputLocation ? 'inherit' : 'pointer',
			textDecoration: job.deletedOutputLocation ? 'line-through' : 'none',
		};
	}, [job.deletedOutputLocation]);

	const onClick = useCallback(() => {
		openInFileExplorer({directory: job.outName});
	}, [job.outName]);

	return (
		<div style={progressItem}>
			<SuccessIcon />
			<Spacing x={1} />
			<button style={labelStyle} type="button" onClick={onClick}>
				{job.outName}
			</button>
			<div style={right}>
				<RenderQueueOpenInFinderItem job={job} />
			</div>
		</div>
	);
};

export const GuiRenderStatus: React.FC<{
	readonly job: RenderJob;
}> = ({job}) => {
	if (job.status === 'idle' || job.status === 'failed') {
		throw new Error(
			'This component should not be rendered when the job is idle',
		);
	}

	return (
		<div>
			<Spacing y={0.5} />
			<BrowserSetupProgress
				{...job.progress.browser}
				startedBundling={Boolean(job.progress.bundling)}
			/>
			{job.progress.bundling && (
				<BundlingProgress
					progress={job.progress.bundling.progress}
					doneIn={job.progress.bundling.doneIn}
				/>
			)}
			{job.progress.rendering ? (
				<RenderingProgress progress={job.progress.rendering} />
			) : null}
			{job.progress.stitching ? (
				<StitchingProgress progress={job.progress.stitching} />
			) : null}
			{job.progress.downloads.length > 0 ? (
				<DownloadsProgress downloads={job.progress.downloads} />
			) : null}
			{job.status === 'done' ? <OpenFile job={job} /> : null}
			<Spacing y={1} />
		</div>
	);
};
