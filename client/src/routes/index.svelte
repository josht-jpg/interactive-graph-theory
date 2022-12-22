<script lang="ts">
	import Node from '../components/Node.svelte';
	import type { INode } from '../components/Node.svelte';
	import Group from '../components/Group.svelte';
	import { scale as currentScale, shift } from '../stores/Scale.ts';
	import type { IEdge } from '../components/edges/Edge.svelte';
	import Edge from '../components/edges/Edge.svelte';
	import { request, gql } from 'graphql-request';
	import AuthButton from '../components/AuthButton.svelte';

	let nodes: INode[] = [];

	let groupComponent: Group;

	let drawingEdge: IEdge | null = null;
	let edges: IEdge[] = [];

	const createNode = (event: MouseEvent) => {
		nodes = [
			...nodes,
			{
				id: `node-${nodes.length}`,
				xPercent: event.clientX / window.innerWidth,
				yPercent: event.clientY / window.innerHeight,
				x: (event.clientX - $shift.x) / $currentScale,
				y: (event.clientY - $shift.y) / $currentScale
			}
		];
	};

	const onResize = () => {
		nodes = nodes.map((node) => ({
			...node,
			x: node.xPercent * (window.innerWidth / $currentScale),
			y: node.yPercent * (window.innerHeight / $currentScale)
		}));
	};

	let isMouseDown = false;
	let draggingNodeIndex: number | null = null;
	const onMouseDown = (event: MouseEvent) => {
		isMouseDown = true;

		if (isShiftDown) {
			document.elementsFromPoint(event.clientX, event.clientY).forEach((element) => {
				if (element.id.startsWith('node-')) {
					console.log(element, 'element');

					const cxPreParsed = element.getAttribute('cx');
					const cyPreParsed = element.getAttribute('cy');

					if (!cxPreParsed || !cyPreParsed) return;

					const cx = parseFloat(cxPreParsed);
					const cy = parseFloat(cyPreParsed);

					drawingEdge = {
						id: 'drawing-edge',
						start: {
							x: cx,
							y: cy
						},
						end: {
							x: (event.clientX - $shift.x) / $currentScale,
							y: (event.clientY - $shift.y) / $currentScale
						},
						startPercent: {
							x: cx / window.innerWidth,
							y: cy / window.innerHeight
						},
						endPercent: {
							x: event.clientX / window.innerWidth,
							y: event.clientY / window.innerHeight
						},
						startNode: parseInt(element.id.split('-')[1])
					};
					return;
				}
			});

			return;
		}

		document.elementsFromPoint(event.clientX, event.clientY).forEach((element) => {
			if (element.id.startsWith('node-')) {
				draggingNodeIndex = parseInt(element.id.split('-')[1]);
			}
		});
	};

	const onMouseUp = async (event: MouseEvent) => {
		isMouseDown = false;
		draggingNodeIndex = null;

		if (!!drawingEdge) {
			document.elementsFromPoint(event.clientX, event.clientY).forEach((element) => {
				if (element.id.startsWith('node-')) {
					const cxPreParsed = element.getAttribute('cx');
					const cyPreParsed = element.getAttribute('cy');

					if (!cxPreParsed || !cyPreParsed) return;

					const cx = parseFloat(cxPreParsed);
					const cy = parseFloat(cyPreParsed);

					edges = [
						...edges,
						{
							id: edges.length.toString(),
							start: drawingEdge.start,
							end: {
								x: cx,
								y: cy
							},
							startPercent: drawingEdge.startPercent,
							endPercent: {
								x: cx / window.innerWidth,
								y: cy / window.innerHeight
							},
							startNode: drawingEdge.startNode,
							endNode: parseInt(element.id.split('-')[1])
						}
					];
				}
			});

			drawingEdge = null;
		}
		// const query = gql`
		// 	{
		// 		hello
		// 	}
		// `;

		// const t = await request('http://localhost:8000/graphql', query);
	};

	const dragNode = (nodeIndex: number, movementX: number, movementY: number) => {
		nodes[nodeIndex].x += movementX / $currentScale;
		nodes[nodeIndex].y += movementY / $currentScale;

		edges = edges.map((edge) => {
			if (edge.startNode === draggingNodeIndex) {
				return {
					...edge,
					start: {
						x: edge.start.x + movementX / $currentScale,
						y: edge.start.y + movementY / $currentScale
					},
					startPercent: {
						x: (edge.start.x + movementX / $currentScale) / window.innerWidth,
						y: (edge.start.y + movementY / $currentScale) / window.innerHeight
					}
				};
			} else if (edge.endNode === draggingNodeIndex) {
				return {
					...edge,
					end: {
						x: edge.end.x + movementX / $currentScale,
						y: edge.end.y + movementY / $currentScale
					},
					endPercent: {
						x: (edge.end.x + movementX / $currentScale) / window.innerWidth,
						y: (edge.end.y + movementY / $currentScale) / window.innerHeight
					}
				};
			} else {
				return edge;
			}
		});
	};

	const onMouseMove = (event: MouseEvent) => {
		if (isShiftDown && isMouseDown && !!drawingEdge) {
			drawingEdge = {
				...drawingEdge,
				end: {
					x: drawingEdge.end.x + event.movementX / $currentScale,
					y: drawingEdge.end.y + event.movementY / $currentScale
				},
				endPercent: {
					x: (drawingEdge.end.x + event.movementX / $currentScale) / window.innerWidth,
					y: (drawingEdge.end.y + event.movementY / $currentScale) / window.innerHeight
				}
			};
		} else if (draggingNodeIndex !== null) {
			dragNode(draggingNodeIndex, event.movementX, event.movementY);
		} else if (isMouseDown) {
			groupComponent.pan(event.movementX, event.movementY);
		}
	};

	let isShiftDown = false;
	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Shift') {
			isShiftDown = true;
		}
	};
</script>

<svelte:window
	on:resize={onResize}
	on:mousedown={onMouseDown}
	on:mouseup={onMouseUp}
	on:mousemove={onMouseMove}
	on:keydown={onKeyDown}
	on:keyup={() => (isShiftDown = false)}
/>

<AuthButton />

<svg
	id="main-svg"
	xmlns="http://www.w3.org/2000/svg"
	class="absolute w-full h-full"
	on:dblclick={createNode}
>
	<Group
		bind:this={groupComponent}
		className="h-full w-full"
		parentSvgId="main-svg"
		matrixGroupId="matrix-group"
	>
		<Edge edge={drawingEdge} />
		{#each edges as edge}
			<Edge {edge} />
		{/each}
		{#each nodes as node, index}
			<Node {node} isDragging={draggingNodeIndex === index} {isShiftDown} />
		{/each}
	</Group>
</svg>
