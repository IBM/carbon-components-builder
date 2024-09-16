import React from 'react';
import {
	Checkbox,
	FlexGrid,
	TextInput
} from '@carbon/react';
import { AComponent } from './a-component';
import { css, cx } from 'emotion';
import { ComponentInfo } from '.';

import image from './../assets/component-icons/grid.svg';
import { angularClassNamesFromComponentObj, reactClassNamesFromComponentObj } from '../helpers/tools';
import { styleObjectToString } from '@carbon-builder/player-react';

export const AGridSettingsUI = ({ selectedComponent, setComponent }: any) => {
	return <>
		<Checkbox
			labelText='Show outline'
			id='grid-outline'
			checked={selectedComponent.outline}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				outline: checked
			})} />
		<Checkbox
			labelText='Condensed'
			id='grid-condensed'
			checked={selectedComponent.condensed}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				condensed: checked
			})} />
		<Checkbox
			labelText='Full width'
			id='grid-fullWidth'
			checked={selectedComponent.fullWidth}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				fullWidth: checked
			})} />
		<Checkbox
			labelText='Narrow'
			id='grid-narrow'
			checked={selectedComponent.narrow}
			onChange={(_: any, { checked }: any) => setComponent({
				...selectedComponent,
				narrow: checked
			})} />
	</>;
};

// there must be a better way to do this...
const outlineStyle = css`
	.cds--col,
	.cds--col-sm-1, .cds--col-sm-2, .cds--col-sm-3, .cds--col-sm-4,
	.cds--col-md-1, .cds--col-md-2, .cds--col-md-3, .cds--col-md-4, .cds--col-md-5, .cds--col-md-6, .cds--col-md-7, .cds--col-md-8,
	.cds--col-lg-1, .cds--col-lg-2, .cds--col-lg-3, .cds--col-lg-4, .cds--col-lg-5, .cds--col-lg-6, .cds--col-lg-7, .cds--col-lg-8,
	.cds--col-lg-9, .cds--col-lg-10, .cds--col-lg-11, .cds--col-lg-12, .cds--col-lg-13, .cds--col-lg-14, .cds--col-lg-15, .cds--col-lg-16,
	.cds--offset-sm-1, .cds--offset-sm-2, .cds--offset-sm-3,
	.cds--offset-md-1, .cds--offset-md-2, .cds--offset-md-3, .cds--offset-md-4, .cds--offset-md-5, .cds--offset-md-6, .cds--offset-md-7,
	.cds--offset-lg-1, .cds--offset-lg-2, .cds--offset-lg-3, .cds--offset-lg-4, .cds--offset-lg-5, .cds--offset-lg-6, .cds--offset-lg-7,
	.cds--offset-lg-8, .cds--offset-lg-9, .cds--offset-lg-10, .cds--offset-lg-11, .cds--offset-lg-12, .cds--offset-lg-13, .cds--offset-lg-14,
	.cds--offset-lg-15 {
		outline: 1px dashed #78a9ff;
	}
`;

export const AGridCodeUI = ({ selectedComponent, setComponent }: any) => <TextInput
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
	}} />;

export const AGrid = ({
	children,
	componentObj,
	outline,
	...rest
}: any) => {
	return (
		<AComponent componentObj={componentObj} rejectDrop={true} {...rest}>
			<FlexGrid
			className={cx(
				css`${styleObjectToString(componentObj.style)}`,
				componentObj.cssClasses?.map((cc: any) => cc.id).join(' '),
				(componentObj.outline || outline === true) && outline !== false ? outlineStyle : ''
			)}
			condensed={componentObj.condensed}
			fullWidth={componentObj.fullWidth}
			narrow={componentObj.narrow}>
				{children}
			</FlexGrid>
		</AComponent>
	);
};

const getCellAttributeStringReact = (cell: any, sizeShort: string, sizeLong: string) => {
	const span = cell[`${sizeLong}Span`];
	const offset = cell[`${sizeLong}Offset`];

	if (!span && !offset) {
		return '';
	}

	const spanString = `span: ${span}`;
	const offsetString = `offset: ${offset}`;

	const spanAndOffset = `{
		${span ? spanString : ''}${span && offset ? ',' : ''}
		${offset ? offsetString : ''}
	}`;

	return `${sizeShort}={${!offset ? span : spanAndOffset}}`;
};

const getCellParamsStringReact = (cell: any) => {
	return `
		${getCellAttributeStringReact(cell, 'sm', 'small')}
		${getCellAttributeStringReact(cell, 'md', 'medium')}
		${getCellAttributeStringReact(cell, 'lg', 'large')}
		${getCellAttributeStringReact(cell, 'xlg', 'xLarge')}
		${getCellAttributeStringReact(cell, 'max', 'max')}
	`;
};

const getCellAttributeStringAngular = (cell: any, sizeShort: string, sizeLong: string, attributeType: string) => {
	const attribute = cell[`${sizeLong}${attributeType}`];

	if (!attribute) {
		return '';
	}

	return `'${sizeShort}': ${attribute}`;
};

