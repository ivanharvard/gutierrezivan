<script lang="ts">
    import { onMount } from 'svelte';
    import '../app.css';
    import Project from '../components/Project.svelte';
    import Expanded from '../components/Expanded.svelte';

	// Projects
	const projects = [
        {
            title: "Newsvibe",
            shortDescription: "Sentiment analysis of news articles using machine learning.",
			longDescription: "Newsvibe is a web application that uses machine learning to analyze the sentiment of news articles. Users can search for news articles by keyword and view the average sentiment of news outlets on a topic. Users can also filter results, view trending topics, and view information about the sources themselves. The application uses the Natural Language Toolkit's VADER model to predict the sentiment of the articles. Newsvibe was built using Flask (Python), HTML, CSS, and JavaScript. It uses the News API to fetch URLs and BeautifulSoup to scrape the articles.",
            imageUrl: "/newsvibe/main.png",
            gifUrl: "/newsvibe/gif.gif",
            galleryImages: ["/newsvibe/main.png", "/newsvibe/about.png", "/newsvibe/breaking.png", "/newsvibe/results.png", "/newsvibe/settings.png"],
            githubUrl: "https://github.com/ivanharvard/newsvibe",
            youtubeUrl: "https://www.youtube.com/watch?v=HBlQM9oWHA4"
        },
    ];

	// Sections
    export let sections = ['About Me', 'Projects', 'Contact'];
    
    let activeSection = '';

    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

	// Expandable modal
	let showModal = false;
    let selectedProject = null;

	function openModal(project) {
        selectedProject = project;
        showModal = true;
    }

    function closeModal() {
        showModal = false;
        selectedProject = null;
    }

    onMount(() => {
        const handleScroll = () => {
            const sectionElements = sections.map(section => document.getElementById(section.toLowerCase().replace(' ', '-')));
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            sectionElements.forEach(section => {
                if (section && section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
                    activeSection = section.id; // Update active section
                }
            });
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener on component destruction
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });
</script>

<div class="flex justify-center h-screen bg-[#18181b] mt-10">
    <!-- Left Column -->
    <nav class="w-1/3 p-4 sticky top-0 h-full flex flex-col items-end mt-2">
        <h1 class="text-2xl font-bold mb-4">
            <a href="#" class="text-inherit no-underline">gutierrezivan.com</a>
        </h1>
        <h2 class="mb-4">
            Ivan Gutierrez<br>
            Computer Science and<br> 
			Applied Math in Data Science<br>
			at Harvard University
		</h2>
		<h2 class="text-xl mb-6 font-bold">
			<a href="mailto:igzjobs@gmail.com" class="hover:underline">igzjobs@gmail.com</a>
		</h2>
        <ul class="space-y-4">
            {#each sections as section}
                <li>
                    <a href="#" 
                       class:active={activeSection === section.toLowerCase().replace(' ', '-')}
                       onclick={() => scrollToSection(section.toLowerCase().replace(' ', '-'))}>
                        {section}
                    </a>
                </li>
            {/each}
        </ul>
    </nav>
  
    <!-- Right Column -->
    <main class="w-2/3 overflow-y-auto p-8 text-left">
        <section id="about-me" class="mb-12">
            <h2 class="text-3xl font-semibold mb-4">About Me</h2>
            <p>
				Hi, I'm Ivan! I'm a Computer Science and Applied Math in Data Science student at Harvard University. I'm passionate about software development, machine learning, and data science. I'm always looking for new opportunities to learn and grow. Feel free to reach out to me at <a href="mailto:igzjobs@gmail.com" class="hover:underline">igzjobs@gmail.com</a>.	
			</p>
        </section>
  
        <section id="projects" class="mb-12">
            <h2 class="text-3xl font-semibold mb-4">Projects</h2>
			{#each projects as project}
				<Project {...project} on:openModal={e => openModal(e.detail)} />
			{/each}
        </section>
  
        <section id="contact" class="mb-12">
            <h2 class="text-3xl font-semibold mb-4">Contact</h2>
			<h1 class="text-xl mb-0">Ivan Gutierrez</h1>
			<p>Harvard University</p>
            <ul class="contact-links">
				<li><svg></svg> <a href="mailto:igzjobs@gmail.com" class="hover:underline">igzjobs@gmail.com</a></li>
				<li><svg></svg> <a href="github.com/ivanharvard" class="hover:underline">github.com/ivanharvard</a></li>
				<li><svg></svg> <a href="instagram.com/ivangz__2" class="hover:underline">instagram.com/ivangz__2</a></li>
			</ul>
        </section>
    </main>
</div>

{#if showModal}
    <Expanded {selectedProject} on:closeModal={closeModal} />
{/if}

<slot />
