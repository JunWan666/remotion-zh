import React, {useCallback} from 'react';
import {useStudioI18n} from '../../i18n';
import {InputDragger} from '../NewComposition/InputDragger';
import {RightAlignInput} from '../NewComposition/RemInput';
import {label, optionRow, rightRow} from './layout';

const min = 0;

export const NumberOfLoopsSetting: React.FC<{
	readonly numberOfGifLoops: number;
	readonly setNumberOfGifLoops: React.Dispatch<React.SetStateAction<number>>;
}> = ({numberOfGifLoops, setNumberOfGifLoops}) => {
	const {t} = useStudioI18n();
	const onNumberOfGifLoopsChangedDirectly = useCallback(
		(newConcurrency: number) => {
			setNumberOfGifLoops(newConcurrency);
		},
		[setNumberOfGifLoops],
	);

	const onNumberOfGifLoopsChanged = useCallback(
		(e: string) => {
			setNumberOfGifLoops((q) => {
				const newConcurrency = parseInt(e, 10);
				if (Number.isNaN(newConcurrency)) {
					return q;
				}

				const newConcurrencyClamped = Math.max(newConcurrency, min);
				return newConcurrencyClamped;
			});
		},
		[setNumberOfGifLoops],
	);

	return (
		<div style={optionRow}>
			<div style={label}>{t('renderModalNumberOfLoops')}</div>
			<div style={rightRow}>
				<RightAlignInput>
					<InputDragger
						value={numberOfGifLoops}
						onTextChange={onNumberOfGifLoopsChanged}
						placeholder={`${min}-`}
						onValueChange={onNumberOfGifLoopsChangedDirectly}
						name="number-of-gif-loops"
						step={1}
						min={min}
						status="ok"
						rightAlign
					/>
				</RightAlignInput>
			</div>
		</div>
	);
};
