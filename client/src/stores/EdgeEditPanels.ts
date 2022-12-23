import type { Coordinate } from '../interfaces';
import { writable } from 'svelte/store';
import type { IEdge } from 'src/components/edges/Edge.svelte';

export interface EdgeEditPanelInput {
	edge: IEdge;
	clickCoordinates: Coordinate;
}

const edgeEditPanels = writable<EdgeEditPanelInput[]>([]);

export default edgeEditPanels;
