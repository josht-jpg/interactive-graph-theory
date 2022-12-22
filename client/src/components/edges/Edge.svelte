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

	import type { Coordinate } from '../../interfaces';
	// import EditEdgeForm from './EditEdgePanel.svelte';
	export let edge: IEdge | null;
</script>

<!-- {#if !!clickCoordinates}
	<EditEdgeForm
		label={edge?.label}
		color={edge?.color}
		labelColor={edge?.labelColor}
		{clickCoordinates}
	/>
{/if} -->

{#if !!edge}
	<line
		id={edge.id}
		x1={edge.start.x}
		y1={edge.start.y}
		x2={edge.end.x}
		y2={edge.end.y}
		class=" stroke-slate-600 stroke-[2.5] opacity-70 absolute z-20 cursor-pointer hover:stroke-purple-600 hover:opacity-90 transition-colors"
		on:click={(event) => {
			// event.stopPropagation();

			edgeEditPanels.update((panels) => [
				...panels,
				{
					label: edge.label,
					color: edge.color,
					labelColor: edge.labelColor,
					clickCoordinates: {
						x: event.clientX,
						y: event.clientY
					}
				}
			]);
		}}
	/>
{/if}
