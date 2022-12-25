<script lang="ts" context="module">
	export interface INode {
		id: string;
		xPercent: number;
		yPercent: number;
		x: number;
		y: number;
	}
</script>

<script lang="ts">
	export let node: INode;
	export let isDragging: boolean;
	export let isShiftDown: boolean;
</script>

<circle
	id={node.id}
	class={`absolute outline outline-1 outline-slate-500  ${
		isDragging ? 'cursor-grabbing' : isShiftDown ? 'cursor-crosshair' : 'cursor-grab'
	} hover:shadow-color-purple-600 rounded-full `}
	fill="white"
	filter="drop-shadow(gray 0 0 4px)"
	cx={node.x}
	cy={node.y}
	r="20"
/>
