import {
	Document,
	DocumentView,
	Folder,
	Html,
	Json
} from '@carbon/react/icons';
import { getAllFragmentStyleClasses } from '@carbon-builder/player-react';
import { hasFragmentStyleClasses } from '../../../../../../../utils/fragment-tools';
import { format, getReactActionsMap } from '../../utils';
import {
	formatOptions,
	formatOptionsCss,
	getAdditionalCodeAsString,
	jsonToCarbonImports,
	jsonToTemplate,
	otherImportsFromComponentObj,
} from './utils';
import { classNameFromFragment, tagNameFromFragment } from '@carbon-builder/sdk-react';

const generateTemplate = (json: any, fragments: any[], customComponentsCollections: any[]) => {
	const carbonImports = jsonToCarbonImports(json);
	const carbonImportsString = carbonImports.reduce((string: string, curr: string) => (
		string += `${curr}, `
	), '');
	const actions = getReactActionsMap(json);

	return {
		imports: `import { ${carbonImportsString} } from '@carbon/react';
			${otherImportsFromComponentObj(json, fragments)}`,
		template: jsonToTemplate(json, actions.signals, actions.slots, fragments, customComponentsCollections),
		additionalCode: getAdditionalCodeAsString(json, fragments)
	};
};

const jsonToSharedComponents = (json: any, fragments: any[], globalStyleClasses: any, customComponentsCollections: any[]) => {
	let sharedComponents: any[] = [];

	if (json.type === 'fragment') {
		const fragment = fragments.find(f => f.id === json.fragmentId);
		const fragmentTemplate = generateTemplate(fragment.data, fragments, customComponentsCollections);

		sharedComponents.push({
			name: `${tagNameFromFragment(fragment)}.js`,
			code: format(`import React from 'react';
				${fragmentTemplate.imports};
				${hasFragmentStyleClasses(fragment) ? `
					import './${tagNameFromFragment(fragment)}.scss';
				` : ''}
				export const ${classNameFromFragment(fragment)} = ({state, setState}) => {
					const handleInputChange = (event) => {
						setState({...state, [event.target.name]: event.target.value});
					};

					${fragmentTemplate.additionalCode}

					return <>${fragmentTemplate.template}</>;
				};
			`, formatOptions),
			icon: Document
		});

		sharedComponents.push({
			name: `${tagNameFromFragment(fragment)}.scss`,
			code: format(
				`${getAllFragmentStyleClasses(fragment, [], globalStyleClasses).map((styleClass: any) => `.${styleClass.id} {
					${styleClass.content}
				}`).join('\n')}`,
				formatOptionsCss
			),
			icon: DocumentView
		});

		sharedComponents = [
			...sharedComponents,
			...jsonToSharedComponents(fragment.data, fragments, globalStyleClasses, customComponentsCollections)
		];
	}

	json.items?.forEach((item: any) => {
		sharedComponents = [
			...sharedComponents,
			...jsonToSharedComponents(item, fragments, globalStyleClasses, customComponentsCollections)
		];
	});

	return sharedComponents;
};

export const createReactApp = (fragment: any, fragments: any[], globalStyleClasses: any, customComponentsCollections: any[]) => {
	const fragmentTemplate = generateTemplate(fragment.data, fragments, customComponentsCollections);

	const sharedComponents = jsonToSharedComponents(fragment.data, fragments, globalStyleClasses, customComponentsCollections);

	const indexHtml = `<div id='root'></div>
`;
	const componentJs
		= `import React from 'react';
import './component.scss';
${fragmentTemplate.imports};
export const FragmentComponent = ({state, setState}) => {
	const handleInputChange = (event) => {
		setState({...state, [event.target.name]: event.target.value});
	};

	${fragmentTemplate.additionalCode}

	return <>${fragmentTemplate.template}</>;
};
`;

	const componentScss = `
@use '@carbon/react' with (
	$use-flexbox-grid: true
);

${getAllFragmentStyleClasses(fragment, [], globalStyleClasses).map((styleClass: any) => {
	if (!styleClass.content || !styleClass.content.trim()) {
		return null;
	}
	return `.${styleClass.id} {
		${styleClass.content}
	}`;
}).join('\n')}`;

	const indexJs
		= `import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';';

import { FragmentComponent } from './component.js';

const App = () => {
	const [state, setState] = useState({});

	return (
		<div>
			<FragmentComponent state={state} setState={setState} />
		</div>
	);
}

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);`;

	const packageJson = {
		dependencies: {
			'@carbon/react': '1.41.0',
			react: '18.2.0',
			'react-dom': '18.2.0',
			'sass': '1.45.0'
		}
	};

	return [
		{
			name: 'package.json',
			code: packageJson,
			icon: Json
		},
		{
			name: 'src',
			icon: Folder,
			isExpanded: true,
			items: [
				{
					name: 'index.html',
					code: indexHtml,
					icon: Html
				},
				{
					name: 'index.js',
					code: format(indexJs, formatOptions),
					icon: Document
				},
				{
					name: 'component.js',
					code: format(componentJs, formatOptions),
					icon: Document
				},
				{
					name: 'component.scss',
					code: format(componentScss, formatOptionsCss),
					icon: DocumentView
				},
				...(sharedComponents && sharedComponents.length > 0 ? [{
					name: 'shared',
					icon: Folder,
					isExpanded: true,
					items: sharedComponents
				}] : [])
			]
		}
	];
};
