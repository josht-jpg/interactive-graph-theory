<script>
	let nodes;
</script>

<div
	class="ml-[1.75rem] shadow-lg h-[200px] w-[25%] max-w-[350px] rounded overflow-y-auto bg-white mt-[1.75rem] box-border p-2 z-0"
>
	<div class="text-center" />
	<h3 class="text-lg ">
		{#each nodes as node}
			{node}
		{/each}

		<div class="pb-[2.5rem]" />
	</h3>
</div>
