// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

const initHeroAnimation = () => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.to(".navbar", { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
      .to(".word", { y: "0%", duration: 1.2, stagger: 0.1 }, "-=0.5")
      .to(".image-reveal-mask", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power3.inOut" }, "-=1.2")
      .to(".hero-image", { scale: 1, duration: 2, ease: "power2.out" }, "-=1.5")
      .to([".hero-subtitle", ".hero-scroll-indicator", ".image-caption"], { opacity: 1, y: 0, duration: 1, stagger: 0.2 }, "-=1.0");
};

const initScrollAnimations = () => {
    // 1. Ethos Text Reveal on Scroll
    gsap.from(".ethos-text", {
        scrollTrigger: {
            trigger: ".ethos-section",
            start: "top 80%", 
        },
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
    });

    // 2. The Pinned Image Stack
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
                end: "top 25%", // Adjusted so it stops lower down, clearing the navbar
                scrub: 1, 
            },
            y: () => -window.innerHeight * 0.05 * index, // Tighter stacking offset
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
            opacity: 0.5 // Dims slightly more to push older cards into the background
        });
    });

    // 3. Destinations Grid Stagger Fade In
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

// Run animations when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    initHeroAnimation();
    setTimeout(initScrollAnimations, 500); 
});
