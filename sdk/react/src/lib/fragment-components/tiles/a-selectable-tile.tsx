import React, { useEffect } from 'react';
import {
	TextInput,
	Checkbox,
	SelectableTile
} from '@carbon/react';
import { AComponent } from '../a-component';
import { TileMorphism } from './tile-morphism';
import { css, cx } from 'emotion';
import { ComponentInfo } from '..';
import image from '../../assets/component-icons/tile-selectable.svg';
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

export const ASelectableTileSettingsUI = ({ selectedComponent, setComponent, fragment, setFragment }: any) => {
	return <>
		{
			selectedComponent.standalone && <>
				<TileMorphism component={selectedComponent} setComponent={setComponent} fragment={fragment} setFragment={setFragment} />
				<Checkbox
					labelText='Light theme'
					id='theme-select'
					checked={!!selectedComponent.light}
					onChange={(_: any, { checked }: any) => {
						setComponent({
							...selectedComponent,
							light: checked
						});
					}}
				/>
			</>
		}
		<Checkbox
			labelText='Selected'
			id='selected'
			checked={selectedComponent.selected}
			onChange={(_: any, { checked }: any) => {
				setComponent({
					...selectedComponent,
					selected: checked
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

export const ASelectableTileCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TextInput
			value={selectedComponent.codeContext?.name}
			labelText='Input name'
			id='input-name'
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
			value={selectedComponent.codeContext?.title || ''}
			labelText='Title'
			id='title-attribute'
			placeholder='Title attribute'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						...selectedComponent.codeContext,
						title: event.currentTarget.value
					}
				});
			}} />
		<TextInput
			value={selectedComponent.codeContext?.value || ''}
			labelText='Value'
			id='tile-value'
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

// Prevent users from clicking on the selectable tile
const preventCheckEvent = css`
	pointer-events: none;
	.cds--tile-content {
		pointer-events: initial;
	}
`;

