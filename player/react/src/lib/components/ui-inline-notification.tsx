import React from 'react';
import { CssClasses, SendSignal } from '../types';
import { InlineNotification } from '@carbon/react';

import { commonSlots, slotsDisabled } from '../common-slots';

export interface InlineNotificationState {
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

export const type = 'inline-notification';

export const signals = ['close'];

export const slots = {
	...commonSlots,
	...slotsDisabled,
	lowContrast: 'boolean',
	setLowContrast: (state: InlineNotificationState) => ({
		...state,
		lowContrast: true
	}),
	setHighContrast: (state: InlineNotificationState) => ({
		...state,
		lowContrast: false
	}),
	toggleContrast: (state: InlineNotificationState) => ({
		...state,
		lowContrast: !state.lowContrast
	}),
	closeButtonHidden: 'boolean',
	hideCloseButton: (state: InlineNotificationState) => ({
		...state,
		closeButtonHidden: true
	}),
	showCloseButton: (state: InlineNotificationState) => ({
		...state,
		closeButtonHidden: false
	}),
	toggleCloseButtonVisibility: (state: InlineNotificationState) => ({
		...state,
		closeButtonHidden: !state.closeButtonHidden
	}),
	type: 'string',
	kind: 'string',
	subtitle: 'string',
	title: 'string',
	caption: 'string'
};

export const UIInlineNotification = ({ state, sendSignal }: {
	state: InlineNotificationState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'inline-notification') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <InlineNotification
		className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}
		kind={state.kind}
		statusIconDescription={state.iconDescription}
		hideCloseButton={state.closeButtonHidden}
		lowContrast={state.lowContrast}
		subtitle={state.subtitle}
		title={state.title}
		onClose={() => sendSignal(state.id, 'close')} />;
};
