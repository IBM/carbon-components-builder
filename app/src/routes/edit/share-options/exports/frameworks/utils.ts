import { Action } from 'player/react/src/lib/types';
import { format as formatPrettier, Options } from 'prettier';

export const format = (source: string, options?: Options | undefined) => {
	// we're catching and ignorring errors so live editing doesn't throw errors
	try {
		return formatPrettier(source, options);
	} catch (_) {
		return source;
	}
};

export const getIdContextNameMap = (json: any, itemIds: Set<any>, map: any) => {
	if (typeof json === 'string' || !json) {
		return json;
	}

	if (json.items) {
		json.items.forEach((item: any) => {
			if (itemIds.has(item.id)) {
				map[item.id] = item.codeContext?.name;
			}
			map = getIdContextNameMap(item, itemIds, map);
		});
	}

	return map;
};

export const getReactActionsMap = (json: any) => {
	const signalReactEvent: any = {
		click: 'onClick',
		change: 'onChange',
	};

	const signals: any = {};
	const slots: any = {};
	if (json.actions) {
		json.actions.forEach((action: Action) => {
			const itemIdsWithActions = new Set(json.actions.map((action: Action) => [action.source, action.destination]).flat());
			const idContextNameMap = getIdContextNameMap(json, itemIdsWithActions, {});
			const eventName = signalReactEvent[action.signal];
			if (!signals[idContextNameMap[action.source]]) {
				signals[idContextNameMap[action.source]] = {};
			}
			if (!signals[idContextNameMap[action.source]][eventName]) {
				signals[idContextNameMap[action.source]][eventName] = {};
			}
			if (!signals[idContextNameMap[action.source]][eventName][idContextNameMap[action.destination]]) {
				signals[idContextNameMap[action.source]][eventName][idContextNameMap[action.destination]] = [];
			}
			signals[idContextNameMap[action.source]][eventName][idContextNameMap[action.destination]].push(action.slot);

			if (!slots[idContextNameMap[action.destination]]) {
				slots[idContextNameMap[action.destination]] = new Set<string>();
			}
			slots[idContextNameMap[action.destination]].add(action.slot);
		});
	}
	
	return { 
		signals: signals,
		slots: slots 
	};
}