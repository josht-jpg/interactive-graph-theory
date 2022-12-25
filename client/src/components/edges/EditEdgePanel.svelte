<script lang="ts">
	import edges from '../../stores/Edges';
	import edgeEditPanels from '../../stores/EdgeEditPanels';
	import { clickOutside } from '../../utils/clickOutside';
	import type { IEdge } from './Edge.svelte';

	export let edge: IEdge;
	export let clickCoordinates: { x: number; y: number };

	let color = edge.color;
	let colorLabel = edge.labelColor;

	const detailsWidthInPx = 275;

	// TODO: fix obvious bug
	const hidePanel = () => edgeEditPanels.update((panels) => panels.slice(0, -1));

	const FIELD = {
		label: 'label',
		color: 'color',
		colorLabel: 'colorLabel'
	} as const;

	type Field = keyof typeof FIELD;

	const updateEdge = (field: Field, value: string) => {
		edges.update((edges) => {
			const edgeIndex = edges.findIndex((e) => e.id === edge.id);
			if (edgeIndex === -1) return edges;

			// TODO: see if there's a better way to do this
			const newEdges = [...edges];
			newEdges[edgeIndex] = {
				...newEdges[edgeIndex],
				[field]: value
			};

			return newEdges;
		});
	};

	// adapted from: https://stackoverflow.com/questions/48484767/javascript-check-if-string-is-valid-css-color
	const isValidCssColor = (color: string) => {
		const s = new Option().style;
		s.color = color;
		return s.color !== '';
	};

	const updateEdgeColor = (field: Field, value: string, update: (color: string) => void) => {
		if (isValidCssColor(value)) {
			update(value);
			updateEdge(field, value);
		}
	};
</script>

<svelte:window on:mousewheel={hidePanel} />

<div
	use:clickOutside
	on:click_outside={hidePanel}
	class="container absolute max-w-[calc(100vw-24px)] max-h-[50vh] rounded-lg overflow-y-auto px-2 py-6 z-30 bg-white"
	style={`top: ${
		clickCoordinates.y + (clickCoordinates.y > window.innerHeight / 2 ? -360 : 25)
	}px; left: ${clickCoordinates.x - detailsWidthInPx / 2}px; width: ${detailsWidthInPx}px;`}
>
	<h3 class="text-center text-lg font-bold">Input Details</h3>

	<form>
		<div class="flex flex-col gap-y-4 justify-self-center m-auto text-center">
			<div>
				<label for="edge-label-input" class="mt-[5%] inline-block text-center">
					Label
					<strong>:</strong>
				</label>
				<span class="inline-block">
					<input
						class="input inline-block radius-2 rounded h-8 w-56 border-0 pl-2 m-auto"
						id="edge-label-input"
						type="text"
						name="Edge Label"
						value={edge.label ?? ''}
						on:input={(event) => {
							if (event && event.target) {
								updateEdge(FIELD.label, event.target.value);
							}
						}}
					/>
				</span>
			</div>

			<div>
				<label for="edge-color-input" class="mt-[5%] inline-block text-center">
					Edge Color
					<strong>:</strong>
				</label>
				<span class="inline-block">
					<input
						class="input inline-block radius-2 rounded h-8 w-56 border-0 pl-2 m-auto"
						id="edge-color-input"
						type="text"
						name="Edge Color"
						value={edge.color ?? ''}
						on:input={(event) => {
							if (event && event.target) {
								updateEdgeColor(FIELD.color, event.target.value, (color) => {
									color = color;
								});
							}
						}}
					/>
				</span>
			</div>

			<div>
				<label for="edge-label-color-input" class="mt-[5%] inline-block text-center">
					Label Color
					<strong>:</strong>
				</label>
				<span class="inline-block">
					<input
						class="input inline-block radius-2 rounded h-8 w-56 border-0 pl-2 m-auto"
						id="edge-label-color-input"
						type="text"
						name="Edge Label Color"
						value={edge.labelColor ?? ''}
						on:input={(event) => {
							if (event && event.target) {
								updateEdgeColor(FIELD.colorLabel, event.target.value, (color) => {
									colorLabel = color;
								});
							}
						}}
					/>
				</span>
			</div>
		</div>
		<!-- <DeleteButton
			type="Delete Input"
			action={(e) => {
				e.preventDefault();
				handleDeleteInput();
			}}
		/> -->
	</form>
</div>

<style>
	.container {
		box-shadow: rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px,
			rgb(15 15 15 / 20%) 0px 9px 24px;
	}

	.input {
		box-shadow: 0.5px 0.5px 3px 0.5px #9333ea;
	}
</style>
