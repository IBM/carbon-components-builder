import React from 'react';
import domtoimage from 'dom-to-image';
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import { createRoot } from 'react-dom/client';
import {
	UIFragment,
	Action,
	expandJsonToState,
	getAllFragmentStyleClasses,
	stringToCssClassName,
	allComponents as allUIComponents
} from '@carbon-builder/player-react';
import { camelCase, kebabCase, uniq, upperFirst } from 'lodash';
import { CURRENT_MODEL_VERSION } from './model-converter';

export let componentCounter = 2; // actually initialized (again) in Fragment TODO refactor this

export interface RenderProps {
	id: string;
	name: string;
	width?: number;
	height?: number;
	format?: string;
	preview?: { // only sent for preview
		format?: string; // optional
		width: number;
		height: number;
	};
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getRandomId = () => `${Math.random().toString().slice(2)}${Math.random().toString().slice(2)}`;

export const getUrlFromBlob = async (blob: any) => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.readAsDataURL(blob ? blob : new Blob());
		reader.onloadend = () => resolve(reader.result ? reader.result.toString() : '');
	});
};

export const getFragmentPreview = async (fragment: any, props: RenderProps) => {
	const element = document.createElement('div') as HTMLElement;
	element.className = 'render-preview';

	element.style.position = 'absolute';
	element.style.top = '0';
	element.style.left = '0';
	element.style.zIndex = '-1';
	element.style.backgroundColor = 'white';
	element.style.width = `${props.width || 800}px`;
	element.style.height = `${props.height || 400}px`;
	element.style.minHeight = `${props.height || 400}px`;
	const root = createRoot(element);
	root.render(
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		React.createElement(UIFragment, { state: fragment, setState: (_state: any) => {} })
	);
	document.body.appendChild(element);

	await sleep(100); // wait for render to finish

	const imageBlob = await domtoimage.toBlob(element as Node);
	(element as HTMLElement).remove();
	return imageBlob;
};

export const getFragmentPreviewUrl = async (fragment: any) => {
	const renderProps: RenderProps = {
		id: fragment.id,
		name: fragment.title,
		width: 800,
		height: 400,
		preview: {
			format: 'png',
			width: 330,
			height: 200
		}
	};

	const imageBlob = await getFragmentPreview(fragment, renderProps);
	return getUrlFromBlob(imageBlob);
};

export const drag = (event: any, dragObj: any) => {
	event.stopPropagation();
	event.dataTransfer.setData('drag-object', JSON.stringify(dragObj));
};

const draggableSelectorDirect = ':scope > [draggable]';
const draggableSelectorColumn = ':scope > .cds--col > [draggable]';
const draggableSelector = `${draggableSelectorDirect}, ${draggableSelectorColumn}`;

export const getParentComponent = (state: any, child: any) => {
	if (state && state.items) {
		if (state.items.includes(child)) {
			return state;
		}
		for (let i = 0; i < state.items.length; i++) {
			const component = state.items[i];
			const parent: any = getParentComponent(component, child);
			if (parent) {
				return parent;
			}
		}
	}

	return null;
};

const getUsedCollectionsNamesHelper = (componentObj: any, names: string[] = []) => {
	if (componentObj.componentsCollection) {
		names.push(componentObj.componentsCollection);
	}

	if (componentObj.items) {
		for (const co of componentObj.items) {
			names.concat(getUsedCollectionsNamesHelper(co, names));
		}
	}

	return names;
};

export const getNewCustomComponentsCollection = () => {
	return {
		name:  uniqueNamesGenerator({
			dictionaries: [adjectives, colors, animals],
			separator: '-',
			length: 3
		}),
		components: []
	};
};

export const getUsedCollectionsNames = (componentObj: any) => {
	return [...new Set(getUsedCollectionsNamesHelper(componentObj))];
};

export const getUsedCollectionsStyleUrls = (collections: any[], componentObj: any) => {
	const usedCollectionsNames = getUsedCollectionsNames(componentObj);

	if (!Array.isArray(collections)) {
		return;
	}

	return collections
		.filter((collection) => usedCollectionsNames.includes(collection.name))
		.flatMap((collection) => collection.styleUrls);
};

