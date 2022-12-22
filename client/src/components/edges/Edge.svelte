<script lang="ts" context="module">
	export interface IEdge {
		id: string;
		startPercent: Coordinate;
		endPercent: Coordinate;
		start: Coordinate;
		end: Coordinate;
		startNode: number;
		endNode?: number;
	}
</script>

<script lang="ts">
	import type { Coordinate } from '../../interfaces';
	export let edge: IEdge | null;
</script>

{#if !!edge}
	<line
		id={edge.id}
		x1={edge.start.x}
		y1={edge.start.y}
		x2={edge.end.x}
		y2={edge.end.y}
		class=" stroke-slate-600 stroke-[2.5] opacity-70 absolute z-20"
	/>
{/if}
