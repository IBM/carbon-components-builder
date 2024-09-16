import React from 'react';
import {
	Dropdown,
	TextInput,
	RadioButtonGroup
} from '@carbon/react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/radio-group.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../helpers/tools';
import { css, cx } from 'emotion';
import { styleObjectToString } from '@carbon-builder/player-react';

export const ARadioGroupSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const orientationItems = [
		{ id: 'horizontal', text: 'Horizontal' },
		{ id: 'vertical', text: 'Vertical' }
	];

	const labelPositions = [
		{ id: 'left', text: 'Left' },
		{ id: 'right', text: 'Right' }
	];

	const allItems = selectedComponent.items.map((item: any) => ({
		text: item.labelText,
		id: item.id,
		defaultChecked: item.defaultChecked
	}));
	allItems.push({ text: 'None', id: 'none', defaultChecked: true });
	return <>
		<TextInput
			value={selectedComponent.legend}
			labelText='Legend name'
			placeholder='Legend name'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					legend: event.currentTarget.value
				});
			}}
		/>
		<Dropdown
			label='Orientation'
			titleText='Orientation'
			items={orientationItems}
			selectedItem={orientationItems.find(item => item.id === selectedComponent.orientation)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				orientation: event.selectedItem.id
		})}/>
		<Dropdown
			label='Label position'
			titleText='Label position'
			items={labelPositions}
			selectedItem={labelPositions.find(item => item.id === selectedComponent.labelPosition)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				labelPosition: event.selectedItem.id
		})}/>
		<Dropdown
			label='Default selection'
			titleText='Default selection'
			items={allItems}
			selectedItem={allItems.find((item: any) => item.defaultChecked ? item : item.id === 'none')}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				defaultSelected: event.selectedItem.id,
				valueSelected: event.selectedItem.id,
				items: selectedComponent.items.map((item: any) => ({
					...item,
					defaultChecked: event.selectedItem.id === item.id
				}))
		})}/>
	</>;
};

export const ARadioGroupCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

export const ARadioGroup = ({
	children,
	componentObj,
	fragment,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		fragment={fragment}
		{...rest}>
			<RadioButtonGroup
			className={cx(
				componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
				css`${styleObjectToString(componentObj.style)}`
			)}
			legendText= {componentObj.legend}
			disabled= {componentObj.disabled}
			orientation={componentObj.orientation}
			defaultSelected={componentObj.defaultSelected}
			labelPosition={componentObj.labelPosition}
			name={componentObj.codeContext?.name}>
				{children}
			</RadioButtonGroup>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ARadioGroup,
	settingsUI: ARadioGroupSettingsUI,
	codeUI: ARadioGroupCodeUI,
	keywords: ['radio', 'button', 'group'],
	name: 'Radio buttons',
	type: 'radio-group',
	defaultComponentObj: {
		disabled: false,
		type: 'radio-group',
		legend: 'Radio group',
		defaultSelected: '',
		labelPosition: 'right',
		orientation: 'horizontal',
		items: [
			{
				type: 'radio',
				labelText: 'Option 1',
				disabled: false,
				defaultChecked: false
			},
			{
				type: 'radio',
				labelText: 'Option 2',
				disabled: false,
				defaultChecked: false
			},
			{
				type: 'radio',
				labelText: 'Option 3',
				disabled: false,
				defaultChecked: false
			}
		]
	},
	render: ({ componentObj, select, remove, selected, renderComponents, outline }) => <ARadioGroup
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
			{componentObj.items.map((button: any) => renderComponents(button, outline))}
	</ARadioGroup>,
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}LegendText = "${json.legend}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Orientation = "${json.orientation}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}LabelPosition = "${json.labelPosition}";
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Name = "${json.codeContext?.name}";`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter();`,
				imports: ['RadioModule'],
				code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<cds-radio-group
						[legend]="${nameStringToVariableString(json.codeContext?.name)}LegendText"
						[name]="${nameStringToVariableString(json.codeContext?.name)}Name"
						[orientation]="${nameStringToVariableString(json.codeContext?.name)}Orientation"
						[labelPlacement]="${nameStringToVariableString(json.codeContext?.name)}LabelPosition"
						(change)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)"
						${angularClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
					</cds-radio-group>`;
				}
			},
			v10: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}LegendText = "${json.legend}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Orientation = "${json.orientation}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}LabelPosition = "${json.labelPosition}";
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Name = "${json.codeContext?.name}";`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}ValueChange = new EventEmitter();`,
				imports: ['RadioModule'],
				code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<legend class="bx--label">{{${nameStringToVariableString(json.codeContext?.name)}LegendText}}</legend>
					<ibm-radio-group
						[name]="${nameStringToVariableString(json.codeContext?.name)}Name"
						[orientation]="${nameStringToVariableString(json.codeContext?.name)}Orientation"
						[labelPlacement]="${nameStringToVariableString(json.codeContext?.name)}LabelPosition"
						(change)="${nameStringToVariableString(json.codeContext?.name)}ValueChange.emit($event.value)"
						${angularClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
					</ibm-radio-group>`;
				}
			}
		},
		react: {
			latest: {
				imports: ['RadioButtonGroup'],
				code: ({ json, signals, slots, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<RadioButtonGroup
						name="${json.codeContext?.name}"
						legendText="${json.legend}"
						orientation="${json.orientation}"
						labelPosition="${json.labelPosition}"
						${json.defaultSelected !== undefined && json.defaultSelected !== '' ? `defaultSelected="${json.defaultSelected}"` : ''}
						${json.defaultSelected !== undefined && json.defaultSelected !== '' ? `valueChecked="${json.defaultSelected}"` : ''}
						${reactClassNamesFromComponentObj(json)}
						onChange={(radio) => handleInputChange({
							target: {
								name: "${json.codeContext?.name}"
							}
						})}>
							${json.items.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
					</RadioButtonGroup>`;
				}
			},
			v10: {
				imports: ['RadioButtonGroup'],
				code: ({ json, signals, slots, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<RadioButtonGroup
						name="${json.codeContext?.name}"
						legendText="${json.legend}"
						orientation="${json.orientation}"
						labelPosition="${json.labelPosition}"
						${json.defaultSelected !== undefined && json.defaultSelected !== '' ? `defaultSelected="${json.defaultSelected}"` : ''}
						${json.defaultSelected !== undefined && json.defaultSelected !== '' ? `valueChecked="${json.defaultSelected}"` : ''}
						${reactClassNamesFromComponentObj(json)}
						onChange={(radio) => handleInputChange({
							target: {
								name: "${json.codeContext?.name}"
							}
						})}>
							${json.items.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
					</RadioButtonGroup>`;
				}
			}
		}
	}
};
