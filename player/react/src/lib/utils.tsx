import React from 'react';
import { UIAccordion } from './components/ui-accordion';
import { UIAccordionItem } from './components/ui-accordion-item';
import { UIBreadcrumb } from './components/ui-breadcrumb';
import { UIBreadcrumbItem } from './components/ui-breadcrumb-item';
import { UIButton } from './components/ui-button';
import { UICheckbox } from './components/ui-checkbox';
import { UIClickableTile } from './components/ui-clickable-tile';
import { UICodeSnippet } from './components/ui-code-snippet';
import { UIColumn } from './components/ui-column';
import { UIComboBox } from './components/ui-combobox';
import { UIContentSwitcher } from './components/ui-content-switcher';
import { UIDropdown } from './components/ui-dropdown';
import { UIExpandableTile } from './components/ui-expandable-tile';
import { UIGrid } from './components/ui-grid';
import { UILink } from './components/ui-link';
import { UIInlineLoading } from './components/ui-inline-loading';
import { UILoading } from './components/ui-loading';
import { UINumberInput } from './components/ui-number-input';
import { UIOverflowMenu } from './components/ui-overflow-menu';
import { UIOverflowMenuItem } from './components/ui-overflow-menu-item';
import { UIProgressIndicator } from './components/ui-progress-indicator';
import { UIRadio } from './components/ui-radio';
import { UIRadioGroup } from './components/ui-radio-group';
import { UIRadioTileGroup } from './components/ui-radio-tile-group';
import { UIRow } from './components/ui-row';
import { UISelectableTile } from './components/ui-selectable-tile';
import { UISelectableTileGroup } from './components/ui-selectable-tile-group';
import { UISearchInput } from './components/ui-search-input';
import { UITag } from './components/ui-tag';
import { UIText } from './components/ui-text';
import { UITextAreaInput } from './components/ui-text-area';
import { UITextInput } from './components/ui-text-input';
import { UITile } from './components/ui-tile';
import { UITileFold } from './components/ui-tile-fold';
import { UIToggle } from './components/ui-toggle';
import { kebabCase } from 'lodash';
import { UITabs } from './components/ui-tabs';
import { SendSignal } from './types';

export const setItemInState = (item: any, state: any, setState: (state: any) => void) => {
	const itemIndex = state.items.findIndex((i: any) => i.id === item.id);

	setState({
		...state,
		items: [
			...state.items.slice(0, itemIndex),
			item,
			...state.items.slice(itemIndex + 1)
		]
	});
};

export const addIfNotExist = (arr: any[], items: any[]) => {
	items.forEach(item => {
		if (!arr.includes(item)) {
			arr.push(item);
		}
	});
	return arr;
};

export const jsonToState = (json: any, allFragments: any[]) => {
	if (json.type === 'fragment' && json.fragmentId) {
		const fragment = allFragments.find((fragment: any) => fragment.id === json.fragmentId);
		if (!fragment) {
			return {};
		}
		return {
			...fragment.data,
			allCssClasses: [...(fragment.allCssClasses || [])]
		};
	}

	if (json.data) {
		return {
			...json.data,
			allCssClasses: json.allCssClasses,
			items: json.data.items
				? json.data.items.map((item: any) => jsonToState(item, allFragments))
				: json.data.items
		};
	}

	return {
		...json,
		items: json.items
			? json.items.map((item: any) => jsonToState(item, allFragments))
			: json.items
	};
};

export const expandJsonToState = (json: any) => {
	if (!Array.isArray(json)) {
		return json;
	}

	const state = jsonToState(json[0], json);

	// add css from all the fragments to state
	const allCssClasses = [...state.allCssClasses];
	json.forEach((fragment: any) => {
		addIfNotExist(allCssClasses, (fragment.allCssClasses || []));
	});

	return {
		...state,
		allCssClasses
	};
};

export const styleObjectToString = (styleObj: any) => {
	if (!styleObj) {
		return '';
	}
	return `${styleObj.marginTop ? `margin-top: ${styleObj.marginTop.value || 0}${styleObj.marginTop.units || 'px'};` : ''}
		${styleObj.marginBottom ? `margin-bottom: ${styleObj.marginBottom.value || 0}${styleObj.marginBottom.units || 'px'};` : ''}
		${styleObj.marginLeft ? `margin-left: ${styleObj.marginLeft.value || 0}${styleObj.marginLeft.units || 'px'};` : ''}
		${styleObj.marginRight ? `margin-bottom: ${styleObj.marginRight.value || 0}${styleObj.marginRight.units || 'px'};` : ''}
		${styleObj.paddingTop ? `padding-top: ${styleObj.paddingTop.value || 0}${styleObj.paddingTop.units || 'px'};` : ''}
		${styleObj.paddingBottom ? `padding-bottom: ${styleObj.paddingBottom.value || 0}${styleObj.paddingBottom.units || 'px'};` : ''}
		${styleObj.paddingLeft ? `padding-left: ${styleObj.paddingLeft.value || 0}${styleObj.paddingLeft.units || 'px'};` : ''}
		${styleObj.paddingRight ? `padding-right: ${styleObj.paddingRight.value || 0}${styleObj.paddingRight.units || 'px'};` : ''}`.trim();
};

