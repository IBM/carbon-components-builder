import React, { useEffect } from 'react';
import { TextInput, Checkbox } from '@carbon/react';
import { AComponent } from '../a-component';
import { TileMorphism } from './tile-morphism';
import { css, cx } from 'emotion';
import { ComponentInfo } from '..';

import image from '../../assets/component-icons/tile-selectable-group.svg';
import {
	getParentComponent,
	updatedState,
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../helpers/tools';
import { styleObjectToString } from '@carbon-builder/player-react';

export const ASelectableTileGroupSettingsUI = ({ selectedComponent, setComponent, fragment, setFragment }: any) => {
	return <>
		<TileMorphism component={selectedComponent} setComponent={setComponent} fragment={fragment} setFragment={setFragment} />
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
	</>;
};

export const ASelectableTileGroupCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
	value={selectedComponent.codeContext?.name}
	id='input-name'
	labelText='Input name'
	onChange={(event: any) => {
		setComponent({
			...selectedComponent,
			codeContext: {
				...selectedComponent.codeContext,
				name: event.currentTarget.value
			},
			// Grouped form elements (Radio) within a fieldset should have the same name
			items: selectedComponent.items.map((tile: any) => ({
				...tile,
				codeContext: {
					...tile.codeContext,
					// Selectable Tiles (Children) use formItemName
					formItemName: event.currentTarget.value
				}
			}))
		});
	}} />;

export const ASelectableTileGroup = ({
	children,
	componentObj,
	selected,
	fragment,
	setFragment,
	...rest
}: any) => {
	// Initialize the child tiles with the form item name
	// We use the name property because it unique by default
	useEffect(() => {
		const parentComponent: any = getParentComponent(fragment.data, componentObj);
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
		// Disabling since we want to call this only once to initialize children `formItemName` attribute in code context
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AComponent
			componentObj={componentObj}
			headingCss={css`display: block;`}
			selected={selected}
			{...rest}>
				<div
				role='group'
				className={cx(
					componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
					css`${styleObjectToString(componentObj.style)}`
				)}
				aria-label='Selectable tiles'>
					{children}
				</div>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ASelectableTileGroup,
	settingsUI: ASelectableTileGroupSettingsUI,
	codeUI: ASelectableTileGroupCodeUI,
	keywords: ['tile', 'card', 'multi', 'select'],
	name: 'Selectable tile group',
	type: 'selectable-tile-group',
	defaultComponentObj: {
		type: 'selectable-tile-group',
		tileGroup: true,
		items: [
			{
				type: 'selectable-tile',
				codeContext: {
					value: 'Tile 1'
				},
				standalone: false,
				selected: false,
				items: []
			},
			{
				type: 'selectable-tile',
				codeContext: {
					value: 'Tile 2'
				},
				standalone: false,
				selected: false,
				items: []
			},
			{
				type: 'selectable-tile',
				codeContext: {
					value: 'Tile 3'
				},
				standalone: false,
				selected: false,
				items: []
			}
		]
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents, outline, fragment, setFragment }) => (
		<ASelectableTileGroup
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
		</ASelectableTileGroup>
	),
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
						[multiple]="true"
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
						[multiple]="true"
						${angularClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
					</ibm-tile-group>`;
				}
			}
		},
		react: {
			latest: {
				imports: [],
				code: ({ json, signals, slots, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<div
						role="group"
						aria-label="Selectable tiles"
						${reactClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
					</div>`;
				}
			},
			v10: {
				imports: [],
				code: ({ json, signals, slots, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<div
						role="group"
						aria-label="Selectable tiles"
						${reactClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
					</div>`;
				}
			}
		}
	}
};
