// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

const API_URL = 'http://localhost:5000/api';

// --- 1. HERO ANIMATION ---
const initHeroAnimation = () => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.to(".navbar", { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
      .to(".word", { y: "0%", duration: 1.2, stagger: 0.1 }, "-=0.5")
      .to(".image-reveal-mask", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power3.inOut" }, "-=1.2")
      .to(".hero-image", { scale: 1, duration: 2, ease: "power2.out" }, "-=1.5")
      .to([".hero-subtitle", ".hero-scroll-indicator", ".image-caption"], { opacity: 1, y: 0, duration: 1, stagger: 0.2 }, "-=1.0");
};

// --- 2. FETCH DYNAMIC DATA ---
const fetchHomepageData = async () => {
    try {
        const res = await fetch(`${API_URL}/destinations`);
        const json = await res.json();
        let data = json.data || [];

        // Shuffle for randomness
        data = data.sort(() => 0.5 - Math.random());

        const heroData = data[0]; 
        const stackData = data.slice(1, 4);
        const gridData = data.slice(4, 7);

        // 1. Update Dynamic Hero and make it clickable
        if (heroData) {
            document.getElementById('hero-main-img').src = heroData.heroImage;
            document.getElementById('hero-caption-title').innerText = heroData.name;
            document.getElementById('hero-caption-story').innerText = heroData.tagline;
            // POINT TO THE CORRECT PAGE
            document.getElementById('hero-link').href = `./pages/singleDestination.html?id=${heroData._id}`;
        }

        // 2. Inject Pinned Stack (Now with <a> tags)
        const stackContainer = document.getElementById('pinned-stack-container');
        if (stackContainer && stackData.length > 0) {
            stackContainer.innerHTML = stackData.map((dest, index) => `
                <a href="./pages/singleDestination.html?id=${dest._id}" class="stack-card card-${index + 1}" style="text-decoration: none;">
                    <img src="${dest.heroImage}" alt="${dest.name}">
                    <div class="card-overlay">
                        <h3>${dest.tagline}</h3>
                        <p>${dest.name}</p>
                    </div>
                </a>
            `).join('');
        }

        // 3. Inject Destinations Grid (Corrected page name)
        const gridContainer = document.getElementById('homepage-dest-grid');
        if (gridContainer && gridData.length > 0) {
            gridContainer.innerHTML = gridData.map(dest => `
                <a href="./pages/singleDestination.html?id=${dest._id}" class="dest-card">
                    <div class="dest-image-wrapper">
                        <img src="${dest.heroImage}" alt="${dest.name}">
                    </div>
                    <div class="dest-info">
                        <h4>${dest.name}</h4>
                        <p>${dest.tagline}</p>
                    </div>
                </a>
            `).join('');
        }

        // Initialize animations after DOM is ready
        setTimeout(initScrollAnimations, 100);

    } catch (err) {
        console.error("Failed to load homepage data", err);
    }
};

// --- 3. SCROLL ANIMATIONS ---
const initScrollAnimations = () => {
    gsap.from(".ethos-text", {
        scrollTrigger: { trigger: ".ethos-section", start: "top 80%" },
        y: 50, opacity: 0, duration: 1.5, ease: "power3.out"
    });

    ScrollTrigger.create({
        trigger: ".pinned-stack-section",
        start: "top top",
        end: "bottom bottom",
        pin: ".stack-left",
    });

    const cards = gsap.utils.toArray(".stack-card");
    
    cards.forEach((card, index) => {
        if (index === 0) return; 

        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%", 
                end: "top 25%", 
                scrub: 1, 
            },
            y: () => -window.innerHeight * 0.05 * index, 
            scale: 1,
            boxShadow: "0 -20px 40px rgba(0,0,0,0.2)"
        });

        gsap.to(cards[index - 1], {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                end: "top 25%",
                scrub: 1,
            },
            scale: 0.95,
            opacity: 0.5 
        });
    });

    gsap.from(".dest-card", {
        scrollTrigger: {
            trigger: ".destinations-grid",
            start: "top 85%",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });
};

document.addEventListener("DOMContentLoaded", () => {
    initHeroAnimation();
    fetchHomepageData();
});
