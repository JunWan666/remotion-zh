import type {WebRendererQuality} from '@remotion/web-renderer';
import type {TranslationKey} from '../../i18n';
import {translate} from '../../i18n';
import {Checkmark} from '../../icons/Checkmark';
import type {ComboboxValue} from '../NewComposition/ComboBox';

const QUALITY_OPTIONS: {value: WebRendererQuality; labelKey: TranslationKey}[] =
	[
		{value: 'very-low', labelKey: 'qualityVeryLow'},
		{value: 'low', labelKey: 'qualityLow'},
		{value: 'medium', labelKey: 'qualityMedium'},
		{value: 'high', labelKey: 'qualityHigh'},
		{value: 'very-high', labelKey: 'qualityVeryHigh'},
	];

export const getQualityOptions = (
	selectedQuality: WebRendererQuality,
	setQuality: (quality: WebRendererQuality) => void,
): ComboboxValue[] => {
	return QUALITY_OPTIONS.map(({value, labelKey}) => ({
		label: translate(labelKey),
		onClick: () => setQuality(value),
		leftItem: selectedQuality === value ? <Checkmark /> : null,
		id: value,
		keyHint: null,
		quickSwitcherLabel: null,
		subMenu: null,
		type: 'item' as const,
		value,
	}));
};
