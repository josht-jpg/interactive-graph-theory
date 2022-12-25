<script lang="ts" context="module">
	export interface IEdge {
		id: string;
		startPercent: Coordinate;
		endPercent: Coordinate;
		start: Coordinate;
		end: Coordinate;
		startNode: number;
		// endNode is optional is because it is not defined when the edge is being created
		endNode?: number;
		// TODO: rename
		quadratic?: Coordinate;
		color?: string;
		label?: string;
		labelColor?: string;
	}
</script>

<script lang="ts">
	import edgeEditPanels from '../../stores/EdgeEditPanels';
	import { scale } from '../../stores/Scale';

	import type { Coordinate } from '../../interfaces';
	import { xlink_attr } from 'svelte/internal';
	export let edge: IEdge;

	let isMouseOver = false;
	let isEditing = false;
	edgeEditPanels.subscribe((panels) => {
		isEditing = panels.some((panel) => panel.edge.id === edge.id);
	});

	let strokeWidth = 2.5;
	$: {
		if (edge.id !== 'drawing-edge' && (isMouseOver || isEditing)) {
			strokeWidth = 4;
		} else {
			strokeWidth = 2.5;
		}
	}

	let strokeOpacity = 0.5;
	$: {
		if (edge.id !== 'drawing-edge' && (isMouseOver || isEditing)) {
			strokeOpacity = 0.8;
		} else {
			strokeOpacity = 0.5;
		}
	}

	let isDragging = false;
	const onMouseUp = () => {
		isDragging = false;
	};

	// TODO: clean up
	let d: string;
	$: {
		// console.log(edge, 'edge')s;

		d = `M ${edge.start.x} ${edge.start.y}${
			!!edge.quadratic
				? ` Q ${edge.quadratic.x} 
			${edge.quadratic.y}`
				: ''
		} ${edge.end.x} ${edge.end.y}`;

		console.log(d, 'd');
	}

	let textX: number;
	let textY: number;

	$: {
		const q2Multiplier = 1.65;
		const yDivisor = 3.65;

		textX = !!edge.quadratic
			? (edge.start.x + edge.end.x + edge.quadratic.x) / 3
			: (edge.start.x + edge.end.x) / 2;
		textY = !!edge.quadratic
			? (edge.start.y + edge.end.y + edge.quadratic.y * q2Multiplier) / yDivisor
			: (edge.start.y + edge.end.y) / 2 - 10;
	}
</script>

<svelte:window on:mouseup={onMouseUp} />

<g
	class="outline-none"
	on:mouseover={() => {
		isMouseOver = true;
	}}
	on:mouseout={() => {
		isMouseOver = false;
	}}
	on:focus={() => {
		isMouseOver = true;
	}}
	on:blur={() => {
		isMouseOver = false;
	}}
	on:mousedown={() => {
		isDragging = true;
	}}
	on:click={(event) => {
		// event.stopPropagation();

		edgeEditPanels.update((panels) => [
			...panels,
			{
				edge,
				clickCoordinates: {
					x: event.clientX,
					y: event.clientY
				}
			}
		]);
	}}
>
	{#if !!edge.label}
		<text x={textX} y={textY} class="font-bold text-lg cursor-pointer opacity-75">{edge.label}</text
		>
	{/if}
	<path
		id={edge.id}
		{d}
		style={`stroke-width: ${25 * (1 / $scale) /* TODO: fine tune this */}; cursor: ${
			isDragging ? 'grabbing' : 'pointer'
		};`}
		fill="none"
		class="absolute z-20 cursor-pointer stroke-transparent fill-none"
	/>
	<path
		{d}
		style={`stroke: ${
			edge.color ?? '#475569'
		}; stroke-width: ${strokeWidth}; opacity: ${strokeOpacity};} cursor: ${
			isDragging ? 'grabbing' : 'pointer'
		};`}
		fill="none"
		class="absolute z-20 transition-colors"
	/>
</g>
