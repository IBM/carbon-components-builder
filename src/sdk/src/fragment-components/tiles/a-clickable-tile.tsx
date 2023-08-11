import React from 'react';
import {
	TextInput,
	Checkbox,
	ClickableTile
} from '@carbon/react';
import { AComponent } from '../a-component';
import { TileMorphism } from './tile-morphism';
import { css, cx } from 'emotion';
import { ComponentInfo } from '..';
import image from '../../assets/component-icons/tile-clickable.svg';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../../tools';
import { APlaceholder } from '../a-placeholder';
import { styleObjectToString } from '../../../../ui-fragment/src/utils';

export const AClickableTileSettingsUI = ({ selectedComponent, setComponent, fragment, setFragment }: any) => {
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

export const AClickableTileCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<TextInput
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
			value={selectedComponent.codeContext?.href || ''}
			labelText='href for clickable UI'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					codeContext: {
						...selectedComponent.codeContext,
						href: event.currentTarget.value
					}
				});
			}} />
	</>;
};

export const AClickableTile = ({
	children,
	componentObj,
	onDrop,
	selected,
	...rest
}: any) => {
	// Prevent users from being redirected
	const onClick = (event: any) => {
		event.preventDefault();
	};

	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		selected={selected}
		{...rest}>
			<ClickableTile
			onClick={onClick}
			onDrop={onDrop}
			light={componentObj.light}
			href={componentObj.codeContext?.href}
			disabled={componentObj.disabled}
			className={cx(
				componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
				css`${styleObjectToString(componentObj.style)}`
			)}>
				{
					children && children.length > 0 ? children : <APlaceholder componentObj={componentObj} select={rest.select} />
				}
			</ClickableTile>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AClickableTile,
	settingsUI: AClickableTileSettingsUI,
	codeUI: AClickableTileCodeUI,
	keywords: ['tile', 'clickable', 'card'],
	name: 'Clickable tile',
	type: 'clickable-tile',
	defaultComponentObj: {
		type: 'clickable-tile',
		items: []
	},
	render: ({ componentObj, select, remove, selected, onDragOver, onDrop, renderComponents, outline, fragment, setFragment }) => <AClickableTile
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}
		onDragOver={onDragOver}
		onDrop={onDrop}
		fragment={fragment}
		setFragment={setFragment}>
			{componentObj.items.map((item: any) => renderComponents(item, outline))}
	</AClickableTile>,
	image,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Href = '${json.href}';
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled || false};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = '${json.light ? 'light' : 'dark'}';`,
			outputs: (_) => '',
			imports: ['TilesModule'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<cds-clickable-tile
					[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
					[href]=${nameStringToVariableString(json.codeContext?.name)}Href
					[disabled]=${nameStringToVariableString(json.codeContext?.name)}Disabled
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</cds-clickable-tile>`;
			}
		},
		react: {
			imports: ['ClickableTile'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<ClickableTile
					${json.codeContext?.href !== undefined && json.codeContext?.href !== '' ? `href='${json.codeContext?.href}'` : ''}
					${json.light !== undefined ? `light={${json.light}}` : ''}
					${json.disabled !== undefined ? `disabled={${json.disabled}}` : ''}
					${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</ClickableTile>`;
			}
		},
		angularV10: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Href = '${json.href}';
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled || false};
				@Input() ${nameStringToVariableString(json.codeContext?.name)}Theme = '${json.light ? 'light' : 'dark'}';`,
			outputs: (_) => '',
			imports: ['TilesModule'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<ibm-clickable-tile
					[theme]="${nameStringToVariableString(json.codeContext?.name)}Theme"
					[href]=${nameStringToVariableString(json.codeContext?.name)}Href
					[disabled]=${nameStringToVariableString(json.codeContext?.name)}Disabled
					${angularClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</ibm-clickable-tile>`;
			}
		},
		reactV10: {
			imports: ['ClickableTile'],
			code: ({ json, fragments, jsonToTemplate }) => {
				return `<ClickableTile
					${json.codeContext?.href !== undefined && json.codeContext?.href !== '' ? `href='${json.codeContext?.href}'` : ''}
					${json.light !== undefined ? `light={${json.light}}` : ''}
					${json.disabled !== undefined ? `disabled={${json.disabled}}` : ''}
					${reactClassNamesFromComponentObj(json)}>
						${json.items.map((element: any) => jsonToTemplate(element, fragments)).join('\n')}
				</ClickableTile>`;
			}
		}
	}
};
