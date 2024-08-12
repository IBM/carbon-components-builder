import React from 'react';
import { CssClasses, SendSignal } from '../types';
import {
	ToastNotification
} from '@carbon/react';

import { commonSlots, slotsDisabled } from '../common-slots';

export interface ToastNotificationState {
	id: string;
	type: string;
	iconDescription?: string;
	lowContrast?: boolean;
	closeButtonHidden?: boolean;
	kind?: string;
	subtitle?: string;
	title?: string;
	caption?: string;
	cssClasses?: CssClasses[];
}

export const type = 'toast-notification';

export const signals = ['valueChange', 'click'];

export const slots = {
	...commonSlots,
	...slotsDisabled,
	isLowContrast: 'boolean',
	setLowContrast: (state: ToastNotificationState) => ({
		...state,
		isLowContrast: true
	}),
	setHighContrast: (state: ToastNotificationState) => ({
		...state,
		isLowContrast: false
	}),
	toggleContrast: (state: ToastNotificationState) => ({
		...state,
		isLowContrast: !state.lowContrast
	}),
	closeButtonHidden: 'boolean',
	hideCloseButton: (state: ToastNotificationState) => ({
		...state,
		closeButtonHidden: true
	}),
	showCloseButton: (state: ToastNotificationState) => ({
		...state,
		closeButtonHidden: false
	}),
	toggleCloseButtonVisibility: (state: ToastNotificationState) => ({
		...state,
		closeButtonHidden: !state.closeButtonHidden
	}),
	type: 'string',
	kind: 'string',
	subtitle: 'string',
	title: 'string',
	caption: 'string'
};

export const UIToastNotification = ({ state, sendSignal }: {
	state: ToastNotificationState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'notification') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <ToastNotification
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}
		onClose={() => sendSignal(state.id, 'close')}
		caption={state.caption}
		statusIconDescription={state.iconDescription}
		hideCloseButton={state.closeButtonHidden}
		lowContrast={state.lowContrast}
		kind={state.kind}
		subtitle={state.subtitle}
		title={state.title} />;
};
