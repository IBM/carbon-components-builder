import React from 'react';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@carbon/react';
import { CssClasses, SendSignal } from '../types';
import { renderComponents, setItemInState } from '../utils';
import { cx } from 'emotion';
import { commonSlots, slotsDisabled } from '../common-slots';

export interface TabsState {
	type: string;
	id: string | number;
	tabType: string;
	isFollowFocused: boolean;
	isCacheActive: boolean;
	isNavigation: boolean;
	items?: [];
	selectedTab: number;
	cssClasses?: CssClasses[];
	codeContext?: {
		name: string;
	};
}

export interface TabState {
	type: string;
	id?: string | number;
	disabled?: boolean;
	label: string;
	items?: any[];
	cssClasses?: CssClasses[];
	codeContext: {
		name?: string;
	};
}

export const type = 'tabs';

export const signals = ['click'];

export const slots = {
	...commonSlots,
	...slotsDisabled,
	type: 'string',
	isFollowFocused: 'boolean',
	followFocus: (state: TabsState) => ({
		...state,
		isFollowFocused: true
	}),
	deFollowFocus: (state: TabsState) => ({
		...state,
		isFollowFocused: false
	}),
	toggleFollowFocus: (state: TabsState) => ({
		...state,
		isFollowFocused: !state.isFollowFocused
	}),
	isCacheActive: 'boolean',
	cacheActive: (state: TabsState) => ({
		...state,
		isCacheActive: true
	}),
	deCacheActive: (state: TabsState) => ({
		...state,
		isCacheActive: false
	}),
	toggleCacheActive: (state: TabsState) => ({
		...state,
		isCacheActive: !state.isCacheActive
	}),
	isNavigation: 'boolean',
	navigation: (state: TabsState) => ({
		...state,
		isNavigation: true
	}),
	deNavigation: (state: TabsState) => ({
		...state,
		isNavigation: false
	}),
	toggleNavigation: (state: TabsState) => ({
		...state,
		isNavigation: !state.isNavigation
	})
};

export const UITabs = ({ state, setState, setGlobalState, sendSignal }: {
	state: TabsState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'tabs') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}
	return <Tabs>
		<TabList aria-label='List of tabs' {...(state.tabType !== 'line' ? { contained: true } : {})}>
			{
				state.items?.map((step: any, index: any) => <Tab
					className={cx(step.className, step.cssClasses?.map((cc: any) => cc.id).join(' '))}
					onClick={(i: any) => state.selectedTab = i}
					key= {index}
					disabled={step.disabled}>
						{step.labelText}
					</Tab>)
			}
		</TabList>
		<TabPanels>
			{
				state.items?.map((step: any, index: any) => {
					const setTabItem = (i: any) => setItemInState(i, step, setState);
					return <TabPanel key={index}>
						{
							step.items?.map((element: any) => {
								const setItem = (j: any) => setItemInState(j, element, setTabItem);
								return renderComponents(element, setItem, setGlobalState, sendSignal);
							})
						}
					</TabPanel>;
				})
			}
		</TabPanels>
	</Tabs>;
};
