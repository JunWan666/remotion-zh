import fs from 'node:fs';
import path from 'node:path';
import type {Template} from './templates';

const replaceIfExists = (
	fileName: string,
	replacements: Array<[searchValue: string, replaceValue: string]>,
) => {
	if (!fs.existsSync(fileName)) {
		return;
	}

	let contents = fs.readFileSync(fileName, 'utf8');

	for (const [searchValue, replaceValue] of replacements) {
		contents = contents.replace(searchValue, replaceValue);
	}

	fs.writeFileSync(fileName, contents);
};

export const localizeStarter = (projectRoot: string, template: Template) => {
	replaceIfExists(path.join(projectRoot, 'README.md'), [
		['# Remotion video', '# Remotion \u4e2d\u6587\u89c6\u9891\u9879\u76ee'],
		[
			'Welcome to your Remotion project!',
			'\u6b22\u8fce\u4f7f\u7528\u4f60\u7684 Remotion \u4e2d\u6587\u9879\u76ee\u3002',
		],
		['## Commands', '## \u5e38\u7528\u547d\u4ee4'],
		['**Install Dependencies**', '**\u5b89\u88c5\u4f9d\u8d56**'],
		['**Start Preview**', '**\u542f\u52a8\u9884\u89c8**'],
		['**Render video**', '**\u6e32\u67d3\u89c6\u9891**'],
		['**Upgrade Remotion**', '**\u5347\u7ea7 Remotion**'],
		['## Docs', '## \u6587\u6863'],
		[
			'Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).',
			'\u53ef\u4ee5\u5148\u9605\u8bfb [Remotion \u57fa\u7840\u6587\u6863](https://www.remotion.dev/docs/the-fundamentals) \u5f00\u59cb\u4f7f\u7528\u3002',
		],
		['## Help', '## \u83b7\u53d6\u5e2e\u52a9'],
		[
			'We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).',
			'\u4f60\u53ef\u4ee5\u5728 [Discord \u793e\u533a](https://discord.gg/6VzzNDwUwV) \u83b7\u53d6\u5e2e\u52a9\u3002',
		],
		['## Issues', '## \u95ee\u9898\u53cd\u9988'],
		[
			'Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).',
			'\u5982\u679c\u53d1\u73b0 Remotion \u7684\u95ee\u9898\uff0c\u53ef\u4ee5\u5728\u8fd9\u91cc\u63d0\u4ea4\uff1a[GitHub Issue](https://github.com/remotion-dev/remotion/issues/new)\u3002',
		],
		['## License', '## \u8bb8\u53ef\u8bc1'],
		[
			'Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).',
			'\u6ce8\u610f\uff1a\u90e8\u5206\u4f7f\u7528\u573a\u666f\u9700\u8981\u516c\u53f8\u8bb8\u53ef\u8bc1\u3002\u8be6\u60c5\u8bf7\u53c2\u9605 [LICENSE](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)\u3002',
		],
	]);

	if (template.cliId === 'blank') {
		replaceIfExists(path.join(projectRoot, 'src', 'Root.tsx'), [
			['id="MyComp"', 'id="\u4e3b\u89c6\u9891"'],
		]);
	}
};
