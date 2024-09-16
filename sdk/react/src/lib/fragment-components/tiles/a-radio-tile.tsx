import React, { useEffect } from 'react';
import {
	TextInput,
	Checkbox,
	RadioTile
} from '@carbon/react';
import { AComponent } from '../a-component';
import { css, cx } from 'emotion';
import { ComponentInfo } from '..';
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

export const ARadioTileSettingsUI = ({ selectedComponent, setComponent, fragment }: any) => {
	const parentComponent = getParentComponent(fragment.data, selectedComponent);

	// Removes checkmark from siblings and checks current
	const updateParentDefaultChecked = (checked: boolean) => {
		// Deleting attribute to prevent from being in export
		if (!checked && parentComponent.defaultChecked) {
			delete parentComponent.defaultChecked;
		} else {
			parentComponent.items.forEach((item: any) => {
				item.defaultChecked = false;
			});

			parentComponent.defaultChecked = selectedComponent.value;
		}
	};

	return <>
		<Checkbox
			labelText='Default checked'
			id='default-checked'
			checked={selectedComponent.defaultChecked}
			onChange={(_: any, { checked }: any) => {
				updateParentDefaultChecked(checked);
				setComponent({
					...selectedComponent,
					defaultChecked: checked
				});
			}}
		/>
		<Checkbox
			labelText='Disabled'
			id='disabled'
			checked={selectedComponent.disabled}
			onChange={(_: any, { checked }: any) => {
				setComponent({
					...selectedComponent,
					disabled: checked
				});
			}}
		/>
	</>;
};

export const ARadioTileCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TextInput
			id='radio-tile-input-name-text-input'
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
			}} />
		<TextInput
			id='radio-tile-value-text-input'
			value={selectedComponent.codeContext?.value || ''}
			labelText='Value*'
			placeholder='Tile value'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						...selectedComponent.codeContext,
						value: event.currentTarget.value
					}
				});
			}} />
	</>;
};

export const ARadioTile = ({
	children,
	componentObj,
	onDrop,
	selected,
	fragment,
	setFragment,
	...rest
}: any) => {
	const parentComponent = getParentComponent(fragment.data, componentObj);
	// Removing `for` attribute so users can select text and other non-form elements.
	useEffect(() => {
		const tileElement = document.getElementById(componentObj.codeContext?.name);
		const labelElement = tileElement?.parentElement?.querySelector('label.cds--tile.cds--tile--selectable');
		// Setting to empty instead of removing so users can select non-form elements within tile when a form element is present
		// Although form elements should never be added within another
		labelElement?.setAttribute('for', '');
	}, [componentObj.codeContext]);

	const addRadio = (offset = 0) => {
		setFragment({
			...fragment,
			data: updatedState(
				fragment.data,
				{
					type: 'insert',
					component: {
						type: 'radio-tile',
						codeContext: {
							value: 'Tile',
							formItemName: componentObj.codeContext?.formItemName
						},
						...(componentObj.light !== undefined ? { light: componentObj.light } : ''),
						items: []
					}
				},
				parentComponent.id,
				parentComponent.items.indexOf(componentObj) + offset
			)
		});
	};

	return (
		<Adder
		active={selected}
		topAction={() => addRadio()}
		bottomAction={() => addRadio(1)}>
			<AComponent
			componentObj={componentObj}
			headingCss={css`display: block;`}
			selected={selected}
			fragment={fragment}
			setFragment={setFragment}
			{...rest}>
				<RadioTile
				id={componentObj.codeContext?.name}
				name={componentObj.codeContext?.formItemName}
				light={componentObj.light}
				checked={componentObj.defaultChecked}
				disabled={componentObj.disabled}
				value={componentObj.codeContext?.value}
				className={cx(
					componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
					css`${styleObjectToString(componentObj.style)}`
				)}
				onDrop={onDrop}>
					{
						children && children.length > 0 ? children : <APlaceholder componentObj={componentObj} select={rest.select} />
					}
				</RadioTile>
			</AComponent>
		</Adder>
	);
};

export const componentInfo: ComponentInfo = {
	component: ARadioTile,
	settingsUI: ARadioTileSettingsUI,
	codeUI: ARadioTileCodeUI,
	keywords: ['tile', 'card', 'radio', 'selectable'],
	name: 'Radio tile',
	type: 'radio-tile',
	defaultComponentObj: {
		type: 'radio-tile',
		disabled: false,
		defaultChecked: false,
		items: []
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents, outline, fragment, setFragment }) => <ARadioTile
		key={componentObj.id}
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}
		fragment={fragment}
		setFragment={setFragment}>
			{componentObj.items.map((item: any) => renderComponents(item, outline))}
	</ARadioTile>,
	/**
	 * Can only be added by adding tile-group or by clicking `plus` icon on top or bottom
	 * of existing RadioTile
	 */
	hideFromElementsPane: true,
	image: undefined,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Checked = ${json.checked || false};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = '${json.light ? 'light' : 'dark'}';
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled || false};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = '${json.value}';`,
				outputs: () => '',
				imports: ['TilesModule'],
				code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<cds-selection-tile
						[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
						[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
						[disabled]=${nameStringToVariableString(json.codeContext?.name)}Disabled
						[selected]="${nameStringToVariableString(json.codeContext?.name)}Selected"
						${angularClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
					</cds-selection-tile>`;
				}
			},
			v10: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Checked = ${json.checked || false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = '${json.light ? 'light' : 'dark'}';
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled || false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = '${json.value}';`,
				outputs: () => '',
				imports: ['TilesModule'],
				code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<ibm-selection-tile
						[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
						[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
						[disabled]=${nameStringToVariableString(json.codeContext?.name)}Disabled
						[selected]="${nameStringToVariableString(json.codeContext?.name)}Selected"
						${angularClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
					</ibm-selection-tile>`;
				}
			}
		},
		react: {
			latest: {
				imports: ['RadioTile'],
				code: ({ json, signals, slots, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<RadioTile
						${
							(json.codeContext?.formItemName !== undefined && json.codeContext?.formItemName !== '')
								? `name="${json.codeContext?.formItemName}"` : ''
						}
						${(json.codeContext?.value !== undefined && json.codeContext?.value !== '') ? `value="${json.codeContext?.value}"` : ''}
						${json.light !== undefined ? `light={${json.light}}` : ''}
						${json.defaultChecked ? `checked={${json.defaultChecked}}` : ''}
						${json.disabled !== undefined && !!json.disabled ? `disabled={${json.disabled}}` : ''}
						${reactClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
					</RadioTile>`;
				}
			},
			v10: {
				imports: ['RadioTile'],
				code: ({ json, signals, slots, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<RadioTile
						${
							(json.codeContext?.formItemName !== undefined && json.codeContext?.formItemName !== '')
								? `name="${json.codeContext?.formItemName}"` : ''
						}
						${(json.codeContext?.value !== undefined && json.codeContext?.value !== '') ? `value="${json.codeContext?.value}"` : ''}
						${json.light !== undefined ? `light={${json.light}}` : ''}
						${json.defaultChecked ? `checked={${json.defaultChecked}}` : ''}
						${json.disabled !== undefined && !!json.disabled ? `disabled={${json.disabled}}` : ''}
						${reactClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
					</RadioTile>`;
				}
			}
		}
	}
};
