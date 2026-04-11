import React from 'react';
import {LIGHT_TEXT} from '../../helpers/colors';
import {useStudioI18n} from '../../i18n';
import {renderQueueItemSubtitleStyle} from './item-style';

const cancelledStyle: React.CSSProperties = {
	...renderQueueItemSubtitleStyle,
	color: LIGHT_TEXT,
	cursor: 'default',
};

export const RenderQueueCancelledMessage: React.FC = () => {
	const {t} = useStudioI18n();
	return <span style={cancelledStyle}>{t('renderQueueCancelled')}</span>;
};