export const getUsedCollectionsAngularStylePaths = (collections: any[], componentObj: any) => {
	const usedCollectionsNames = getUsedCollectionsNames(componentObj);

	return collections
		?.filter((collection) => usedCollectionsNames.includes(collection.name))
		.flatMap((collection) => collection.angular?.stylePaths) || [];
};

export const getUsedCollectionsAngularStyleImportPaths = (collections: any[], componentObj: any) => {
	const usedCollectionsNames = getUsedCollectionsNames(componentObj);

	return collections
		?.filter((collection) => usedCollectionsNames.includes(collection.name))
		.flatMap((collection) => collection.angular?.styleImportPaths) || [];
};

export const getUsedCollectionsValuesByProp = (collections: any[], componentObj: any, propName: string) => {
	const usedCollectionsNames = getUsedCollectionsNames(componentObj);

	const keys = propName.split('.'); // used to get the value from the collection

	return collections
		?.filter((collection) => usedCollectionsNames.includes(collection.name))
		.reduce((result, collection) => ({
			...result,
			// i.e. for propName `"angular.dependencies"` gets the `collection.angular.dependencies`
			...keys.reduce((value, key) => value ? value[key] : undefined, collection)
		}), {});
};

export const getUsedCollectionsAngularDependencies = (collections: any[], componentObj: any) => {
	return getUsedCollectionsValuesByProp(collections, componentObj, 'angular.dependencies');
};

export const getCustomComponentByType = (componentType: string, collections: any[]) => {
	const allComponents = collections?.flatMap((collection) => collection.components || []) || [];

	return allComponents.find((component) => component.type === componentType);
};

const updatedList = (list: any[], item: any, dropInIndex?: number) => {
	if (dropInIndex === undefined) {
		return [...list, item];
	}

	return [...list.slice(0, dropInIndex), item, ...list.slice(dropInIndex)];
};

export const getHighestId = (componentObj: any) => {
	if (!componentObj) {
		return 0;
	}

	if (!componentObj.items || !componentObj.items.length) {
		return +componentObj.id || 0;
	}

	return Math.max(...componentObj.items.map((item: any) => getHighestId(item)), (+componentObj.id || 0));
};

export const updateComponentCounter = (componentObj: any) => {
	componentCounter = getHighestId(componentObj) + 1;
};

export const getNewId = () => {
	const id = '' + componentCounter++;

	// beyond 20 digits, js goes to scientific notation so we'd get collisions
	if (id.length > 20) {
		return getRandomId();
	}

	return id;
};

export const stateWithoutComponent = (state: any, componentId: number) => {
	if (state.items) {
		const componentIndex = state.items.findIndex((component: any) => component.id === componentId);
		if (componentIndex >= 0) {
			return {
				...state,
				items: [...state.items.slice(0, componentIndex), ...state.items.slice(componentIndex + 1)]
			};
		}

		return {
			...state,
			items: state.items.map((item: any) => stateWithoutComponent(item, componentId))
		};
	}

	return { ...state };
};

export const initializeIds = (componentObj: any, forceNewIds = false) => {
	let id = null;
	if (forceNewIds) {
		id = getNewId();
	}
	id = id || componentObj.id || getNewId();
	// name is used in form items and for angular inputs and outputs variable names
	let name = componentObj.codeContext?.name;
	if (name === undefined || forceNewIds) {
		name = `${componentObj.type}-${id}`;
	}

	return {
		...componentObj,
		id,
		items: componentObj.items ? componentObj.items.map((co: any) => initializeIds(co, forceNewIds)) : undefined,
		codeContext: {
			...componentObj.codeContext,
			name
		}
	};
};

