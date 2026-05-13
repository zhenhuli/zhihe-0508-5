<script>
	export let artwork;
</script>

<div class="artwork-card" on:click>
	<div class="artwork-image">
		<img src={artwork.image} alt={artwork.title} loading="lazy" />
	</div>
	<div class="artwork-info">
		<h3 class="artwork-title">{artwork.title}</h3>
		<p class="artwork-category">{artwork.category}</p>
		<div class="artwork-meta">
			<span class="likes">❤️ {artwork.likes}</span>
			<span class="author">{artwork.author.name}</span>
		</div>
	</div>
</div>

<style lang="stylus">
	@import '../styles/variables.styl';
	
	.artwork-card
		height 100%
		display flex
		flex-direction column
	
	.artwork-image
		position relative
		flex 1
		overflow hidden
		
		img
			width 100%
			height 100%
			object-fit cover
			transition transform 0.3s
			
			.artwork-card:hover &
				transform scale(1.05)
	
	.artwork-info
		padding 1rem
		background-color $card-bg
		transition background-color 0.3s
	
	:global(.dark) .artwork-info
		background-color $card-bg-dark
	
	.artwork-title
		margin 0 0 0.5rem 0
		font-size 1rem
		font-weight 600
		color $text-color
	
	:global(.dark) .artwork-title
		color $text-color-dark
	
	.artwork-category
		margin 0 0 0.75rem 0
		font-size 0.85rem
		color $text-secondary
		text-transform uppercase
		letter-spacing 0.5px
	
	:global(.dark) .artwork-category
		color $text-secondary-dark
	
	.artwork-meta
		display flex
		justify-content space-between
		align-items center
		font-size 0.85rem
		color $text-secondary
	
	:global(.dark) .artwork-meta
		color $text-secondary-dark
	
	.likes
		display flex
		align-items center
		gap 0.25rem
	
	.author
		font-style italic
</style>
