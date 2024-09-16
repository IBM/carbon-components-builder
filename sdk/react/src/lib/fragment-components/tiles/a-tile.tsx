import React from 'react';
import {
	Checkbox,
	TextInput,
	Tile
} from '@carbon/react';
import { AComponent } from '../a-component';
import { TileMorphism } from './tile-morphism';
import { css, cx } from 'emotion';
import { ComponentInfo } from '..';
import image from '../../assets/component-icons/tile.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../helpers/tools';
import { APlaceholder } from '../a-placeholder';
import { styleObjectToString } from '@carbon-builder/player-react';

export const ATileSettingsUI = ({ selectedComponent, setComponent, fragment, setFragment }: any) => {
	return <>
		<TileMorphism component={selectedComponent} setComponent={setComponent} fragment={fragment} setFragment={setFragment} />
		<Checkbox
			labelText='Light theme'
			id='theme-select'
			checked={selectedComponent.light}
			onChange={(_: any, { checked }: any) => {
				setComponent({
					...selectedComponent,
					light: checked
				});
			}}
		/>
	</>;
};

export const ATileCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

export const ATile = ({
	children,
	componentObj,
	onDrop,
	selected,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		selected={selected}
		{...rest}>
			<Tile
			onDrop={onDrop}
			className={cx(
				componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
				css`${styleObjectToString(componentObj.style)}`
			)}
			light={componentObj.light}>
				{
					children && children.length > 0 ? children : <APlaceholder componentObj={componentObj} select={rest.select} />
				}
			</Tile>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATile,
	codeUI: ATileCodeUI,
	settingsUI: ATileSettingsUI,
	keywords: ['tile', 'card'],
	name: 'Tile',
	type: 'tile',
	defaultComponentObj: {
		type: 'tile',
		items: []
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents, outline, fragment, setFragment }) => <ATile
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}
		fragment={fragment}
		setFragment={setFragment}>
		{componentObj.items?.map((tile: any) => renderComponents(tile, outline))}
	</ATile>,
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = '${json.light ? 'light' : ''}';`,
				outputs: (_) => '',
				imports: ['TilesModule'],
				code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<cds-tile
						[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
						${angularClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
					</cds-tile>`;
				}
			},
			v10: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = '${json.light ? 'light' : ''}';`,
				outputs: (_) => '',
				imports: ['TilesModule'],
				code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<ibm-tile
						[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
						${angularClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
					</ibm-tile>`;
				}
			}
		},
		react: {
			latest: {
				imports: ['Tile'],
				code: ({ json, signals, slots, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<Tile
						${json.light !== undefined ? `light={${json.light}}` : ''}
						${reactClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
					</Tile>`;
				}
			},
			v10: {
				imports: ['Tile'],
				code: ({ json, signals, slots, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<Tile
						${json.light !== undefined ? `light={${json.light}}` : ''}
						${reactClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
					</Tile>`;
				}
			}
		}
	}
};
