import React from 'react';
import {useStudioI18n} from '../../i18n';
import {renderQueueItemSubtitleStyle} from './item-style';

const savingStyle: React.CSSProperties = {
	...renderQueueItemSubtitleStyle,
	cursor: 'default',
};

export const RenderQueueSavingMessage: React.FC = () => {
	const {t} = useStudioI18n();
	return <span style={savingStyle}>{t('clientRenderSaving')}</span>;
};