export const updatedState = (state: any, dragObj: any, dropInId?: number, dropInIndex?: number) => {
	if (!state) { // NOTE is this needed?
		return;
	}

	// give unique ids to newly dropped components
	dragObj.component = initializeIds(dragObj.component);

	// only update
	if (dragObj.type === 'update') {
		if (state.id && state.id === dragObj.component.id) {
			return {
				...state,
				...dragObj.component
			};
		}
		if (state.items) {
			state.items = state.items.map((item: any) => updatedState(item, dragObj, dropInId, dropInIndex));
		}

		return { ...state };
	}

	if (dragObj.type === 'move') {
		state = stateWithoutComponent(state, dragObj.component.id);
		dragObj.type = 'insert';
	}

	if (state.items) {
		state.items = state.items.map((item: any) => updatedState(item, dragObj, dropInId, dropInIndex));
	}

	if (!dropInId) {
		return state.items && !state.type ? {
			...state,
			items: updatedList(state.items, dragObj.component, dropInIndex)
		} : { ...state };
	}
	/// ////////// TODO NOTE clean the container items with 1 item //////////////
	if (state.id && state.id === dropInId) {
		// add data into state
		if (state.items) {
			return {
				...state,
				items: updatedList(state.items, dragObj.component, dropInIndex),
				id: state.id
			};
		}

		// convert into a list of components, move current component into list
		return {
			// TODO should this be a `type: container`?
			id: getNewId(),
			items: updatedList([{ ...state }], dragObj.component, dropInIndex)
		};
	}

	if (dropInId) { // probably don't wanna add it here since it didn't match anything and it should somewhere
		return { ...state };
	}

	return state.items ? {
		...state,
		items: updatedList(state.items, dragObj.component, dropInIndex)
	} : { ...state };
};

export const getComponentById = (componentObj: any, id: number) => {
	if (!componentObj || !id) {
		return undefined;
	}

	if (componentObj.id === id) {
		return componentObj;
	}

	if (componentObj.items) {
		for (let i = 0; i < componentObj.items.length; i++) {
			const component: any = getComponentById(componentObj.items[i], id);
			if (component) {
				return component;
			}
		}
	}

	return undefined;
};

export const hasMicroLayouts = (fragment: any): boolean => {
	if (fragment.type === 'fragment') {
		return true;
	}

	if (fragment.data) {
		return hasMicroLayouts(fragment.data);
	}

	if (fragment.items) {
		return fragment.items.some((item: any) => hasMicroLayouts(item));
	}

	return false;
};

export const getShallowFragmentJsonExport = (fragment: any, fragments: any[], styleClasses: any[]) => {
	return {
		version: CURRENT_MODEL_VERSION,
		id: fragment.id,
		lastModified: fragment.lastModified,
		title: fragment.title,
		data: fragment.data,
		cssClasses: fragment.cssClasses,
		allCssClasses: getAllFragmentStyleClasses(fragment, [], styleClasses),
		labels: fragment.labels
	};
};

export const getAllMicrolayoutIdsFromFragment = (fragment: any): any[] => {
	if (fragment.type === 'fragment') {
		return [fragment.fragmentId];
	}

	if (fragment.data) {
		return getAllMicrolayoutIdsFromFragment(fragment.data);
	}

	if (fragment.items) {
		return uniq(fragment.items
			.flatMap((item: any) => getAllMicrolayoutIdsFromFragment(item))
			.filter((item: any) => !!item));
	}

	return [];
};

export const getFragmentJsonExport = (fragment: any, fragments: any[], styleClasses: any[]) => {
	if (!hasMicroLayouts(fragment)) {
		return getShallowFragmentJsonExport(fragment, fragments, styleClasses);
	}

	// get all microlayouts
	const microlayoutIds = getAllMicrolayoutIdsFromFragment(fragment);

	const microlayouts = fragments.filter((f: any) => microlayoutIds.includes(f.id));

	return [
		getShallowFragmentJsonExport(fragment, fragments, styleClasses),
		...microlayouts
	];
};

export const getFragmentJsonExportString = (fragment: any, fragments: any[], styleClasses: any[]) => {
	return JSON.stringify(getFragmentJsonExport(fragment, fragments, styleClasses), null, 2);
};

export const getExpandedFragmentState = (fragment: any, fragments: any[] = [], styleClasses: any[] = []) => {
	return expandJsonToState(getFragmentJsonExport(fragment, fragments, styleClasses));
};