export const ASelectableTile = ({
	children,
	componentObj,
	onDrop,
	selected,
	fragment,
	setFragment,
	...rest
}: any) => {
	const parentComponent = getParentComponent(fragment.data, componentObj);

	const addTile = (offset = 0) => setFragment({
		...fragment,
		data: updatedState(
			fragment.data,
			{
				type: 'insert',
				component: {
					standalone: false,
					type: 'selectable-tile',
					codeContext: {
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

	// Removing `for` attribute so users can select text and other non-form elements.
	useEffect(() => {
		const tileElement = document.getElementById(componentObj.codeContext.name);
		const labelElement = tileElement?.parentElement?.querySelector('label.cds--tile.cds--tile--selectable');
		// Setting to empty instead of removing so users can select non-form elements within tile when a form element is present
		// Although form elements should never be added within another
		labelElement?.setAttribute('for', '');
	}, [componentObj.codeContext]);

	return (
		<Adder
			active={parentComponent?.tileGroup && selected}
			topAction={() => addTile()}
			bottomAction={() => addTile(1)}>
			<AComponent
				componentObj={componentObj}
				headingCss={css`display: block;`}
				className={css`cursor: pointer;`}
				selected={selected}
				fragment={fragment}
				setFragment={setFragment}
				{...rest}>
					<SelectableTile
					id={componentObj.codeContext?.name}
					name={componentObj.codeContext?.formItemName || componentObj.codeContext?.name}
					title={componentObj.title}
					value={componentObj.value}
					light={componentObj.light}
					selected={componentObj.selected}
					disabled={componentObj.disabled}
					className={cx(
						preventCheckEvent,
						componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
						css`${styleObjectToString(componentObj.style)}`
					)}
					onDrop={onDrop}>
						{
							children && children.length > 0 ? children : <APlaceholder componentObj={componentObj} select={rest.select} />
						}
					</SelectableTile>
			</AComponent>
		</Adder>
	);
};

export const componentInfo: ComponentInfo = {
	component: ASelectableTile,
	settingsUI: ASelectableTileSettingsUI,
	codeUI: ASelectableTileCodeUI,
	keywords: ['tile', 'card', 'multi', 'selectable'],
	name: 'Selectable tile',
	type: 'selectable-tile',
	defaultComponentObj: {
		type: 'selectable-tile',
		standalone: true,
		disabled: false,
		selected: false,
		items: []
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents, outline, fragment, setFragment }) => <ASelectableTile
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
	</ASelectableTile>,
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Selected = ${json.selected || false};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = '${json.value}';
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled || false};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = '${json.light ? 'light' : 'dark'}';`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Change = new EventEmitter<Event>();`,
				imports: ['TilesModule'],
				code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<cds-selection-tile
						[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
						[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
						[disabled]=${nameStringToVariableString(json.codeContext?.name)}Disabled
						[selected]="${nameStringToVariableString(json.codeContext?.name)}Selected"
						${json.standalone ? `(change)="${nameStringToVariableString(json.codeContext?.name)}Change.emit($event)"` : ''}
						${angularClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
						</cds-selection-tile>`;
				}
			},
			v10: {
				inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Selected = ${json.selected || false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Value = '${json.value}';
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled || false};
					@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = '${json.light ? 'light' : 'dark'}';`,
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Change = new EventEmitter<Event>();`,
				imports: ['TilesModule'],
				code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<ibm-selection-tile
						[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
						[value]="${nameStringToVariableString(json.codeContext?.name)}Value"
						[disabled]=${nameStringToVariableString(json.codeContext?.name)}Disabled
						[selected]="${nameStringToVariableString(json.codeContext?.name)}Selected"
						${json.standalone ? `(change)="${nameStringToVariableString(json.codeContext?.name)}Change.emit($event)"` : ''}
						${angularClassNamesFromComponentObj(json)}>
							${json.items.map((element: any) => jsonToTemplate(element, fragments, customComponentsCollections)).join('\n')}
						</ibm-selection-tile>`;
				}
			}
		},
		react: {
			latest: {
				imports: ['SelectableTile'],
				code: ({ json, signals, slots, fragments, jsonToTemplate, customComponentsCollections }) => {
					const stateFunction = json.standalone ?
						`() => {
							handleInputChange({
								target: {
									name: "${json.codeContext?.name}",
									value: "${json.codeContext?.value}"
								}
					})}` :
						`() =>
							handleSelectableTileChange(
								"${json.codeContext?.formItemName}",
								"${json.codeContext?.name}"
							)
						`;

					return `<SelectableTile
						id="${json.codeContext?.name}"
						${(json.codeContext?.value !== undefined && json.codeContext?.value !== '') ? `value="${json.codeContext?.value}"` : ''}
						${(json.codeContext?.title !== undefined && json.codeContext?.title !== '') ? `title="${json.codeContext?.title}"` : ''}
						${
							(json.codeContext?.formItemName !== undefined && !json.standalone)
								? `name="${json.codeContext?.formItemName}"` : `name="${json.codeContext?.name}"`
						}
						${json.selected !== undefined ? `selected={${json.selected}}` : ''}
						${json.light !== undefined ? `light={${json.light}}` : ''}
						${json.disabled !== undefined && !!json.disabled ? `disabled={${json.disabled}}` : ''}
						${reactClassNamesFromComponentObj(json)}
						onClick={${stateFunction}}>
							${json.items.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
					</SelectableTile>`;
				},
				additionalCode: (json) => {
					if (json.standalone) {
						return {};
					}
					return {
						handleSelectableTileChange: `const handleSelectableTileChange = (name, id) => {
							handleInputChange({
								target: {
									name,
									value: {
										...state[name],
										[id]: !state[name]?.[id]
									}
								}
							});
						};`
					};
				}
			},
			v10: {
				imports: ['SelectableTile'],
				code: ({ json, signals, slots, fragments, jsonToTemplate, customComponentsCollections }) => {
					const stateFunction = json.standalone ?
						`() => {
							handleInputChange({
								target: {
									name: "${json.codeContext?.name}",
									value: "${json.codeContext?.value}"
								}
					})}` :
						`() =>
							handleSelectableTileChange(
								"${json.codeContext?.formItemName}",
								"${json.codeContext?.name}"
							)
						`;

					return `<SelectableTile
						id="${json.codeContext?.name}"
						${(json.codeContext?.value !== undefined && json.codeContext?.value !== '') ? `value="${json.codeContext?.value}"` : ''}
						${(json.codeContext?.title !== undefined && json.codeContext?.title !== '') ? `title="${json.codeContext?.title}"` : ''}
						${
							(json.codeContext?.formItemName !== undefined && !json.standalone)
								? `name="${json.codeContext?.formItemName}"` : `name="${json.codeContext?.name}"`
						}
						${json.selected !== undefined ? `selected={${json.selected}}` : ''}
						${json.light !== undefined ? `light={${json.light}}` : ''}
						${json.disabled !== undefined && !!json.disabled ? `disabled={${json.disabled}}` : ''}
						${reactClassNamesFromComponentObj(json)}
						onClick={${stateFunction}}>
							${json.items.map((element: any) => jsonToTemplate(element, signals, slots, fragments, customComponentsCollections)).join('\n')}
					</SelectableTile>`;
				},
				additionalCode: (json) => {
					if (json.standalone) {
						return {};
					}
					return {
						handleSelectableTileChange: `const handleSelectableTileChange = (name, id) => {
							handleInputChange({
								target: {
									name,
									value: {
										...state[name],
										[id]: !state[name]?.[id]
									}
								}
							});
						};`
					};
				}
			}
		}
	}
};
