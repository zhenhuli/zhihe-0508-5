<script>
	import { createEventDispatcher } from 'svelte';
	import ArtworkCard from './ArtworkCard.svelte';
	
	export let artworks = [];
	
	const dispatch = createEventDispatcher();
	
	function handleSelect(artwork) {
		dispatch('select', artwork);
	}
</script>

<div class="masonry-grid">
	{#each artworks as artwork (artwork.id)}
		<div class="masonry-item">
			<ArtworkCard {artwork} on:click={() => handleSelect(artwork)} />
		</div>
	{/each}
</div>

<style lang="stylus">
	@import '../styles/variables.styl';
	
	.masonry-grid
		column-count 4
		column-gap 1.5rem
	
	.masonry-item
		break-inside avoid
		margin-bottom 1.5rem
		background-color $card-bg
		border-radius $border-radius
		overflow hidden
		box-shadow $shadow
		cursor pointer
		transition transform 0.2s, box-shadow 0.2s
		
		&:hover
			transform translateY(-4px)
			box-shadow $shadow-hover
	
	:global(.dark) .masonry-item
		background-color $card-bg-dark
		box-shadow $shadow-dark
	
	:global(.dark) .masonry-item:hover
		box-shadow $shadow-hover-dark
	
	@media (max-width 1200px)
		.masonry-grid
			column-count 3
	
	@media (max-width 900px)
		.masonry-grid
			column-count 2
	
	@media (max-width 600px)
		.masonry-grid
			column-count 1
			column-gap 1rem
		
		.masonry-item
			margin-bottom 1rem
</style>
