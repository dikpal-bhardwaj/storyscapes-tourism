gsap.registerPlugin(ScrollTrigger);

const API_URL = 'http://localhost:5000/api';

document.addEventListener("DOMContentLoaded", () => {
    fetchAllStories();
});

const fetchAllStories = async () => {
    const grid = document.getElementById('full-stories-grid');
    
    try {
        // Fetching all stories from the database
        const res = await fetch(`${API_URL}/stories`);
        const json = await res.json();
        const data = json.data || [];

        if (data.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1 / -1; text-align:center; color: var(--text-muted); font-style: italic; font-size: 1.2rem;">The archives are currently empty. Be the first to write a story.</p>';
        } else {
            // Generate cards
            grid.innerHTML = data.map(story => {
                // Safely grab the destination name if the backend populated it
                const destName = story.destination ? story.destination.name : 'Unknown Destination';
                const authorName = story.user?.name || story.author?.name || 'Traveler';
                const heroImg = (story.images && story.images.length > 0) ? story.images[0] : 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1000';

                return `
                <a href="./singleStory.html?id=${story._id}" class="explore-card" style="opacity: 0; transform: translateY(50px);">
                    <div class="explore-image-wrapper">
                        <span class="explore-badge">${destName}</span>
                        <img src="${heroImg}" alt="${story.title}" loading="lazy">
                    </div>
                    <div class="explore-content">
                        <span class="story-author">By ${authorName}</span>
                        <h3 class="story-title">${story.title}</h3>
                        <p class="story-excerpt">${story.content.substring(0, 110)}...</p>
                        <span class="read-more-text">Read Journey →</span>
                    </div>
                </a>
                `;
            }).join('');
        }

        setTimeout(initPageAnimations, 100);

    } catch (err) {
        console.error("Fetch error:", err);
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align:center; color: #E07A5F;">Failed to connect to the archives.</p>';
        initPageAnimations();
    }
};

const initPageAnimations = () => {
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
    .from(".page-hero h1", { 
        y: 40, opacity: 0, duration: 1.2, ease: "power4.out" 
    }, "-=0.6")
    .from(".page-hero p", { 
        y: 20, opacity: 0, duration: 1, ease: "power3.out" 
    }, "-=1.0")
    .call(initGridAnimations);
};

const initGridAnimations = () => {
    ScrollTrigger.refresh();

    ScrollTrigger.batch(".explore-card", {
        onEnter: elements => {
            gsap.to(elements, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                overwrite: true
            });
        },
        start: "top 85%"
    });
};
