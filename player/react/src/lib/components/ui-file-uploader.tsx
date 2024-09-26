import React from 'react';
import { CssClasses, SendSignal } from '../types';
import { FileUploaderDropContainer, FileUploader } from '@carbon/react';
import { commonSlots, slotsDisabled } from '../common-slots';

export interface FileUploaderState {
	id: string;
	type: string;
	cssClasses?: CssClasses[];
	acceptedFileFormat: string;
	buttonKind: string;
	buttonLabel: string;
	labelTitle: string;
	filenameStatus: string;
	dragAndDroplabelText: string;
	labelDescription: string;
	iconDescription: string;
	size: string;
	multiple: boolean;
	disabled: boolean;
	dragAndDrop: boolean;
	codeContext?: {
		name: string;
	};
}

export const type = 'file-uploader';

export const signals = ['valueChange', 'click'];

export const slots = {
	...commonSlots,
	...slotsDisabled,
	multiple: 'boolean',
	isMultiple: (state: FileUploaderState) => ({
		...state,
		multiple: true
	}),
	isNotMultiple: (state: FileUploaderState) => ({
		...state,
		multiple: false
	}),
	toggleIsMultiple: (state: FileUploaderState) => ({
		...state,
		multiple: !state.multiple
	}),
	dragAndDrop: 'boolean',
	isDragAndDrop: (state: FileUploaderState) => ({
		...state,
		dragAndDrop: true
	}),
	isNotDragAndDrop: (state: FileUploaderState) => ({
		...state,
		dragAndDrop: false
	}),
	toggleIsDragAndDrop: (state: FileUploaderState) => ({
		...state,
		dragAndDrop: !state.dragAndDrop
	}),
	acceptedFileFormat: 'string',
	type: 'string',
	buttonLabel: 'string',
	labelTitle: 'string',
	filenameStatus: 'string',
	dragAndDroplabelText: 'string',
	labelDescription: 'string',
	iconDescription: 'string',
	size: 'string',
	id: 'string'
};

export const UIFileUploader = ({ state, sendSignal }: {
	state: FileUploaderState;
	setState: (state: any) => void;
	setGlobalState: (state: any) => void;
	sendSignal: SendSignal;
}) => {
	if (state.type !== 'file-uploader') {
		// eslint-disable-next-line react/jsx-no-useless-fragment
		return <></>;
	}

	if (state.dragAndDrop) {
		return <FileUploaderDropContainer
			onClick={() => {
				sendSignal(state.id, 'click');
			}}
			onChange={(event: any) => {
				sendSignal(state.id, 'valueChange', [event.value], { ...state, value: event.value });
			}}
			accept={state.acceptedFileFormat.split(',')}
			multiple={state.multiple}
			disabled={state.disabled}
			labelText={state.dragAndDroplabelText}
			tabIndex={0} />;
	}

	return <FileUploader
		accept={state.acceptedFileFormat.split(',')}
		buttonKind={state.buttonKind}
		buttonLabel={state.buttonLabel}
		filenameStatus={state.filenameStatus}
		iconDescription={state.iconDescription}
		labelDescription={state.labelDescription}
		labelTitle={state.labelTitle}
		multiple={state.multiple}
		disabled={state.disabled}
		size={state.size} />;
};
