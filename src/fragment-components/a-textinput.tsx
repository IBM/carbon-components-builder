import React from 'react';
import { TextInput, Dropdown } from 'carbon-components-react';
import { AComponent } from './a-component';
import { css } from 'emotion';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/text-input.svg';
import { angularClassNamesFromComponentObj, reactClassNamesFromComponentObj } from '../utils/fragment-tools';

export const ATextInputStyleUI = ({ selectedComponent, setComponent }: any) => {
	const typeItems = [
		{ id: 'text', text: 'Text' },
		{ id: 'email', text: 'Email' },
		{ id: 'password', text: 'Password' }
	];

	return <>
		<Dropdown
			label='Type'
			titleText='Type'
			items={typeItems}
			initialSelectedItem={typeItems.find(item => item.id === selectedComponent.inputType)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => setComponent({
				...selectedComponent,
				inputType: event.selectedItem.id
			})} />
		<TextInput
			value={selectedComponent.label}
			labelText='Label'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					label: event.currentTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.helperText}
			labelText='Helper text'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					helperText: event.currentTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.placeholder}
			labelText='Placeholder'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					placeholder: event.currentTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.defaultValue}
			labelText='Default value'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					defaultValue: event.currentTarget.value
				});
			}}
		/>
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent} />
	</>;
};

export const ATextInputCodeUI = ({ selectedComponent, setComponent }: any) => {
	return (
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
			}}
		/>
	);
};

export const ATextInput = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		headingCss={css`display: block;`}
		className={css`position: relative; display: flex`}
		{...rest}>
			<TextInput
				type={componentObj.inputType}
				labelText={componentObj.label}
				className={componentObj.cssClasses?.map((cc: any) => cc.id).join(' ')}
				{...componentObj}
				{...rest} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: ATextInput,
	styleUI: ATextInputStyleUI,
	codeUI: ATextInputCodeUI,
	keywords: ['text', 'text', 'input'],
	name: 'Text input',
	defaultComponentObj: {
		type: 'textinput',
		label: 'Text input label',
		placeholder: 'Text input placeholder',
		helperText: 'Helper text',
		inputType: 'text'
	},
	image,
	codeExport: {
		angular: {
			inputs: (_) => '',
			outputs: (_) => '',
			imports: ['InputModule'],
			code: ({ json }) => {
				return `<ibm-label
					helperText="${json.helperText}">
						${json.label}
						<input
							ibmText
							${angularClassNamesFromComponentObj(json)}
							name="${json.codeContext?.name}"
							placeholder="${json.placeholder}">
				</ibm-label>`;
			}
		},
		react: {
			imports: ['TextInput'],
			code: ({ json }) => {
				return `<TextInput
					labelText="${json.label}"
					name="${json.codeContext?.name}"
					helperText="${json.helperText}"
					placeholder="${json.placeholder}"
					value={state["${json.codeContext?.name}"]}
					${reactClassNamesFromComponentObj(json)}
					onChange={handleInputChange} />`;
			}
		}
	}
};
