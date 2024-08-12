import React from 'react';
import { AComponent, ComponentInfo } from './a-component';
import image from './../assets/component-icons/toast-notification.svg';
import { css, cx } from 'emotion';
import {
	Dropdown,
	Checkbox,
	TextInput,
	ToastNotification
} from '@carbon/react';
import {
	angularClassNamesFromComponentObj,
	nameStringToVariableString,
	reactClassNamesFromComponentObj
} from '../helpers/tools';

const preventCheckEventStyle = css`
	pointer-events: none;
`;

export const AToastNotificationSettingsUI = ({ selectedComponent, setComponent }: any) => {
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
		<TextInput
			light
			value={selectedComponent.caption}
			labelText='Caption text'
			onChange={(event: any) => setComponent({
				...selectedComponent,
				caption: event.currentTarget.value
			})} />
	</>;
};

export const AToastNotificationCodeUI = ({ selectedComponent, setComponent }: any) => {
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

export const AToastNotification = ({
	componentObj,
	...rest
}: any) => {
	return (
		<AComponent
		componentObj={componentObj}
		rejectDrop={true}
		{...rest}>
			<ToastNotification
				className={cx(preventCheckEventStyle, componentObj.cssClasses?.map((cc: any) => cc.id).join(' '))}
				caption={componentObj.caption}
				hideCloseButton={componentObj.closeButtonHidden}
				lowContrast={componentObj.lowContrast}
				kind={componentObj.kind}
				subtitle={componentObj.subtitle}
				title={componentObj.title} />
		</AComponent>
	);
};

export const componentInfo: ComponentInfo = {
	component: AToastNotification,
	settingsUI: AToastNotificationSettingsUI,
	codeUI: AToastNotificationCodeUI,
	keywords: ['notification', 'toast', 'notify', 'alert'],
	name: 'Toast notification',
	type: 'toast-notification',
	defaultComponentObj: {
		type: 'toast-notification'
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: ({ json }) => `
				@Input() ${nameStringToVariableString(json.codeContext?.name)}NotificationObj: any = {
					type: "${json.kind ? json.kind : 'error'}",
					title: "${json.title ? json.title : ''}",
					subtitle: "${json.subtitle ? json.subtitle : ''}",
					caption: "${json.caption ? json.caption : ''}",
					lowContrast:${!!json.lowContrast},
					showClose: ${!!json.closeButtonHidden}
				};`,
				outputs: () => '',
				imports: ['NotificationModule', 'ButtonModule'],
				code: ({ json }) => `<cds-toast
					${angularClassNamesFromComponentObj(json)}
					[notificationObj]="${nameStringToVariableString(json.codeContext?.name)}NotificationObj">
				</cds-toast>`
			},
			v10: {
				inputs: ({ json }) => `
				@Input() ${nameStringToVariableString(json.codeContext?.name)}NotificationObj: any = {
					type: "${json.kind ? json.kind : 'error'}",
					title: "${json.title ? json.title : ''}",
					subtitle: "${json.subtitle ? json.subtitle : ''}",
					caption: "${json.caption ? json.caption : ''}",
					lowContrast:${!!json.lowContrast},
					showClose: ${!!json.closeButtonHidden}
				};`,
				outputs: () => '',
				imports: ['NotificationModule', 'ButtonModule'],
				code: ({ json }) => `<ibm-toast
					${angularClassNamesFromComponentObj(json)}
					[notificationObj]="${nameStringToVariableString(json.codeContext?.name)}NotificationObj">
				</ibm-toast>`
			}
		},
		react: {
			latest: {
				imports: ['ToastNotification'],
				code: ({ json }) => `<ToastNotification
					caption="${json.caption ? json.caption : ''}"
					hideCloseButton={${!!json.closeButtonHidden}}
					lowContrast={${!!json.lowContrast}}
					kind="${json.kind ? json.kind : 'error'}"
					${json.subtitle ? `subtitle="${json.subtitle}"`: ''}
					timeout={${0}}
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
				imports: ['ToastNotification'],
				code: ({ json }) => `<ToastNotification
					caption="${json.caption ? json.caption : ''}"
					hideCloseButton={${!!json.closeButtonHidden}}
					lowContrast={${!!json.lowContrast}}
					kind="${json.kind ? json.kind : 'error'}"
					${json.subtitle ? `subtitle="${json.subtitle}"`: ''}
					timeout={${0}}
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
