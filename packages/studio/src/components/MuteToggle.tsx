import {useCallback} from 'react';
import {useStudioI18n} from '../i18n';
import {VolumeOffIcon, VolumeOnIcon} from '../icons/media-volume';
import {persistMuteOption} from '../state/mute';
import {ControlButton} from './ControlButton';

export const MuteToggle: React.FC<{
	muted: boolean;
	setMuted: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({muted, setMuted}) => {
	const {t} = useStudioI18n();
	const onClick = useCallback(() => {
		setMuted((m) => {
			persistMuteOption(!m);
			return !m;
		});
	}, [setMuted]);
	const accessibilityLabel = muted
		? t('previewUnmuteVideo')
		: t('previewMuteVideo');

	return (
		<ControlButton
			title={accessibilityLabel}
			aria-label={accessibilityLabel}
			onClick={onClick}
		>
			{muted ? <VolumeOffIcon /> : <VolumeOnIcon />}
		</ControlButton>
	);
};
