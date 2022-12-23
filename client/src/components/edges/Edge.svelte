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
		color?: string;
		label?: string;
		labelColor?: string;
	}
</script>

<script lang="ts">
	import edgeEditPanels from '../../stores/EdgeEditPanels';
	import { scale } from '../../stores/Scale';

	import type { Coordinate } from '../../interfaces';
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
</script>

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
>
	<line
		x1={edge.start.x}
		y1={edge.start.y}
		x2={edge.end.x}
		y2={edge.end.y}
		style={`stroke-width: ${25 * (1 / $scale) /* TODO: fine tune this */};`}
		class="absolute z-20 cursor-pointer stroke-transparent"
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
	/>
	<line
		id={edge.id}
		x1={edge.start.x}
		y1={edge.start.y}
		x2={edge.end.x}
		y2={edge.end.y}
		style={`stroke: ${
			edge.color ?? '#475569'
		}; stroke-width: ${strokeWidth}; opacity: ${strokeOpacity};}`}
		class="absolute z-20 cursor-pointer transition-colors"
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
	/>
</g>
