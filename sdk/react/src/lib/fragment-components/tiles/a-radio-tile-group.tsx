import React, { useEffect } from 'react';
import { TextInput, Checkbox } from '@carbon/react';
import { AComponent } from '../a-component';
import { TileMorphism } from './tile-morphism';
import { css, cx } from 'emotion';
import { ComponentInfo } from '..';

import image from '../../assets/component-icons/tile-radio.svg';
import {
	getParentComponent,
	updatedState,
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../helpers/tools';
import { styleObjectToString } from '@carbon-builder/player-react';

export const ARadioTileGroupSettingsUI = ({ selectedComponent, setComponent, fragment, setFragment }: any) => {
	return <>
		<TileMorphism component={selectedComponent} setComponent={setComponent} fragment={fragment} setFragment={setFragment} />
		<TextInput
			id='radio-tile-legend-text-input'
			value={selectedComponent.legend}
			labelText='Legend name'
			placeholder='Fieldset header'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					legend: event.currentTarget.value
				});
			}}
		/>
		<Checkbox
			labelText='Light theme'
			id='theme-select'
			checked={selectedComponent.light}
			onChange={(_: any, { checked }: any) => {
				/**
				 * It usually is not common for users to have different theme for each tile,
				 * this approach will ensure users don't have to go through each child `tile` & update theme
				 */
				setComponent({
					...selectedComponent,
					light: checked,
					items: selectedComponent.items.map((tile: any) => ({
						...tile,
						light: checked
					}))
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

export const ARadioTileGroupCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <TextInput
		id='radio-tile-input-name-text-input'
		value={selectedComponent.codeContext?.name}
		labelText='Input name'
		onChange={(event: any) => {
			setComponent({
				...selectedComponent,
				codeContext: {
					...selectedComponent.codeContext,
					name: event.currentTarget.value
				},
				// Radio form elements within a fieldset should have the same name
				items: selectedComponent.items.map((tile: any) => ({
					...tile,
					codeContext: {
						...tile.codeContext,
						// Radio Tiles (Children) use formItemName
						formItemName: event.currentTarget.value
					}
				}))
			});
		}} />;
};

export const ARadioTileGroup = ({
	children,
	componentObj,
	selected,
	fragment,
	setFragment,
	...rest
}: any) => {
	// Initialize the child tiles with the form item name
	// We use the name property because it's unique by default
	useEffect(() => {
		const parentComponent = getParentComponent(fragment.data, componentObj);
		const componentIndex = parentComponent.items.indexOf(componentObj);
		const items = [
			...parentComponent.items.slice(0, componentIndex),
			{
				...componentObj,
				items: componentObj.items.map((tile: any) => ({
					...tile,
					codeContext: { ...tile.codeContext, formItemName: componentObj.codeContext?.name }
				}))
			},
			...parentComponent.items.slice(componentIndex + 1)
		];

		/**
		 * If there are multiple radio-tile-groups rendering at once,
		 * they will attempt to overwrite the state together causing the edit mode to break
		 *
		 * Ideally, we should be using an arrow function with previousState to resolve this scenario.
		 * However, we don’t know which fragment we’re updating until we read the id from the model.
		 */
		setTimeout(() => {
			setFragment({
				...fragment,
				data: updatedState(fragment.data, {
					type: 'update',
					component: {
						...parentComponent,
						items
					}
				})
			}, false);
		});
		// Disabling since we want to call this only once to initialize children `formItemName` attribute in code context
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AComponent
			componentObj={componentObj}
			headingCss={css`display: block;`}
			selected={selected}
			{...rest}>
				<fieldset
				className={cx(
					'cds--tile-group',
					componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
					css`${styleObjectToString(componentObj.style)}`
				)}
				disabled={componentObj.disabled}>
					{(componentObj.legend !== undefined && componentObj.legend !== '') &&
					<legend className='cds--label'>
						{componentObj.legend}
					</legend>}
					{children}
				</fieldset>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ARadioTileGroup,
	settingsUI: ARadioTileGroupSettingsUI,
	codeUI: ARadioTileGroupCodeUI,
	keywords: ['tile', 'card', 'radio', 'select'],
	name: 'Radio tile group',
	type: 'radio-tile-group',
	defaultComponentObj: {
		type: 'radio-tile-group',
		tileGroup: true,
		legend: 'Radio Tile Group',
		items: [
			{
				type: 'radio-tile',
				defaultChecked: false,
				codeContext: {
					value: 'Tile 1'
				},
				items: []
			},
			{
				type: 'radio-tile',
				defaultChecked: false,
				codeContext: {
					value: 'Tile 2'
				},
				items: []
			},
			{
				type: 'radio-tile',
				defaultChecked: false,
				codeContext: {
					value: 'Tile 3'
				},
				items: []
			}
		]
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents, outline, fragment, setFragment }) => <ARadioTileGroup
		key={componentObj.id}
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}
		fragment={fragment}
		setFragment={setFragment}>
			{componentObj.items.map((tile: any) => renderComponents(tile, outline))}
	</ARadioTileGroup>,
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: () => '',
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Selected = new EventEmitter<Event>();`,
				imports: ['TilesModule'],
				code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<cds-tile-group
						(selected)="${nameStringToVariableString(json.codeContext?.name)}Selected.emit($event)"
						[multiple]="false"
						${angularClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
					</cds-tile-group>`;
				}
			},
			v10: {
				inputs: () => '',
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Selected = new EventEmitter<Event>();`,
				imports: ['TilesModule'],
				code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<ibm-tile-group
						(selected)="${nameStringToVariableString(json.codeContext?.name)}Selected.emit($event)"
						[multiple]="false"
						${angularClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
					</ibm-tile-group>`;
				}
			}
		},
		react: {
			latest: {
				imports: ['TileGroup'],
				code: ({ json, signals, slots, jsonToTemplate, fragments, customComponentsCollections }) => {
					return `<TileGroup
						${json.legend !== undefined && json.legend !== '' ? `legend="${json.legend}"` : ''}
						name="${json.codeContext?.name}"
						${json.disabled !== undefined ? `disabled={${json.disabled}}` : ''}
						${reactClassNamesFromComponentObj(json)}
						onChange={(radio) => handleInputChange({
							target: {
								name: "${json.codeContext?.name}",
								value: radio
							}
						})}>
							${json.items.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
					</TileGroup>`;
				}
			},
			v10: {
				imports: ['TileGroup'],
				code: ({ json, signals, slots, jsonToTemplate, fragments, customComponentsCollections }) => {
					return `<TileGroup
						${json.legend !== undefined && json.legend !== '' ? `legend="${json.legend}"` : ''}
						name="${json.codeContext?.name}"
						${json.disabled !== undefined ? `disabled={${json.disabled}}` : ''}
						${reactClassNamesFromComponentObj(json)}
						onChange={(radio) => handleInputChange({
							target: {
								name: "${json.codeContext?.name}",
								value: radio
							}
						})}>
							${json.items.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
					</TileGroup>`;
				}
			}
		}
	}
};