export const getSelectedComponent = (fragment: any) => {
	if (!fragment) {
		return undefined;
	}

	return getComponentById(fragment.data, fragment.selectedComponentId);
};

export const isHorizontalContainer = (containerElement: HTMLElement) => {
	const allChildrenElements = containerElement.querySelectorAll(draggableSelector);
	if (allChildrenElements.length <= 1) {
		console.info('TODO try to detect orientation from css somehow');
		return true;
	}
	const firstElement = allChildrenElements[0].getBoundingClientRect();
	const secondElement = allChildrenElements[1].getBoundingClientRect();

	return firstElement.bottom > secondElement.top; // the opposite would mean it's vertical container
};

export const getDropIndex = (event: any, containerElement: HTMLElement) => {
	const isHorizontal = isHorizontalContainer(containerElement);

	let dropIndex = 0;

	// find the index of the element user was hovering when dropping
	const iterate = (selector: string, useParentRect = false) => {
		const elements = containerElement.querySelectorAll(selector);
		for (let i = 0; i < elements.length; i++) {
			let rect: any;
			if (useParentRect) {
				rect = elements[i].parentElement?.getBoundingClientRect();
			} else {
				rect = elements[i].getBoundingClientRect();
			}

			if (
				event.clientX > rect.left
				&& event.clientX < rect.right
				&& event.clientY > rect.top
				&& event.clientY < rect.bottom
			) {
				const start = isHorizontal ? rect.left : rect.top;
				const end = isHorizontal ? rect.right : rect.bottom;
				const size = end - start;
				const dropPosition = isHorizontal ? event.clientX : event.clientY;
				if (dropPosition < start + size / 2) {
					// we found the index!
					break;
				}
				dropIndex++;
				break;
			}
			dropIndex++;
		}
	};

	iterate(draggableSelectorDirect);
	iterate(draggableSelectorColumn, true);

	return dropIndex;
};

export const filenameToLanguage = (filename: string) => {
	const filenameLowercase = filename.toLowerCase();

	if (
		filenameLowercase.endsWith('ts') ||
		filenameLowercase.endsWith('tsx')
	) {
		return 'typescript';
	}

	if (
		filenameLowercase.endsWith('js') ||
		filenameLowercase.endsWith('jsx')
	) {
		return 'javascript';
	}

	if (
		filenameLowercase.endsWith('css') ||
		filenameLowercase.endsWith('scss')
	) {
		return 'scss';
	}

	if (
		filenameLowercase.endsWith('json')
	) {
		return 'json';
	}

	if (
		filenameLowercase.endsWith('html')
	) {
		return 'html';
	}

	return 'text';
};

export const reactClassNamesFromComponentObj = (componentObj: any) => {
	let classList = componentObj.cssClasses?.map((cc: any) => cc.id).join(' ') || '';

	if (componentObj.style) {
		if (classList.length > 0) {
			classList += ' ';
		}
		classList += stringToCssClassName(componentObj.codeContext.name);
	}

	return classList.length > 0
		? `className='${classList}'`
		: '';
};

export const angularClassNamesFromComponentObj = (componentObj: any) => {
	let classList = componentObj.cssClasses?.map((cc: any) => cc.id).join(' ') || '';

	if (componentObj.style) {
		if (classList.length > 0) {
			classList += ' ';
		}
		classList += stringToCssClassName(componentObj.codeContext.name);
	}

	return classList.length > 0
		? `class='${classList}'`
		: '';
};

export const nameStringToVariableString = (name: string) => camelCase(name);

export const tagNameFromFragment = (fragment: any) => {
	// TODO fragment can have a tag name?
	return kebabCase(fragment.title);
};

export const classNameFromFragment = (fragment: any) => {
	// TODO fragment can have a class name?
	return upperFirst(camelCase(fragment.title));
};

export const signalsFromType = (type: string) => {
	for (const component of Object.values(allUIComponents) as any[]) {
		if (component.type === type) {
			return component.signals || [];
		}
	}
	return [];
};

export const allComponentsFromComponent = (componentObj: any) => {
	let components: any[] = [];
	if (componentObj.items) {
		components = [
			...componentObj.items,
			...componentObj.items.flatMap((item: any) => allComponentsFromComponent(item)).filter((item: any) => !!item)
		];
	}
	return components;
};

