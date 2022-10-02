<script lang="ts">
	import { onMount } from 'svelte';

	export let parentSvgId: string;
	export let matrixGroupId: string;
	export let className: string = '';

	// Adapted from https://www.petercollingridge.co.uk/tutorials/svg/interactive/pan-and-zoom/
	const transformMatrix = [1, 0, 0, 1, 0, 0];

	interface ICenter {
		x: number;
		y: number;
	}
	let center: ICenter;

	onMount(() => {
		const svg = document.getElementById(parentSvgId);
		const svgBoundingRect = svg?.getBoundingClientRect();

		const width = svgBoundingRect?.width ?? 0;
		const height = svgBoundingRect?.height ?? 0;

		center = {
			x: width / 2,
			y: height / 2
		};
	});

	const pan = (dx: number, dy: number) => {
		transformMatrix[4] += dx;
		transformMatrix[5] += dy;
	};

	let currentScale = 1;

	const zoom = (scale: number) => {
		console.log(transformMatrix);

		transformMatrix[4] += (1 - scale) * center.x * currentScale;
		transformMatrix[5] += (1 - scale) * center.y * currentScale;

		transformMatrix[0] *= scale;
		transformMatrix[1] *= scale;
		transformMatrix[2] *= scale;
		transformMatrix[3] *= scale;

		currentScale *= scale;
	};

	const onMouseWheel = (event: WheelEvent) => {
		if (event.deltaY < 0) {
			zoom(1.05);
		} else if (event.deltaY > 0) {
			zoom(0.95);
		}
	};

	const transformMatrixString = (transformMatrix: number[]) =>
		`matrix (${transformMatrix.join(' ')})`;
</script>

<svelte:window on:mousewheel={onMouseWheel} />

<g class={className} id={matrixGroupId} transform={transformMatrixString(transformMatrix)}>
	<slot />
</g>
