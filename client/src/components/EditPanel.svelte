<script>
	// import { getContext } from 'svelte';
	// import { key as isDarkModeKey } from '../context/isDarkMode.svelte';
	import classNames from 'classnames';

	// const { isDarkMode } = getContext(isDarkModeKey);
</script>

<div>
	<div
		class={classNames(
			'absolute top-[calc(200px + 4vh)] left-[1.75rem] shadow-xl w-1/4 m-w-[275px] m-h-[70vh] rounded overflow-y-auto bg-color mt-[2vh] box-border p-4 pb-8 z-0 text-center'
		)}
	>
		<h3 class="mb-0 text-[1.4rem]">Controls</h3>

		<!-- <Button type={'Run Algorithm'} action={() => runAlgorithm()}></Button> -->

		<label htmlfor="speed">
			<strong>Speed</strong>
		</label>
		<br />
		<input id="speed" type="range" min="50" max="750" value={50} step="10" />
	</div>
</div>
