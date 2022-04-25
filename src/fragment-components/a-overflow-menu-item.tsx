import React from 'react';
import {
	OverflowMenuItem,
	Checkbox,
	TextInput
} from 'carbon-components-react';
import { AComponent, ComponentInfo } from './a-component';
import { ComponentCssClassSelector } from '../components/css-class-selector';
import { useFragment } from '../context';
import {
	getParentComponent,
	updatedState,
	Adder
} from '../components';

import { css } from 'emotion';
import { reactClassNamesFromComponentObj,
	nameStringToVariableString,
	angularClassNamesFromComponentObj } from '../utils/fragment-tools';

export const AOverflowMenuItemStyleUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<Checkbox
			labelText='Disabled'
			id='disabled'
			checked={selectedComponent.disabled}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				disabled: checked
		})} />
		<Checkbox
			labelText='Is delete'
			id='isDelete'
			checked={selectedComponent.isDelete}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				isDelete: checked
		})} />
		<ComponentCssClassSelector componentObj={selectedComponent} setComponent={setComponent}/>
	</>;
};

export const AOverflowMenuItemCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<Checkbox
			labelText='Has link'
			id='hasLink'
			checked={selectedComponent.hasLink}
			onChange={(checked: boolean) => setComponent({
				...selectedComponent,
				hasLink: checked,
				link: checked ? selectedComponent.link : ''
		})} />
		<TextInput
			value={selectedComponent.itemText}
			labelText='Label'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					itemText: event.currentTarget.value
				});
			}}
		/>
		<TextInput
			value={selectedComponent.link}
			disabled= {!selectedComponent.hasLink}
			labelText='Link'
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
						link: event.currentTarget.value
				});
			}}
		/>
	</>;
};

const addButtonStyle = css`
	position: relative;
`;
const headingStyle = css`
	width: 12rem;
`;

export const AOverflowMenuItem = ({
	componentObj,
	selected,
	...rest
}: any) => {
	const [fragment, setFragment] = useFragment();
	const parentComponent = getParentComponent(fragment.data, componentObj);

	const addItem = (offset = 0) => setFragment({
		...fragment,
		data: updatedState(
			fragment.data,
			{
				type: 'insert',
				component: {
					type: 'overflow-menu-item',
					itemText: 'New Option',
					className: componentObj.id,
					disabled: false,
					hasLink: false,
					isDelete: false,
					link: ''
				}
			},
			parentComponent.id,
			parentComponent.items.indexOf(componentObj) + offset
		)
	});
	// Prevent users from being redirected
	const onClick = (event: any) => {
		event.preventDefault();
	};
	return (
		<Adder
		active={selected}
		key={componentObj.id}
		addButtonsCss={addButtonStyle}
		leftAction= {() => addItem(0)}
		bottomAction={() => addItem(1)}>
			<AComponent
			headingCss={headingStyle}
			selected={selected}
			className={css`width: 100%;`}
			componentObj={componentObj}
			{...rest}>
				<OverflowMenuItem
					onClick={onClick}
					isDelete={componentObj.isDelete}
					className={componentObj.className}
					href={componentObj.hasLink ? componentObj.link : undefined}
					itemText={componentObj.itemText}
					disabled= {componentObj.disabled}
					/>
			</AComponent>
		</Adder>
	);
};

export const componentInfo: ComponentInfo = {
	component: AOverflowMenuItem,
	styleUI: AOverflowMenuItemStyleUI,
	codeUI: AOverflowMenuItemCodeUI,
	render: ({ componentObj, select, remove, selected }) => <AOverflowMenuItem
	componentObj={componentObj}
	select={select}
	remove={remove}
	selected={selected}>
	</AOverflowMenuItem>,
	keywords: ['overflow', 'item'],
	name: 'Overflow menu item',
	type: 'overflow-menu-item',
	defaultComponentObj: {
		type: 'overflow-menu-item'
	},
	image: undefined,
	hideFromElementsPane: true,
	codeExport: {
		angular: {
			inputs: ({ json }) => `@Input() ${nameStringToVariableString(json.codeContext?.name)}Disabled = ${json.disabled};
									@Input() ${nameStringToVariableString(json.codeContext?.name)}Link = "${json.link}"`,
			outputs: ({ json }) => `@Output() ${nameStringToVariableString(json.codeContext?.name)}Selected = new EventEmitter();
									@Output() ${nameStringToVariableString(json.codeContext?.name)}Clicked = new EventEmitter();`,
			imports: [''],
			code: ({ json }) => {
				return `<ibm-overflow-menu-option
							${json.isDelete ? "type='danger'" : ''}
							${json.hasLink ? `href="${nameStringToVariableString(json.codeContext?.name)}Link"` : ''}
							${json.disabled ? `disabled="${nameStringToVariableString(json.codeContext?.name)}Disabled"` : '' }
							(selected)="${nameStringToVariableString(json.codeContext?.name)}Selected.emit($event)" 
							(click)="${nameStringToVariableString(json.codeContext?.name)}Clicked.emit($event)"
							${angularClassNamesFromComponentObj(json)}>
								${json.itemText}
					</ibm-overflow-menu-option>`;
			}
		},
		react: {
			imports: ['OverflowMenuItem'],
			code: ({ json }) => {
				return `<OverflowMenuItem 
							${json.hasLink ? `href="${json.link}"` : ''}
							${json.isDelete !== undefined ? `isDelete={${json.isDelete}}` : ''}
							disabled={${json.disabled}}
							itemText="${json.itemText}" 
							${reactClassNamesFromComponentObj(json)}/>`;
			}
		}
	}
};
