<script lang="ts">
	import Node from '../components/Node.svelte';
	import type { INode } from '../components/Node.svelte';
	import Group from '../components/Group.svelte';
	import { scale as currentScale, shift } from '../stores/Scale';
	import type { IEdge } from '../components/edges/Edge.svelte';
	import Edge from '../components/edges/Edge.svelte';
	import edgeEditPanels from '../stores/EdgeEditPanels';
	import EditEdgePanel from '../components/edges/EditEdgePanel.svelte';
	import edges from '../stores/Edges';

	let nodes: INode[] = [];

	let groupComponent: Group;

	let drawingEdge: IEdge | null = null;
	// let edges: IEdge[] = [];

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
			// xPercent: node.x / window.innerWidth,
			// yPercent: node.y / window.innerHeight,
			x: node.xPercent * (window.innerWidth / $currentScale),
			y: node.yPercent * (window.innerHeight / $currentScale)
		}));

		edges.update((edges) =>
			edges.map((edge) => ({
				...edge,
				startPercent: {
					x: edge.start.x / window.innerWidth,
					y: edge.start.y / window.innerHeight
				},
				endPercent: {
					x: edge.end.x / window.innerWidth,
					y: edge.end.y / window.innerHeight
				},
				start: {
					x: edge.startPercent.x * (window.innerWidth / $currentScale),
					y: edge.startPercent.y * (window.innerHeight / $currentScale)
				},
				end: {
					x: edge.endPercent.x * (window.innerWidth / $currentScale),
					y: edge.endPercent.y * (window.innerHeight / $currentScale)
				}
			}))
		);
	};

	let isMouseDown = false;
	let draggingNodeIndex: number | null = null;
	let draggingEdgeId: string | null = null;
	const onMouseDown = (event: MouseEvent) => {
		isMouseDown = true;

		if (isShiftDown) {
			document.elementsFromPoint(event.clientX, event.clientY).forEach((element) => {
				if (element.id.startsWith('node-')) {
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
			console.log(element.id);

			if (element.id.startsWith('edge-')) {
				draggingEdgeId = element.id;
				return;
			}

			if (element.id.startsWith('node-')) {
				draggingNodeIndex = parseInt(element.id.split('-')[1]);
				return;
			}
		});
	};

	const onMouseUp = async (event: MouseEvent) => {
		isMouseDown = false;
		draggingNodeIndex = null;
		draggingEdgeId = null;

		if (!!drawingEdge) {
			document.elementsFromPoint(event.clientX, event.clientY).forEach((element) => {
				if (element.id.startsWith('node-')) {
					const cxPreParsed = element.getAttribute('cx');
					const cyPreParsed = element.getAttribute('cy');

					if (!cxPreParsed || !cyPreParsed) return;

					const cx = parseFloat(cxPreParsed);
					const cy = parseFloat(cyPreParsed);

					edges.update((edges) => [
						...edges,
						{
							id: `edge-${edges.length}`,
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
					]);
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
		nodes[nodeIndex].xPercent =
			(nodes[nodeIndex].x + movementX / $currentScale) / window.innerWidth;
		nodes[nodeIndex].yPercent =
			(nodes[nodeIndex].y + movementY / $currentScale) / window.innerHeight;

		nodes[nodeIndex].x += movementX / $currentScale;
		nodes[nodeIndex].y += movementY / $currentScale;

		edges.update((edges) =>
			edges.map((edge) => {
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
			})
		);
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
			event.preventDefault();
			dragNode(draggingNodeIndex, event.movementX, event.movementY);
		} else if (draggingEdgeId !== null) {
			edges.update((edges) =>
				edges.map((edge) => {
					if (edge.id === draggingEdgeId) {
						return {
							...edge,
							quadratic: {
								x: event.clientX,
								y: event.clientY
							}
						};
					} else {
						return edge;
					}
				})
			);
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

	const setNodes = (callback: (nodes: INode[]) => INode[]) => {
		console.log(nodes, 'nodes');
		nodes = callback(nodes);
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

<!-- <AuthButton /> -->

<svg
	id="main-svg"
	xmlns="http://www.w3.org/2000/svg"
	class="absolute w-full h-full"
	on:dblclick={createNode}
>
	<Group
		bind:this={groupComponent}
		{setNodes}
		className="h-full w-full"
		parentSvgId="main-svg"
		matrixGroupId="matrix-group"
	>
		{#if !!drawingEdge}
			<Edge edge={drawingEdge} />
		{/if}
		{#each $edges as edge}
			<Edge {edge} />
		{/each}
		{#each nodes as node, index}
			<Node {node} isDragging={draggingNodeIndex === index} {isShiftDown} />
		{/each}
	</Group>
</svg>

{#each $edgeEditPanels as edgeEditPanel}
	<EditEdgePanel {...edgeEditPanel} />
{/each}
