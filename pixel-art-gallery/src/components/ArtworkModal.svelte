<script>
	import { createEventDispatcher } from 'svelte';
	import { afterUpdate, onDestroy } from 'svelte';
	
	export let artwork = null;
	
	const dispatch = createEventDispatcher();
	
	function handleClose() {
		dispatch('close');
	}
	
	function handleKeyDown(e) {
		if (e.key === 'Escape') {
			handleClose();
		}
	}
	
	function handleBackdropClick(e) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}
	
	let prevArtwork = null;
	
	afterUpdate(() => {
		if (artwork && !prevArtwork) {
			document.addEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'hidden';
		} else if (!artwork && prevArtwork) {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = '';
		}
		prevArtwork = artwork;
	});
	
	onDestroy(() => {
		document.removeEventListener('keydown', handleKeyDown);
		document.body.style.overflow = '';
	});
</script>

{#if artwork}
	<div class="modal-backdrop" on:click={handleBackdropClick}>
		<div class="modal-content">
			<button class="close-button" on:click={handleClose}>&times;</button>
			
			<div class="modal-body">
				<div class="artwork-preview">
					<img src={artwork.image} alt={artwork.title} />
				</div>
				
				<div class="artwork-details">
					<h2 class="artwork-title">{artwork.title}</h2>
					<p class="artwork-category">{artwork.category}</p>
					<p class="artwork-description">{artwork.description}</p>
					
					<div class="artwork-stats">
						<div class="stat">
							<span class="stat-icon">❤️</span>
							<span class="stat-value">{artwork.likes}</span>
						</div>
						<div class="stat">
							<span class="stat-icon">📅</span>
							<span class="stat-value">{artwork.date}</span>
						</div>
					</div>
					
					<div class="author-section">
						<h3>作者简介</h3>
						<div class="author-info">
							<img src={artwork.author.avatar} alt={artwork.author.name} class="author-avatar" />
							<div class="author-details">
								<p class="author-name">{artwork.author.name}</p>
								<p class="author-bio">{artwork.author.bio}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="stylus">
	@import '../styles/variables.styl';
	
	.modal-backdrop
		position fixed
		top 0
		left 0
		right 0
		bottom 0
		background-color rgba(0, 0, 0, 0.8)
		display flex
		align-items center
		justify-content center
		z-index 1000
		padding 2rem
		animation fadeIn 0.3s ease
	
	@keyframes fadeIn
		from
			opacity 0
		to
			opacity 1
	
	.modal-content
		position relative
		background-color $bg-color
		border-radius $border-radius-lg
		max-width 900px
		width 100%
		max-height 90vh
		overflow-y auto
		box-shadow $shadow-lg
		animation slideUp 0.3s ease
	
	@keyframes slideUp
		from
			transform translateY(20px)
			opacity 0
		to
			transform translateY(0)
			opacity 1
	
	:global(.dark) .modal-content
		background-color $bg-color-dark
	
	.close-button
		position absolute
		top 1rem
		right 1rem
		width 2.5rem
		height 2.5rem
		border none
		background-color rgba(0, 0, 0, 0.5)
		color white
		border-radius 50%
		font-size 1.5rem
		cursor pointer
		display flex
		align-items center
		justify-content center
		transition background-color 0.2s
		z-index 10
		
		&:hover
			background-color rgba(0, 0, 0, 0.8)
	
	.modal-body
		display flex
		gap 2rem
		padding 2rem
	
	.artwork-preview
		flex 1
		min-width 300px
		
		img
			width 100%
			height auto
			border-radius $border-radius
			display block
	
	.artwork-details
		flex 1
		display flex
		flex-direction column
		gap 1.5rem
	
	.artwork-title
		margin 0
		font-size 1.75rem
		font-weight 700
		color $text-color
	
	:global(.dark) .artwork-title
		color $text-color-dark
	
	.artwork-category
		margin 0
		font-size 0.875rem
		color $primary-color
		text-transform uppercase
		letter-spacing 1px
		font-weight 600
	
	.artwork-description
		margin 0
		color $text-secondary
		line-height 1.6
	
	:global(.dark) .artwork-description
		color $text-secondary-dark
	
	.artwork-stats
		display flex
		gap 2rem
	
	.stat
		display flex
		align-items center
		gap 0.5rem
		color $text-secondary
	
	:global(.dark) .stat
		color $text-secondary-dark
	
	.stat-icon
		font-size 1.25rem
	
	.stat-value
		font-weight 600
	
	.author-section
		margin-top 1rem
		padding-top 1.5rem
		border-top 1px solid $border-color
	
	:global(.dark) .author-section
		border-top-color $border-color-dark
	
	.author-section h3
		margin 0 0 1rem 0
		font-size 1.125rem
		font-weight 600
		color $text-color
	
	:global(.dark) .author-section h3
		color $text-color-dark
	
	.author-info
		display flex
		align-items center
		gap 1rem
	
	.author-avatar
		width 60px
		height 60px
		border-radius 50%
		object-fit cover
		border 3px solid $primary-color
	
	.author-details
		flex 1
	
	.author-name
		margin 0 0 0.25rem 0
		font-weight 600
		color $text-color
	
	:global(.dark) .author-name
		color $text-color-dark
	
	.author-bio
		margin 0
		font-size 0.875rem
		color $text-secondary
		line-height 1.5
	
	:global(.dark) .author-bio
		color $text-secondary-dark
	
	@media (max-width 768px)
		.modal-backdrop
			padding 1rem
		
		.modal-body
			flex-direction column
			padding 1.5rem
			padding-top 3rem
		
		.artwork-preview
			min-width auto
		
		.artwork-stats
			justify-content center
</style>