export const stringToCssClassName = (inputName: string) => `${kebabCase(inputName)}-style`;

export const getAllComponentStyleClasses = (componentObj: any, fragments: any[], globalStyleClasses: any[]) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	// const { styleClasses: globalStyleClasses } = useContext(GlobalStateContext) || { styleClasses: getGlobalStyleClassesFromLocalStorage() };
	let styleClasses: any = {};

	// convert into an object so all classes are unique
	componentObj.cssClasses?.forEach((cssClass: any) => {
		// NOTE do we need to merge them deeply?
		// update styleClasses content from global context
		styleClasses[cssClass.id] = globalStyleClasses?.find((gsc: any) => gsc.id === cssClass.id) || cssClass;
	});

	componentObj.items?.map((co: any) => {
		const coClasses = getAllComponentStyleClasses(co, fragments, globalStyleClasses);
		styleClasses = {
			...styleClasses,
			...coClasses
		};

		if (co.type === 'fragment') {
			const fragment = fragments.find(f => f.id === co.fragmentId);

			styleClasses = {
				...styleClasses,
				// we can't avoid this without a messy declare+reassign+export
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				...getAllFragmentStyleClasses(fragment || {}, fragments, globalStyleClasses)
			};
		}
	});

	if (componentObj.style) {
		const className = stringToCssClassName(componentObj.codeContext.name);

		styleClasses[className] = {
			id: className,
			name: className,
			content: styleObjectToString(componentObj.style)
		};
	}

	return styleClasses;
};

/**
 * Get all classes for the fragment
 * @param fragment Fragment to extract classes for
 * @param fragments All fragments available
 * @param globalStyleClasses globally available classes
 * @returns a list of objects containing css class ids and names
 */
export const getAllFragmentStyleClasses = (fragment: any, fragments: any[], globalStyleClasses: any[]) => {
	if (!fragment || !fragment.data) {
		return [];
	}

	const allClasses = {
		...getAllComponentStyleClasses(fragment, fragments, globalStyleClasses),
		...getAllComponentStyleClasses(fragment.data, fragments, globalStyleClasses)
	};
	return Object.values(allClasses);
};

export const isFragment = (json: any) => {
	return json.id
		&& json.title
		&& json.lastModified
		&& json.data
		&& Array.isArray(json.data?.items)
		|| json.id
		&& Array.isArray(json.items);
};

export const renderComponents = (
	state: any,
	setState: (state: any) => void,
	setGlobalState: (state: any) => void,
	sendSignal: SendSignal
) => {
	if (state.hidden) {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}
	switch (state.type) {
		case 'accordion':
			return <UIAccordion key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'accordion-item':
			return <UIAccordionItem key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'button':
			return <UIButton key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'breadcrumb':
			return <UIBreadcrumb key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'breadcrumb-item':
			return <UIBreadcrumbItem key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'checkbox':
			return <UICheckbox key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'code-snippet':
			return <UICodeSnippet key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'column':
			return <UIColumn key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'combobox':
			return <UIComboBox key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'content-switcher':
			return <UIContentSwitcher key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'dropdown':
			return <UIDropdown key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'grid':
			return <UIGrid key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'loading':
			return <UILoading key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'inline-loading':
			return <UIInlineLoading key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'radio-group':
			return <UIRadioGroup key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'radio':
			return <UIRadio key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'row':
			return <UIRow key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'link':
			return <UILink key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'number-input':
			return <UINumberInput key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'progress-indicator':
			return <UIProgressIndicator key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'search':
			return <UISearchInput key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'tag':
			return <UITag key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'text':
			return <UIText key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'text-area':
			return <UITextAreaInput key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'text-input':
			return <UITextInput key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'overflow-menu':
			return <UIOverflowMenu key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'overflow-menu-item':
			return <UIOverflowMenuItem key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'tile':
			return <UITile key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'tile-fold':
			return <UITileFold key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'clickable-tile':
			return <UIClickableTile key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'toggle':
			return <UIToggle key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'expandable-tile':
			return <UIExpandableTile key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'selectable-tile':
			return <UISelectableTile key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'selectable-tile-group':
			return <UISelectableTileGroup key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'radio-tile-group':
			return <UIRadioTileGroup key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;

		case 'tabs':
			return <UITabs key={state.id} state={state} sendSignal={sendSignal} setState={setState} setGlobalState={setGlobalState} />;
		default:
			break;
	}

	if (state.items && Array.isArray(state.items)) {
		// setItem is a setState for that particular item
		const setItem = (item: any) => setItemInState(item, state, setState);

		return state.items.map((item: any) => renderComponents(item, setItem, setState, sendSignal));
	}
};
