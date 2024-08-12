import React from 'react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/inline-notification.svg';
import { css, cx } from 'emotion';
import {
	Dropdown,
	Checkbox,
	TextInput,
	InlineNotification
} from '@carbon/react';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../helpers/tools';

const preventCheckEventStyle = css`
	pointer-events: none;
`;

export const AInlineNotificationSettingsUI = ({ selectedComponent, setComponent }: any) => {
	const kind = [
		{ id: 'error', text: 'Error' },
		{ id: 'info', text: 'Info' },
		{ id: 'info-square', text: 'Info square' },
		{ id: 'success', text: 'Success' },
		{ id: 'warning', text: 'Warning' },
		{ id: 'warning-alt', text: 'Alternative warning' }
	];

	return <>
		<Checkbox
			labelText='Hide close button'
			id='hide-close-button'
			checked={selectedComponent.closeButtonHidden}
			onChange={(_: any, { checked }: any) => {
				setComponent({
					...selectedComponent,
					closeButtonHidden: checked
				});
			}} />
		<Checkbox
			labelText='Low contrast'
			id='low-contrast'
			checked={selectedComponent.lowContrast}
			onChange={(_: any, { checked }: any) => {
				setComponent({
					...selectedComponent,
					lowContrast: checked
				});
			}} />
		<Dropdown
			id='notification-kind'
			label='Notification kind'
			titleText='Notification kind'
			items={kind}
			selectedItem={kind.find(item => item.id === selectedComponent.kind)}
			itemToString={(item: any) => (item ? item.text : '')}
			onChange={(event: any) => {
				setComponent({
					...selectedComponent,
					kind: event.selectedItem.id
				});
			}} />
		<TextInput
			light
			value={selectedComponent.title}
			labelText='Title'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				title: event.currentTarget.value
			})} />
		<TextInput
			light
			value={selectedComponent.subtitle}
			labelText='Subtitle text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				subtitle: event.currentTarget.value
			})} />
	</>;
};

export const AInlineNotificationCodeUI = ({ selectedComponent, setComponent }: any) => {
	return <TextInput
		id='input-name'
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
	/>;
};

export const AInlineNotification = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			<InlineNotification
				className={cx(preventCheckEventStyle, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
				kind={componentObj.kind}
				hideCloseButton={componentObj.closeButtonHidden}
				lowContrast={componentObj.lowContrast}
				subtitle={componentObj.subtitle}
				title={componentObj.title} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AInlineNotification,
	settingsUI: AInlineNotificationSettingsUI,
	codeUI: AInlineNotificationCodeUI,
	keywords: ['notification', 'inline', 'notify', 'alert'],
	name: 'Inline notification',
	type: 'inline-notification',
	defaultComponentObj: {
		type: 'inline-notification',
		title: 'Information',
		subtitle: 'Something important happened.'
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `
				@Input() ${nameStringToVariableString(json.codeContext?.name)}NotificationObj: any = {
					type: "${json.kind ? json.kind : 'error'}",
					title: "${json.title ? json.title : ''}",
					message: "${json.caption ? json.caption : ''}",
					lowContrast: ${!!json.lowContrast},
					showClose: ${!!json.closeButtonHidden}
				};`,
				outputs: () => '',
				imports: ['NotificationModule', 'ButtonModule'],
				code: ({ json }) => `<cds-inline-notification
					${angularClassNamesFromComponentObj(json)}
					[notificationObj]="${nameStringToVariableString(json.codeContext?.name)}NotificationObj">
				</cds-inline-notification>`
			},
			v10: {
				inputs: ({ json }) => `
				@Input() ${nameStringToVariableString(json.codeContext?.name)}NotificationObj: any = {
					type: "${json.kind ? json.kind : 'error'}",
					title: "${json.title ? json.title : ''}",
					message: "${json.caption ? json.caption : ''}",
					lowContrast: ${!!json.lowContrast},
					showClose: ${!!json.closeButtonHidden}
				};`,
				outputs: () => '',
				imports: ['NotificationModule', 'ButtonModule'],
				code: ({ json }) => `<ibm-notification
					${angularClassNamesFromComponentObj(json)}
					[notificationObj]="${nameStringToVariableString(json.codeContext?.name)}NotificationObj">
				</ibm-notification>`
			}
		},
		react: {
			latest: {
				imports: ['InlineNotification'],
				code: ({ json }) => `<InlineNotification
					kind="${json.kind ? json.kind : 'error'}"
					hideCloseButton={${!!json.closeButtonHidden}}
					lowContrast={${!!json.lowContrast}}
					${json.subtitle ? `subtitle={<span>${json.subtitle}</span>}`: ''}
					title="${json.title ? json.title : ''}"
					onClose={(selectedItem) => handleInputChange({
						target: {
							name: "${nameStringToVariableString(json.codeContext?.name)}",
							value: selectedItem
						}
					})}
					${reactClassNamesFromComponentObj(json)} />`
			},
			v10: {
				imports: ['InlineNotification'],
				code: ({ json }) => `<InlineNotification
					kind="${json.kind ? json.kind : 'error'}"
					hideCloseButton={${!!json.closeButtonHidden}}
					lowContrast={${!!json.lowContrast}}
					${json.subtitle ? `subtitle={<span>${json.subtitle}</span>}`: ''}
					title="${json.title ? json.title : ''}"
					onClose={(selectedItem) => handleInputChange({
						target: {
							name: "${nameStringToVariableString(json.codeContext?.name)}",
							value: selectedItem
						}
					})}
					${reactClassNamesFromComponentObj(json)} />`
			}
		}
	}
};
