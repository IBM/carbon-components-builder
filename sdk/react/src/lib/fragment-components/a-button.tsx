import React from 'react';
import {
	Button,
	Dropdown,
	TextInput
} from '@carbon/react';
import { css, cx } from 'emotion';
import { AComponent, ComponentInfo } from './a-component';

import image from './../assets/component-icons/button.svg';
import {
	angularClassNamesFromComponentObj,
	getReactCodeForActions,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../helpers/tools';
import { styleObjectToString } from '@carbon-builder/player-react';

export const AButtonSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const kindItems = [
		{ id: 'primary', text: 'Primary' },
		{ id: 'secondary', text: 'Secondary' },
		{ id: 'tertiary', text: 'Tertiary' },
		{ id: 'danger', text: 'Danger' },
		{ id: 'danger--tertiary', text: 'Danger tertiary' },
		{ id: 'danger--ghost', text: 'Danger ghost' },
		{ id: 'ghost', text: 'Ghost' }
	];

	const sizeItems = [
		{ id: 'sm', text: 'Small' },
		{ id: 'md', text: 'Medium' },
		{ id: 'lg', text: 'Large' },
		{ id: 'xl', text: 'Extra large' }
	];

	return <>
		<TextInput
			value={selectedComponent.text}
			labelText='Text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				text: event.currentTarget.value
			})} />
		<Dropdown
			id='kind'
			label='Kind'
			titleText='Kind'
			items={kindItems}
			selectedItem={kindItems.find(item => item.id === selectedComponent.kind)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				kind: event.selectedItem.id
			})} />
		<Dropdown
			id='size'
			label='Select a size'
			titleText='Size'
			items={sizeItems}
			selectedItem={sizeItems.find(item => item.id === selectedComponent.size)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				size: event.selectedItem.id
			})} />
	</>;
};

export const AButtonCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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

export const AButton = ({
	children,
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			<Button
			kind={componentObj.kind}
			size={componentObj.size}
			disabled={componentObj.disabled}
			className={cx(
				componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
				css`${styleObjectToString(componentObj.style)}`
			)}>
				{children}
			</Button>
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AButton,
	settingsUI: AButtonSettingsUI,
	codeUI: AButtonCodeUI,
	render: ({ componentObj, select, remove, selected }) => <AButton
		componentObj={componentObj}
		select={select}
		remove={remove}
		selected={selected}>
			{componentObj.text}
	</AButton>,
	keywords: ['button'],
	name: 'Button',
	type: 'button',
	defaultComponentObj: {
		type: 'button',
		kind: 'primary',
		text: 'Button',
		size: 'lg'
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: (_) => '',
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Clicked = new EventEmitter();`,
				imports: ['ButtonModule'],
				code: ({ json }) => {
					return `<button
						${json.kind ? `cdsButton='${json.kind}'` : 'ibmButton'}
						${json.size ? `size='${json.size === 'default' ? 'normal' : json.size}'` : ''}
						(click)='${nameStringToVariableString(json.codeContext?.name)}Clicked.emit()'
						${angularClassNamesFromComponentObj(json)}>
							${json.text}
					</button>`;
				}
			},
			v10: {
				inputs: (_) => '',
				outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Clicked = new EventEmitter();`,
				imports: ['ButtonModule'],
				code: ({ json }) => {
					const size = json.size === 'default' ? 'normal' : json.size === 'md' ? 'field' : json.size;
					return `<button
						${json.kind ? `ibmButton='${json.kind}'` : 'ibmButton'}
						${json.size ? `size='${size}'` : ''}
						(click)='${nameStringToVariableString(json.codeContext?.name)}Clicked.emit()'
						${angularClassNamesFromComponentObj(json)}>
							${json.text}
					</button>`;
				}
			}
		},
		react: {
			latest: {
				imports: ['Button'],
				code: ({ json, signals, slots }) => {
					return `<Button
						${json.kind && `kind="${json.kind}"`}
						${json.size && `size="${json.size}"`}
						${reactClassNamesFromComponentObj(json)}
						${getReactCodeForActions(signals, slots, json.codeContext?.name)}>${json.text}</Button>`;
				}
			},
			v10: {
				imports: ['Button'],
				code: ({ json, signals, slots }) => {
					return `<Button
						${json.kind && `kind="${json.kind}"`}
						${json.size && `size="${json.size}"`}
						${reactClassNamesFromComponentObj(json)}
						${getReactCodeForActions(signals, slots, json.codeContext?.name)}>${json.text}</Button>`;
				}
			}
		}
	}
};
