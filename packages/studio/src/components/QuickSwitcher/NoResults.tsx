import React from 'react';
import {LIGHT_TEXT} from '../../helpers/colors';
import {useStudioI18n} from '../../i18n';

const container: React.CSSProperties = {
	padding: 80,
	color: LIGHT_TEXT,
	textAlign: 'center',
	fontSize: 14,
};

export type QuickSwitcherMode = 'commands' | 'compositions' | 'docs';

export const QuickSwitcherNoResults: React.FC<{
	readonly query: string;
	readonly mode: QuickSwitcherMode;
}> = ({query, mode}) => {
	const {t} = useStudioI18n();
	const scope =
		mode === 'commands'
			? t('quickSwitcherScopeCommands')
			: mode === 'compositions'
				? t('quickSwitcherScopeCompositions')
				: t('quickSwitcherScopeDocumentation');

	return (
		<div style={container}>{t('quickSwitcherNoResults', {scope, query})}</div>
	);
};
