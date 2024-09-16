import React from 'react';
import {
	AccordionItem,
	Checkbox,
	TextInput
} from '@carbon/react';
import { AComponent, ComponentInfo } from '../a-component';
import { css, cx } from 'emotion';
import image from '../../assets/component-icons/accordion-item.svg';
import {
	getParentComponent,
	updatedState,
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../helpers/tools';
import { APlaceholder } from '../a-placeholder';
import { styleObjectToString } from '@carbon-builder/player-react';
import { Adder } from '../../helpers/adder';

export const AAccordionItemSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TextInput
			id='accordion-item-title-text-input'
			value={selectedComponent.title}
			labelText='Title'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					title: event.currentTarget.value
				});
			}} />
		<Checkbox
			labelText='Disabled'
			id='disabled'
			checked={selectedComponent.disabled}
			onChange={(_: any, { checked }: any) => {
				setComponent({
					...selectedComponent,
					disabled: checked
				});
			}} />
	</>;
};

export const AAccordionItemCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
	id='accordion-item-input-name-text-input'
	value={selectedComponent.codeContext?.name}
	labelText='Input name'
	onChange={(event: any) => {
		setComponent({
			...selectedComponent,
			codeContext: {
				...selectedComponent.codeContext,
				name: event.currentTarget.value
			}
		});
	}} />;

export const AAccordionItem = ({
	children,
	componentObj,
	selected,
	fragment,
	setFragment,
	...rest
}: any) => {
	const parentComponent = getParentComponent(fragment.data, componentObj);

	const addAccordionItem = (offset = 0) => setFragment({
		...fragment,
		data: updatedState(
			fragment.data,
			{
				type: 'insert',
				component: {
					type: 'accordion-item',
					title: 'New accordion item',
					items: []
				}
			},
			parentComponent.id,
			parentComponent.items.indexOf(componentObj) + offset
		)
	});

	return (
		<Adder
		active={selected}
		topAction={() => addAccordionItem()}
		bottomAction={() => addAccordionItem(1)}>
			<AComponent
			fragment={fragment}
			setFragment={setFragment}
			{...rest}
			componentObj={componentObj}
			selected={selected}>
				<AccordionItem
				title={componentObj.title}
				disabled={componentObj.disabled}
				className={cx(
					componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
					css`${styleObjectToString(componentObj.style)}`
				)}>
					{
						children && children.length > 0 ? children : <APlaceholder componentObj={componentObj} select={rest.select} />
					}
				</AccordionItem>
			</AComponent>
		</Adder>
	);
};

export const componentInfo: ComponentInfo = {
	component: AAccordionItem,
	hideFromElementsPane: true,
	settingsUI: AAccordionItemSettingsUI,
	codeUI: AAccordionItemCodeUI,
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents, outline, fragment, setFragment }) => <AAccordionItem
		key={componentObj.id}
		componentObj={componentObj}
		select={select}
		remove={remove}
		onDragOver={onDragOver}
		onDrop={onDrop}
		fragment={fragment}
		setFragment={setFragment}
		selected={selected}>
			{componentObj.items.map((child: any) => renderComponents(child, outline))}
	</AAccordionItem>,
	keywords: ['accordion', 'item'],
	name: 'Accordion item',
	type: 'accordion-item',
	defaultComponentObj: {
		type: 'accordionitem',
		title: 'Accordion item',
		disabled: false,
		items: []
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Title = "${json.title}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${!!json.disabled}`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Selected = new EventEmitter();`,
				imports: ['AccordionModule'],
				code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<cds-accordion-item
						[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
						[title]="${nameStringToVariableString(json.codeContext?.name)}Title"
						(selected)="${nameStringToVariableString(json.codeContext?.name)}Selected.emit($event)"
						${angularClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
					</cds-accordion-item>`;
				}
			},
			v10: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Title = "${json.title}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${!!json.disabled}`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Selected = new EventEmitter();`,
				imports: ['AccordionModule'],
				code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<ibm-accordion-item
						[disabled]="${nameStringToVariableString(json.codeContext?.name)}Disabled"
						[title]="${nameStringToVariableString(json.codeContext?.name)}Title"
						(selected)="${nameStringToVariableString(json.codeContext?.name)}Selected.emit($event)"
						${angularClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
					</ibm-accordion-item>`;
				}
			}
		},
		react: {
			latest: {
				imports: ['AccordionItem'],
				code: ({ json, signals, slots, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<AccordionItem
						title="${json.title || ''}"
						${json.disabled !== undefined ? `disabled={${json.disabled}}` : ''}
						${reactClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
					</AccordionItem>`;
				}
			},
			v10: {
				imports: ['AccordionItem'],
				code: ({ json, signals, slots, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<AccordionItem
						title="${json.title || ''}"
						${json.disabled !== undefined ? `disabled={${json.disabled}}` : ''}
						${reactClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
					</AccordionItem>`;
				}
			}
		}
	}
};