const getColumnNumbersString = (cell: any) => {
	if (!(cell.smallSpan || cell.mediumSpan || cell.largeSpan || cell.xLargeSpan || cell.maxSpan)) {
		return ''; // no offset
	}

	return `[columnNumbers]="{
		${getCellAttributeStringAngular(cell, 'sm', 'small', 'Span')}
		${getCellAttributeStringAngular(cell, 'md', 'medium', 'Span')}
		${getCellAttributeStringAngular(cell, 'lg', 'large', 'Span')}
		${getCellAttributeStringAngular(cell, 'xlg', 'xLarge', 'Span')}
		${getCellAttributeStringAngular(cell, 'max', 'max', 'Span')}
	}"`;
};

const getOffsetsString = (cell: any) => {
	if (!(cell.smallOffset || cell.mediumOffset || cell.largeOffset || cell.xLargeOffset || cell.maxOffset)) {
		return ''; // no offset
	}

	return `[offsets]="{
		${getCellAttributeStringAngular(cell, 'sm', 'small', 'Offset')}
		${getCellAttributeStringAngular(cell, 'md', 'medium', 'Offset')}
		${getCellAttributeStringAngular(cell, 'lg', 'large', 'Offset')}
		${getCellAttributeStringAngular(cell, 'xlg', 'xLarge', 'Offset')}
		${getCellAttributeStringAngular(cell, 'max', 'max', 'Offset')}
	}"`;
};

export const componentInfo: ComponentInfo = {
	component: AGrid,
	codeUI: AGridCodeUI,
	settingsUI: AGridSettingsUI,
	keywords: ['grid', 'row', 'column'],
	name: 'Grid',
	type: 'grid',
	defaultComponentObj: {
		type: 'grid',
		outline: true,
		items: [
			{
				type: 'row', items: [
					{ type: 'column', items: [] },
					{ type: 'column', items: [] }
				]
			},
			{
				type: 'row', items: [
					{ type: 'column', items: [] },
					{ type: 'column', items: [] }
				]
			}
		]
	},
	image,
	codeExport: {
		angular: {
			latest: {
				inputs: (_) => '',
				outputs: (_) => '',
				imports: ['GridModule'],
				code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<div cdsGrid ${angularClassNamesFromComponentObj(json)}>
						${json.items.map((row: any) => `<div cdsRow ${angularClassNamesFromComponentObj(row)}>
							${row.items.map((cell: any) =>
								`<div cdsCol ${getColumnNumbersString(cell)} ${getOffsetsString(cell)} ${angularClassNamesFromComponentObj(cell)}>
									${jsonToTemplate(cell, fragments, customComponentsCollections)}
							</div>`).join('\n')}
						</div>`).join('\n')}
					</div>`;
				}
			},
			v10: {
				inputs: (_) => '',
				outputs: (_) => '',
				imports: ['GridModule'],
				code: ({ json, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<div ibmGrid ${angularClassNamesFromComponentObj(json)}>
						${json.items.map((row: any) => `<div ibmRow ${angularClassNamesFromComponentObj(row)}>
							${row.items.map((cell: any) =>
								`<div ibmCol ${getColumnNumbersString(cell)} ${getOffsetsString(cell)} ${angularClassNamesFromComponentObj(cell)}>
									${jsonToTemplate(cell, fragments, customComponentsCollections)}
							</div>`).join('\n')}
						</div>`).join('\n')}
					</div>`;
				}
			}
		},
		react: {
			latest: {
				imports: ['FlexGrid', 'Column', 'Row'],
				code: ({ json, signals, slots, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<FlexGrid ${reactClassNamesFromComponentObj(json)}>
						${json.items.map((row: any) => `<Row ${reactClassNamesFromComponentObj(row)}>
							${row.items.map((cell: any) => `<Column ${getCellParamsStringReact(cell)} ${reactClassNamesFromComponentObj(cell)}>
									${jsonToTemplate(cell, signals, slots, fragments, customComponentsCollections)}
							</Column>`).join('\n')}
						</Row>`).join('\n')}
					</FlexGrid>`;
				}
			},
			v10: {
				imports: ['Grid', 'Column', 'Row'],
				code: ({ json, signals, slots, fragments, jsonToTemplate, customComponentsCollections }) => {
					return `<Grid ${reactClassNamesFromComponentObj(json)}>
						${json.items.map((row: any) => `<Row ${reactClassNamesFromComponentObj(row)}>
							${row.items.map((cell: any) => `<Column ${getCellParamsStringReact(cell)} ${reactClassNamesFromComponentObj(cell)}>
									${jsonToTemplate(cell, signals, slots, fragments, customComponentsCollections)}
							</Column>`).join('\n')}
						</Row>`).join('\n')}
					</Grid>`;
				}
			}
		}
	}
};
