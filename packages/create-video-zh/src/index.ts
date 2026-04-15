import {listOfRemotionPackages} from './list-of-remotion-packages';
import {FEATURED_TEMPLATES} from './templates';

export const CreateVideoInternals = {
	FEATURED_TEMPLATES,
	listOfRemotionPackages,
};

export {Template} from './templates';

export default () => {
	throw new Error(
		'create-video-zh is a CLI tool only. Run `npx create-video-zh@latest`, `pnpm dlx create-video-zh` or `yarn dlx create-video-zh` instead!',
	);
};
