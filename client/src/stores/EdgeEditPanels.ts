import type { Coordinate } from '../interfaces';
import { writable } from 'svelte/store';

export interface EdgeEditPanelInput {
	label: string | null;
	color: string | null;
	labelColor: string | null;
	clickCoordinates: Coordinate;
}

const edgeEditPanels = writable<EdgeEditPanelInput[]>([]);

export default edgeEditPanels;
