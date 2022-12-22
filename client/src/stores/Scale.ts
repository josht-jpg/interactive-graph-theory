import { writable } from 'svelte/store';

export const scale = writable(1);
export const shift = writable({ x: 0, y: 0 });
