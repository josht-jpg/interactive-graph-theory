<script lang="ts">
	import Node from '../components/Node.svelte';
	import type { INode } from '../components/Node.svelte';
	import Group from '../components/Group.svelte';

	let nodes: INode[] = [];

	const createNode = (event: MouseEvent) => {
		nodes = [
			...nodes,
			{
				id: nodes.length,
				xPercent: event.clientX / window.innerWidth,
				yPercent: event.clientY / window.innerHeight,
				x: event.clientX,
				y: event.clientY
			}
		];
	};

	const onResize = () => {
		nodes = nodes.map((node) => ({
			...node,
			x: node.xPercent * window.innerWidth,
			y: node.yPercent * window.innerHeight
		}));
	};
</script>

<svelte:window on:resize={onResize} />

<svg
	id="main-svg"
	xmlns="http://www.w3.org/2000/svg"
	class="absolute w-full h-full"
	on:dblclick={createNode}
>
	<Group className="h-full w-full" parentSvgId="main-svg" matrixGroupId="matrix-group">
		{#each nodes as node}
			<Node {node} />
		{/each}
	</Group>
</svg>
