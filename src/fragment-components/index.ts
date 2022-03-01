import * as button from "./a-button";
import * as checkbox from "./a-checkbox";
import * as column from "./a-column";
import * as grid from "./a-grid";
import * as row from "./a-row";
import * as text from "./a-text";
import * as textarea from "./a-textarea";
import * as textinput from "./a-textinput";
import * as searchinput from "./a-searchinput";
import * as numberinput from "./a-numberinput";
// Tiles
import * as tile from './tiles/a-tile';
import * as clickabletile from './tiles/a-clickable-tile';
import * as expandabletile from './tiles/a-expandable-tile';
import * as tilefold from './tiles/a-tile-fold';
import * as selectabletile from './tiles/a-selectable-tile';
import * as selectableTileGroup from './tiles/a-selectable-tile-group';
import * as radiotile from './tiles/a-radio-tile';
import * as radioTileGroup from './tiles/a-radio-tile-group';

export { AButton, AButtonStyleUI } from "./a-button";
export { ACheckbox, ACheckboxStyleUI, ACheckboxCodeUI } from "./a-checkbox";
export { AColumn, AColumnStyleUI } from "./a-column";
export * from "./a-component";
export { AGrid, AGridStyleUI } from "./a-grid";
export { ARow, ARowStyleUI } from "./a-row";
export { AText, ATextStyleUI } from "./a-text";
export { ATextArea, ATextAreaStyleUI, ATextAreaCodeUI } from "./a-textarea";
export { ATextInput, ATextInputStyleUI, ATextInputCodeUI } from "./a-textinput";
export { ASearchInput, ASearchInputStyleUI, ASearchInputCodeUI } from "./a-searchinput";
export { ANumberInput, ANumberInputStyleUI, ANumberInputCodeUI } from "./a-numberinput";
// Tiles
export { ATile, ATileCodeUI, ATileStyleUI } from './tiles/a-tile';
export { AClickableTile, AClickableTileCodeUI, AClickableTileStyleUI } from './tiles/a-clickable-tile';
export { AExpandableTile, AExpandableTileCodeUI, AExpandableStyleUI } from './tiles/a-expandable-tile';
export { ATileFold, ATileFoldStyleUI } from './tiles/a-tile-fold';
export { ASelectableTile, ASelectableTileCodeUI, ASelectableTileStyleUI } from './tiles/a-selectable-tile';
export { ASelectableTileGroup, ASelectableTileGroupCodeUI, ASelectableTileGroupStyleUI } from './tiles/a-selectable-tile-group';
export { ARadioTile, ARadioTileCodeUI, ARadioTileStyleUI } from './tiles/a-radio-tile';
export { ARadioTileGroup, ARadioTileGroupCodeUI, ARadioTileGroupStyleUI } from './tiles/a-radio-tile-group';

export const allComponents = {
	button,
	checkbox,
	column,
	grid,
	row,
	text,
	textarea,
	textinput,
	searchinput,
	numberinput,
	// Tiles
	tile,
	clickabletile,
	expandabletile,
	tilefold,
	selectabletile,
	selectableTileGroup,
	radiotile,
	radioTileGroup
};
