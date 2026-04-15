import {getForkConfig} from './fork-config';

export const getLatestRemotionVersion = async () => {
	return getForkConfig().version;
};
