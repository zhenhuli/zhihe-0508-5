<script>
	import { selectedCategory } from '../stores/filter.js';
	import { darkMode } from '../stores/theme.js';
	
	export let categories = [];
	
	function selectCategory(category) {
		selectedCategory.set(category);
	}
	
	function toggleDarkMode() {
		$darkMode = !$darkMode;
	}
</script>

<header class="header">
	<div class="header-content">
		<div class="logo">
			<h1>🎨 像素画廊</h1>
		</div>
		
		<div class="header-actions">
			<nav class="category-filter">
				{#each categories as category}
					<button 
						class="category-btn"
						class:active={$selectedCategory === category}
						on:click={() => selectCategory(category)}
					>
						{category}
					</button>
				{/each}
			</nav>
			
			<button class="theme-toggle" on:click={toggleDarkMode} title="切换主题">
				{#if $darkMode}
					☀️
				{:else}
					🌙
				{/if}
			</button>
		</div>
	</div>
</header>

<style lang="stylus">
	@import '../styles/variables.styl';
	
	.header
		background-color $header-bg
		box-shadow $shadow
		position sticky
		top 0
		z-index 100
		transition background-color 0.3s
	
	:global(.dark) .header
		background-color $header-bg-dark
	
	.header-content
		max-width 1400px
		margin 0 auto
		padding 1rem 2rem
		display flex
		align-items center
		justify-content space-between
		flex-wrap wrap
		gap 1rem
	
	.logo h1
		margin 0
		font-size 1.5rem
		font-weight 700
		color $text-color
		display flex
		align-items center
		gap 0.5rem
	
	:global(.dark) .logo h1
		color $text-color-dark
	
	.header-actions
		display flex
		align-items center
		gap 1.5rem
		flex-wrap wrap
	
	.category-filter
		display flex
		gap 0.5rem
		flex-wrap wrap
	
	.category-btn
		padding 0.5rem 1rem
		border none
		background-color transparent
		color $text-secondary
		border-radius $border-radius
		cursor pointer
		font-size 0.875rem
		font-weight 500
		transition all 0.2s
		
		&:hover
			background-color $hover-bg
			color $text-color
		
		&.active
			background-color $primary-color
			color white
	
	:global(.dark) .category-btn
		color $text-secondary-dark
		
		&:hover
			background-color $hover-bg-dark
			color $text-color-dark
	
	.theme-toggle
		width 2.5rem
		height 2.5rem
		border none
		background-color $hover-bg
		border-radius 50%
		cursor pointer
		font-size 1.25rem
		display flex
		align-items center
		justify-content center
		transition all 0.2s
		
		&:hover
			background-color $primary-color
			transform scale(1.1)
	
	:global(.dark) .theme-toggle
		background-color $hover-bg-dark
	
	@media (max-width 768px)
		.header-content
			padding 1rem
			flex-direction column
			align-items stretch
		
		.logo h1
			justify-content center
		
		.header-actions
			justify-content center
		
		.category-filter
			justify-content center
</style>