export const allComponentsFromFragment = (fragment: any) => {
	return allComponentsFromComponent(fragment.data);
};

export const actionDestinationsFromFragment = (fragment: any, _action: Action) => {
	const componentsWithSlots = (Object.values(allUIComponents) as any[]).filter((component: any) => !!component.slots);

	return allComponentsFromFragment(fragment)
		.filter((componentObj: any) => componentsWithSlots.find((componentWithSlot: any) => componentWithSlot.type === componentObj.type))
		.map((componentObj: any) => ({ text: componentObj.codeContext?.name || `[${componentObj.type}-${componentObj.id}]`, id: componentObj.id }))
		.sort((a: any, b: any) => a.text < b.text ? -1 : 1);
};

export const slotsFromFragmentSignalAndDestination = (fragment: any, sourceId: number, signal: string, destinationId: number) => {
	// get sourceType from source id - USED FOR NOT YET SUPPORTED SIGNAL PARAMS
	// const sourceComponent = getComponentById(fragment.data, sourceId);
	// if (!sourceComponent) {
	// 	return [];
	// }

	// get signal params from sourceType and signal - NOT YET SUPPORTED

	// get destinationType from destination id
	const destinationComponent = getComponentById(fragment.data, destinationId);
	if (!destinationComponent) {
		return [];
	}

	// get destination slots compatible with signal
	const destinationModule = (Object.values(allUIComponents) as any[]).find((component: any) => component.type === destinationComponent.type);
	// TODO filter based on params - NOT YET SUPPORTED
	return Object.keys(destinationModule?.slots || {});
};

export const slotsFromType = (type: string) => {
	for (const component of Object.values(allUIComponents) as any[]) {
		if (component.type === type) {
			return component.slots || [];
		}
	}
	return [];
};

export const getReactCodeForActions = (signals: any, slots: any, codeContextName: string) => {
	let codeForActions = '';
	if (codeContextName) {
		if (signals[codeContextName]) {
			Object.keys(signals[codeContextName]).forEach(eventName => {
				codeForActions +=
				`${eventName}={() => {${getReactEventHandlerStatements(signals[codeContextName][eventName])}}}`;
			});
		}
		if (slots[codeContextName]) {
			slots[codeContextName].forEach((slot: string) => {
				if (getPropertyName(slot)) {
					codeForActions += `${getPropertyName(slot)}={state["${codeContextName}"]?.${getPropertyName(slot)}}`;
				}
			});
		}
	}
	return codeForActions;
};

export const getReactEventHandlerStatements = (signalEventActions: any) => {
	let setStateStatements = 'setState({...state,';
	Object.keys(signalEventActions).forEach((destination: any, destinationIndex: number) => {
		setStateStatements += `"${destination}": {
			...state["${destination}"],`;
		signalEventActions[destination].forEach((slot: string, propertyIndex: number) => {
			const isLast = propertyIndex !== signalEventActions[destination].length - 1;
			setStateStatements += `${getNewState(slot, destination)}${isLast ? ', ' : ''}`;
		});
		const isLast = destinationIndex === Object.keys(signalEventActions).length - 1;
		setStateStatements += isLast ? '}' : '},';
	});
	setStateStatements += '})';
	return setStateStatements;
};

export const getNewState = (slot: string, codeContextName: string) => {
	switch (slot) {
		case 'disable':
			return 'disabled: true';
		case 'enable':
			return 'disabled: false';
		case 'toggleDisabled':
			return `disabled: !state["${codeContextName}"].disabled`;
		case 'hide':
			return `hidden: true`;
		case 'show':
			return `hidden: false`;
		case 'toggleVisibility':
			return `hidden: !state["${codeContextName}"].hidden`;
		default:
			return '';
	}
}

export const getPropertyName = (slot: string) => {
	switch (slot) {
		case 'disable':
		case 'enable':
		case 'toggleDisabled':
			return 'disabled';
		case 'hide':
		case 'show':
		case 'toggleVisibility':
			return 'hidden';
		default:
			return '';
	}
}