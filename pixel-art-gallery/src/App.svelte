<script>
	import { onMount } from 'svelte';
	import Header from './components/Header.svelte';
	import MasonryGrid from './components/MasonryGrid.svelte';
	import ArtworkModal from './components/ArtworkModal.svelte';
	import { artworks } from './data/artworks.js';
	import { darkMode } from './stores/theme.js';
	import { selectedCategory } from './stores/filter.js';
	import { selectedArtwork } from './stores/artwork.js';

	let categories = ['全部', '风景', '角色', '物品', '建筑', '动物'];

	onMount(() => {
		const savedTheme = localStorage.getItem('darkMode');
		if (savedTheme !== null) {
			$darkMode = savedTheme === 'true';
		}
	});

	$: if (typeof window !== 'undefined') {
		document.documentElement.classList.toggle('dark', $darkMode);
		localStorage.setItem('darkMode', $darkMode);
	}

	$: filteredArtworks = $selectedCategory === '全部' 
		? artworks 
		: artworks.filter(a => a.category === $selectedCategory);
</script>

<div class="app" class:dark={$darkMode}>
	<Header {categories} />
	
	<main>
		<MasonryGrid artworks={filteredArtworks} on:select={(e) => selectedArtwork.set(e.detail)} />
	</main>
	
	<ArtworkModal artwork={$selectedArtwork} on:close={() => selectedArtwork.set(null)} />
</div>

<style lang="stylus">
	@import './styles/global.styl';
	@import './styles/variables.styl';
	
	.app
		min-height 100vh
		background-color $bg-color
		color $text-color
		transition background-color 0.3s, color 0.3s
	
	&.dark
		background-color $bg-color-dark
		color $text-color-dark
	
	main
		padding 2rem
		max-width 1400px
		margin 0 auto
</style>
