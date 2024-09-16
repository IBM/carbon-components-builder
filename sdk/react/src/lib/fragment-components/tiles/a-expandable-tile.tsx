import React from 'react';
import {
	Checkbox,
	ExpandableTile,
	TileAboveTheFoldContent,
	TextInput
} from '@carbon/react';
import { AComponent } from '../a-component';
import { TileMorphism } from './tile-morphism';
import { css, cx } from 'emotion';
import { ComponentInfo } from '..';
import image from '../../assets/component-icons/tile-expandable.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../helpers/tools';
import { styleObjectToString } from '@carbon-builder/player-react';

export const AExpandableSettingsUI = ({ selectedComponent, setComponent, fragment, setFragment }: any) => {
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
		<Checkbox
			labelText='Expanded'
			id='expanded'
			checked={selectedComponent.expanded}
			onChange={(_: any, { checked }: any) => {
				setComponent({
					...selectedComponent,
					expanded: checked
				});
			}}
		/>
		<Checkbox
			labelText='Show outline'
			id='outline'
			checked={selectedComponent.outline}
			onChange={(_: any, { checked }: any) => {
				setComponent({
					...selectedComponent,
					outline: checked
				});
			}}
		/>
	</>;
};

export const AExpandableTileCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

const outlineStyle = css`
	span.cds--tile-content__above-the-fold,
	span.cds--tile-content__below-the-fold {
		min-height: 16px;
		outline: 1px dashed #78a9ff;
	}
`;

export const AExpandableTile = ({
	children,
	componentObj,
	onDrop,
	outline,
	selected,
	fragment,
	setFragment,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		selected={selected}
		headingCss={css`display: block;`}
		fragment={fragment}
		setFragment={setFragment}
		{...rest}>
			<ExpandableTile
			light={componentObj.light}
			className={cx(`${
					componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')
				} ${
					(componentObj.outline || outline === true) && outline !== false ? outlineStyle : ''
				}`, css`${styleObjectToString(componentObj.style)}`
			)}
			expanded={componentObj.expanded}>
				<TileAboveTheFoldContent
				onDrop={onDrop}
				fragment={fragment}
				setFragment={setFragment}>
					{children.filter(({ props }: any) => props && props.componentObj.type !== 'tile-fold')}
				</TileAboveTheFoldContent>
				{
					// Renders bottom fold component
					children.filter(({ props }: any) => props && props.componentObj.type === 'tile-fold')
				}
			</ExpandableTile>
		</AComponent>
	);
};

// Splits data into folds - all exports will have a common approach
const getFoldObjects = (json: any) => {
	return {
		aboveFold: json.items.filter((item: any) => item.type !== 'tile-fold'),
		belowFold: json.items.filter((item: any) => item.type === 'tile-fold')
	};
};

export const componentInfo: ComponentInfo = {
	component: AExpandableTile,
	codeUI: AExpandableTileCodeUI,
	settingsUI: AExpandableSettingsUI,
	keywords: ['tile', 'fold', 'expandable'],
	name: 'Expandable tile',
	type: 'expandable-tile',
	defaultComponentObj: {
		type: 'expandable-tile',
		light: false,
		expanded: true,
		outline: false,
		items: [
			{
				type: 'text',
				text: 'Above fold'
			},
			{
				type: 'tile-fold',
				items: [
					{
						type: 'text',
						text: 'Below fold'
					}
				]
			}
		]
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents, outline, fragment, setFragment }) => <AExpandableTile
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		outline={outline}
		onDrop={onDrop}
		fragment={fragment}
		setFragment={setFragment}>
		{componentObj.items.map((fold: any) => renderComponents(fold, outline))}
	</AExpandableTile>,
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Expanded = ${json.expanded};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = '${json.light ? 'light' : 'dark'}';`,
				outputs: () => '',
				imports: ['TilesModule'],
				code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
					const { aboveFold, belowFold } = getFoldObjects(json);
					return `<cds-expandable-tile
						[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
						${json.expanded !== undefined ? `[expanded]="${nameStringToVariableString(json.codeContext?.name)}Expanded"` : ''}
						${angularClassNamesFromComponentObj(json)}>
							<span class="cds--tile-content__above-the-fold">
								${aboveFold.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
							</span>
							${belowFold.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
					</cds-expandable-tile>`;
				}
			},
			v10: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Expanded = ${json.expanded};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = '${json.light ? 'light' : 'dark'}';`,
				outputs: () => '',
				imports: ['TilesModule'],
				code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
					const { aboveFold, belowFold } = getFoldObjects(json);
					return `<ibm-expandable-tile
						[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
						${json.expanded !== undefined ? `[expanded]="${nameStringToVariableString(json.codeContext?.name)}Expanded"` : ''}
						${angularClassNamesFromComponentObj(json)}>
							<span class="bx--tile-content__above-the-fold">
								${aboveFold.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
							</span>
							${belowFold.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
					</ibm-expandable-tile>`;
				}
			}
		},
		react: {
			latest: {
				imports: ['ExpandableTile', 'TileAboveTheFoldContent', 'TileBelowTheFoldContent'],
				code: ({ json, signals, slots, jsonToTemplate, fragments, customComponentsCollections }) => {
					const { aboveFold, belowFold } = getFoldObjects(json);
					return `<ExpandableTile
						${json.light !== undefined && !!json.light ? `light={${json.light}}` : ''}
						${json.expanded !== undefined && !!json.expanded ? `expanded={${json.expanded}}` : ''}
						${reactClassNamesFromComponentObj(json)}>
							<TileAboveTheFoldContent>
								${aboveFold.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
							</TileAboveTheFoldContent>
							${belowFold.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
					</ExpandableTile>`;
				}
			},
			v10: {
				imports: ['ExpandableTile', 'TileAboveTheFoldContent', 'TileBelowTheFoldContent'],
				code: ({ json, signals, slots, jsonToTemplate, fragments, customComponentsCollections }) => {
					const { aboveFold, belowFold } = getFoldObjects(json);
					return `<ExpandableTile
						${json.light !== undefined && !!json.light ? `light={${json.light}}` : ''}
						${json.expanded !== undefined && !!json.expanded ? `expanded={${json.expanded}}` : ''}
						${reactClassNamesFromComponentObj(json)}>
							<TileAboveTheFoldContent>
								${aboveFold.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
							</TileAboveTheFoldContent>
							${belowFold.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
					</ExpandableTile>`;
				}
			}
		}
	}
};
