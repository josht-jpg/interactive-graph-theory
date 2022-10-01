<script lang="ts" context="module">
	export interface INode {
		id: number;
		xPercent: number;
		yPercent: number;
		x: number;
		y: number;
	}
</script>

<script lang="ts">
	export let node: INode;
</script>

<circle
	class="absolute outline outline-1 outline-purple-500 cursor-grab hover:shadow-color-purple-600 rounded-full"
	fill="white"
	filter="drop-shadow(gray 0 0 4px)"
	cx={node.x}
	cy={node.y}
	r="20"
/>
