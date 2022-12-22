import { writable } from 'svelte/store';

export interface Node {
	id: number;
	x: number;
	y: number;
}

const nodes = writable<Node[]>([]);

export default nodes;
