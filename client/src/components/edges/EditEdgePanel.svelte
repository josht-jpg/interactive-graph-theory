<script lang="ts">
	import edgeEditPanels from '../../stores/EdgeEditPanels';
	import { clickOutside } from '../../utils/clickOutside';

	export let color: string;
	export let label: string;
	export let labelColor: string;
	export let clickCoordinates: { x: number; y: number };

	const detailsWidthInPx = 275;

	// TODO: fix obvious bug
	const hidePanel = () => edgeEditPanels.update((panels) => panels.slice(0, -1));
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
						class="input inline-block radius-2 rounded h-8 w-56 border-0 pl-2 m-auto text-center font-bold text-lg"
						id="edge-label-input"
						type="text"
						name="Edge Label"
						value={label ?? ''}
						on:change={(event) => {
							if (event && event.target) {
								label = event.target.value;
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
						class="input inline-block radius-2 rounded h-8 w-56 border-0 pl-2 m-auto text-center font-bold text-lg"
						id="edge-color-input"
						type="text"
						name="Edge Color"
						value={color ?? ''}
						on:change={(event) => {
							if (event && event.target) {
								color = event.target.value;
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
						class="input inline-block radius-2 rounded h-8 w-56 border-0 pl-2 m-auto text-center font-bold text-lg"
						id="edge-label-color-input"
						type="text"
						name="Edge Label Color"
						value={labelColor ?? ''}
						on:change={(event) => {
							if (event && event.target) {
								labelColor = event.target.value;
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
