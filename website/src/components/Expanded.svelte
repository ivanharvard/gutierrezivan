<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    export let selectedProject;

    const dispatch = createEventDispatcher();

    function closeModal() {
        dispatch('closeModal');
    }

    let currentImageIndex = 0;

    // Move to the next image
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % selectedProject.galleryImages.length;
    }

    // Move to the previous image
    function previousImage() {
        currentImageIndex = (currentImageIndex - 1 + selectedProject.galleryImages.length) % selectedProject.galleryImages.length;
    }
</script>

<div class="modal-overlay" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>

        <!-- Gallery and Links -->
        <div class="gallery">
            {#if selectedProject.galleryImages.length > 1}
                <button class="arrow left" on:click={previousImage}>◀</button>
            {/if}
            
            <img src={selectedProject.galleryImages[currentImageIndex]} alt="Project image" class="gallery-image" />

            {#if selectedProject.galleryImages.length > 1}
                <button class="arrow right" on:click={nextImage}>▶</button>
            {/if}
        </div>

        <h1>{selectedProject.title}</h1>
        <p>{selectedProject.longDescription}</p>
        
        
        <div class="links">
            {#if selectedProject.githubUrl}
                <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer"><img src="/github.png" alt="Github" class="icon" /></a>
            {/if}
            {#if selectedProject.youtubeUrl}
                <a href={selectedProject.youtubeUrl} target="_blank" rel="noopener noreferrer"><img src="/youtube.png" alt="Youtube" class="icon" /></a>
            {/if}
        </div>
    </div>
</div>

<style>
.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: #18181b;
    padding: 20px;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    position: relative;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
}

.gallery {
    display: flex;
    gap: 8px;
    margin-top: 10px;
}

.gallery-image {
    width: 100%;
    height: auto;
}

.links a {
    display: inline-block;
    margin-top: 10px;
    text-decoration: none;
    margin-right: 10px;
}

.icon {
    width: 3rem;
    filter: brightness(0) invert(1);
}


</style>
