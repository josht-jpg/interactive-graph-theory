<script lang="ts">
	import { onMount } from 'svelte';
	import { scale as currentScale, shift } from '../stores/Scale';
	import type { INode } from './Node.svelte';

	export let parentSvgId: string;
	export let matrixGroupId: string;
	export let className: string = '';
	export let setNodes: (nodes: INode[]) => INode[];

	// Adapted from https://www.petercollingridge.co.uk/tutorials/svg/interactive/pan-and-zoom/
	const transformMatrix = [1, 0, 0, 1, 0, 0];

	interface ICenter {
		x: number;
		y: number;
	}

	// TODO: do we need center?
	let center: ICenter;
	let zoomTo: { x: number; y: number };

	onMount(() => {
		const svg = document.getElementById(parentSvgId);
		const svgBoundingRect = svg?.getBoundingClientRect();

		const width = svgBoundingRect?.width ?? 0;
		const height = svgBoundingRect?.height ?? 0;

		center = {
			x: width / 2,
			y: height / 2
		};
		zoomTo = { x: center.x, y: center.y };
	});

	export const pan = (dx: number, dy: number) => {
		transformMatrix[4] += dx;
		transformMatrix[5] += dy;

		shift.update((shift) => {
			return {
				x: shift.x + dx,
				y: shift.y + dy
			};
		});
	};

	const zoom = (scale: number, zoomTo: { x: number; y: number }) => {
		transformMatrix[4] += (1 - scale) * zoomTo.x * $currentScale;
		transformMatrix[5] += (1 - scale) * zoomTo.y * $currentScale;

		transformMatrix[0] *= scale;
		transformMatrix[1] *= scale;
		transformMatrix[2] *= scale;
		transformMatrix[3] *= scale;

		shift.update((shift) => ({
			x: shift.x + (1 - scale) * zoomTo.x * $currentScale,
			y: shift.y + (1 - scale) * zoomTo.y * $currentScale
		}));

		currentScale.update((currentScale) => currentScale * scale);

		console.log(scale);

		setNodes((nodes) =>
			nodes.map((node) => ({
				...node,
				xPercent:
					node.x > window.innerWidth / 2
						? node.x / (window.innerWidth / (scale * $currentScale))
						: node.x / (window.innerWidth * (scale * $currentScale)),
				yPercent:
					node.y > window.innerHeight / 2
						? node.y / (window.innerHeight / scale)
						: node.y / (window.innerHeight * scale)
			}))
		);
	};

	const onMouseWheel = (event: WheelEvent) => {
		if (event.deltaY < 0) {
			zoomTo = { x: event.clientX, y: event.clientY };
			zoom(1.05, zoomTo);
		} else if (event.deltaY > 0) {
			zoom(0.95, zoomTo);
		}
	};

	const transformMatrixString = (transformMatrix: number[]) =>
		`matrix (${transformMatrix.join(' ')})`;

	// const onMouseMove = (event: MouseEvent) => {
	// 	if (isMouseDown) {
	// 		pan(event.movementX, event.movementY);
	// 	}
	// };
</script>

<svelte:window on:mousewheel={onMouseWheel} />

<g class={className} id={matrixGroupId} transform={transformMatrixString(transformMatrix)}>
	<slot />
</g>
