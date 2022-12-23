import type { Coordinate } from '../interfaces';
import { writable } from 'svelte/store';
import type { IEdge } from 'src/components/edges/Edge.svelte';

const edges = writable<IEdge[]>([]);

export default edges;
