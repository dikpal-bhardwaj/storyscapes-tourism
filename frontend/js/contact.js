document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // Initial Page Load Animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Staggered reveal for the left editorial text
    tl.fromTo(".gs-reveal-left", 
        { x: -40, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1.2 }, 
        "+=0.2"
    )
    // Bring in the form on the right
    .fromTo(".gs-reveal-right", 
        { x: 40, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1.2 }, 
        "-=0.8"
    )
    // Stagger the form inputs sliding up
    .fromTo(".contact-form .input-float, .contact-form button", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, 
        "-=0.6"
    );

    // Footer Animation
    gsap.from(".gs-reveal-footer", {
        scrollTrigger: {
            trigger: ".site-footer",
            start: "top 90%",
        },
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Handle Form Submission
    const contactForm = document.getElementById('form-contact');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop page reload
        
        const btn = contactForm.querySelector('button');
        
        // Button tactile animation
        gsap.to(btn, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
        
        // In a real app, you would fetch() to your backend here.
        // For now, we simulate a successful send:
        setTimeout(() => {
            showToast("Your message has been sent successfully.");
            contactForm.reset();
        }, 400);
    });
});

// Toast Notification Function
function showToast(message, isError = false) {
    const toast = document.getElementById('contact-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = 'prof-toast-popup';
    if (isError) toast.classList.add('error');
    
    // Force browser reflow to restart CSS animations
    void toast.offsetWidth; 
    toast.classList.add('show');
    
    // Hide it after 3.5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}
