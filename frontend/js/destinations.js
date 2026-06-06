gsap.registerPlugin(ScrollTrigger);

const API_URL = 'http://localhost:5000/api';

document.addEventListener("DOMContentLoaded", () => {
    fetchAllDestinations();
});

const fetchAllDestinations = async () => {
    const grid = document.getElementById('full-atlas-grid');
    
    try {
        const res = await fetch(`${API_URL}/destinations`);
        const json = await res.json();
        const data = json.data || [];

        if (data.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1 / -1; text-align:center; color: var(--text-muted); font-style: italic;">The atlas is currently empty.</p>';
        } else {
            // Generate cards. Initial state is invisible (opacity 0, pushed down 50px) for GSAP
            grid.innerHTML = data.map(dest => `
                <a href="./singleDestination.html?id=${dest._id}" class="atlas-card" style="opacity: 0; transform: translateY(50px);">
                    <div class="atlas-image-wrapper">
                        <img src="${dest.heroImage}" alt="${dest.name}" loading="lazy">
                    </div>
                    <div class="atlas-info">
                        <h4>${dest.name}</h4>
                        <p>${dest.tagline}</p>
                    </div>
                </a>
            `).join('');
        }

        setTimeout(initPageAnimations, 100);

    } catch (err) {
        console.error("Fetch error:", err);
        grid.innerHTML = '<p style="grid-column: 1 / -1; text-align:center; color: #E07A5F;">Failed to connect to the database.</p>';
        initPageAnimations(); // Failsafe: Still animate out the loader so the user isn't stuck
    }
};

const initPageAnimations = () => {
    const tl = gsap.timeline();

    // 1. Fade out the loader
    tl.to("#loader", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
            document.getElementById("loader").style.display = "none";
        }
    })
    // 2. Reveal main content
    .to("#main-content", {
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.2")
    // 3. Fade in the hero text beautifully
    .from(".page-hero h1", { 
        y: 40, opacity: 0, duration: 1.2, ease: "power4.out" 
    }, "-=0.6")
    .from(".page-hero p", { 
        y: 20, opacity: 0, duration: 1, ease: "power3.out" 
    }, "-=1.0")
    // 4. Finally, initialize the ScrollTrigger batching for the grid cards
    .call(initGridAnimations);
};

const initGridAnimations = () => {
    ScrollTrigger.refresh();

    // Batch animates the cards so they reveal row-by-row as you scroll down
    ScrollTrigger.batch(".atlas-card", {
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
        start: "top 90%" // Triggers when the card is 10% from the bottom of the screen
    });
};
