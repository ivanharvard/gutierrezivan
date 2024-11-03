<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    export let title = "";
    export let shortDescription = "";
    export let longDescription = "";
    export let imageUrl = "";
    export let gifUrl = "";
    export let galleryImages = [];
    export let githubUrl = "";
    export let youtubeUrl = "";

    let expanded = false;
    let showGif = false;

    const dispatch = createEventDispatcher();

    function handleHover() {
        showGif = true;
    }

    function handleMouseOut() {
        showGif = false;
    }

    function handleClick() {
        dispatch('openModal', {
            title,
            longDescription,
            galleryImages,
            githubUrl,
            youtubeUrl
        });
    }
</script>

<div
    class="project-card"
    on:mouseenter={handleHover}
    on:mouseleave={handleMouseOut}
    on:click={handleClick}
    tabindex="0"
    role="button"
>
    <div class="image-container">
        <img src={showGif ? gifUrl : imageUrl} alt={title} class="project-image" />
    </div>
    <div class="info">
        <h3>{title}</h3>
        <p>{shortDescription}</p>
    </div>
</div>
