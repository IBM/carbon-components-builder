import React from 'react';
import { BreadcrumbItem } from 'carbon-components-react';
import { commonSlots } from '../common-slots';
import { CssClasses } from '../types';

export interface BreadcrumbItemState {
	type: string;
	items?: any[]; // TODO type
	href?: string;
	id: string | number;
	label: string;
	hidden?: boolean;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export const type = 'breadcrumb-item';

export const slots = {
	...commonSlots
};

export const UIBreadcrumbItem = ({ state }: {
	state: BreadcrumbItemState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: (id: number | string, signal: string) => void;
}) => {
	if (state.type !== 'breadcrumb-item') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	return <BreadcrumbItem
	href={state.href}
	className={state.cssClasses?.map((cc: any) => cc.id).join(' ')}>
		{ state.label }
	</BreadcrumbItem>;
};
