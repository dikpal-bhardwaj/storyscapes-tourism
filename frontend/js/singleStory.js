document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('id');

    if (!storyId) {
        window.location.href = './explore.html'; 
        return;
    }

    fetchStoryData(storyId);
});

async function fetchStoryData(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/stories/${id}`);
        
        if (!response.ok) throw new Error('Failed to fetch story');
        
        const jsonResponse = await response.json();
        const story = jsonResponse.data; 
        
        document.getElementById('story-title').textContent = story.title;
        document.getElementById('story-destination').textContent = story.destination?.name || 'Unknown Location';
        document.getElementById('story-author').textContent = `Written by ${story.user?.name || 'Traveler'}`;
        
        const dateObj = new Date(story.createdAt);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('story-date').textContent = dateObj.toLocaleDateString('en-US', options);

        const heroImg = (story.images && story.images.length > 0) ? story.images[0] : 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1500';
        document.getElementById('story-image').src = heroImg;
        
        const contentText = story.content;
        if (contentText && contentText.length > 0) {
            const firstLetter = contentText.charAt(0);
            const restOfText = contentText.slice(1);
            document.getElementById('story-content').innerHTML = `<span class="Ornamental-drop-cap">${firstLetter}</span>${restOfText}`;
        }

        const tagsContainer = document.getElementById('story-tags');
        if (story.tags && story.tags.length > 0) {
            tagsContainer.innerHTML = story.tags.map(tag => `<span class="tag-pill">${tag}</span>`).join('');
        } else {
            tagsContainer.style.display = 'none';
        }

        initAnimations();

    } catch (error) {
        console.error("Error fetching story:", error);
        const loaderText = document.querySelector('#loader p');
        if (loaderText) loaderText.textContent = "Failed to load journal entry.";
        gsap.to("#global-nav", { opacity: 1, duration: 0.8 });
    }
}

function initAnimations() {
    const tl = gsap.timeline();

    tl.to("#loader", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => { document.getElementById("loader").style.display = "none"; }
    })
    .to(["#main-content", "#global-nav"], {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.2")
    .fromTo(".story-hero-text", {
        x: -40,
        opacity: 0
    }, {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out"
    }, "-=0.6")
    .fromTo(".story-hero-visual", {
        x: 40,
        opacity: 0
    }, {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out"
    }, "-=1.0");

    gsap.to("#story-image", {
        scrollTrigger: {
            trigger: ".story-hero",
            start: "top top",
            end: "bottom top",
            scrub: true 
        },
        y: 80, 
        ease: "none"
    });

    gsap.from(".story-reading-container", {
        scrollTrigger: {
            trigger: ".story-editorial",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    });
}
