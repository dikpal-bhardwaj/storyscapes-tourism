let isLoggedIn = false;
let userRole = 'user';
let globalDestinationId = '';

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const urlParams = new URLSearchParams(window.location.search);
    globalDestinationId = urlParams.get('id');

    if (!globalDestinationId) {
        window.location.href = '../index.html'; 
        return;
    }

    // --- BULLETPROOF TOKEN HUNTER ---
    const storedUser = localStorage.getItem('storyscapes_user');
    let token = localStorage.getItem('token') || localStorage.getItem('storyscapes_token');
    
    // If token is null, check if it is hiding inside the stored user object!
    if (!token && storedUser) {
        const parsedData = JSON.parse(storedUser);
        token = parsedData.token; 
    }

    if (token && storedUser) {
        isLoggedIn = true;
        const parsedData = JSON.parse(storedUser);
        userRole = parsedData.role || 'user';
    }

    fetchDestinationData(globalDestinationId);
    fetchDestinationStories(globalDestinationId); 
});

async function fetchDestinationData(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/destinations/${id}`);
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const jsonResponse = await response.json();
        const destData = jsonResponse.data; 
        
        document.getElementById('dest-name').textContent = destData.name;
        document.getElementById('dest-tagline').textContent = destData.tagline;
        document.getElementById('dest-image').src = destData.heroImage;
        
        const descText = destData.description;
        if (descText && descText.length > 0) {
            const firstLetter = descText.charAt(0);
            const restOfText = descText.slice(1);
            document.getElementById('dest-desc').innerHTML = `<span class="Ornamental-drop-cap">${firstLetter}</span>${restOfText}`;
        }

        document.getElementById('dest-meta-title').textContent = `${destData.name.toUpperCase()} CHRONICLE | CHAPTER ONE`;
        
        const cultureElement = document.getElementById('dest-culture');
        if (destData.culture) {
            cultureElement.textContent = destData.culture;
        } else {
            const cultureBlock = document.getElementById('culture-block');
            if (cultureBlock) cultureBlock.style.display = 'none'; 
        }

        // Initialize user-state setup right before running animation tracks
        handleBucketListInitialization();
        initAnimations();

    } catch (error) {
        console.error("Error fetching destination:", error);
        
        const loaderText = document.querySelector('#loader p');
        if (loaderText) {
            loaderText.textContent = "Failed to load destination data. Is your MERN backend running?";
            loaderText.style.color = "#E07A5F"; 
        }
        gsap.to("#global-nav", { opacity: 1, duration: 0.8, ease: "power2.out" });
    }
}

function handleBucketListInitialization() {
    const btn = document.getElementById('bucketlist-btn');
    if (!btn) return;

    // Rule: Hide button completely for admins
    if (isLoggedIn && userRole === 'admin') {
        btn.classList.add('hidden');
        return;
    }

    // Evaluate active state tracking based on local cache mapping
    const storedUser = localStorage.getItem('storyscapes_user');
    if (isLoggedIn && storedUser) {
        const parsedData = JSON.parse(storedUser);
        if (parsedData.bucketList && parsedData.bucketList.includes(globalDestinationId)) {
            setButtonSavedState(true);
        }
    }

    // FIX: Attach the click listener right here so the toggle can actually fire!
    btn.addEventListener('click', handleBucketListToggleSubmit);
}

function setButtonSavedState(isSaved) {
    const btn = document.getElementById('bucketlist-btn');
    const icon = btn?.querySelector('.btn-icon');
    const text = btn?.querySelector('.btn-text');
    if (!btn || !icon || !text) return;

    if (isSaved) {
        btn.classList.add('saved');
        icon.textContent = '✓';
        text.textContent = 'In your Atlas';
    } else {
        btn.classList.remove('saved');
        icon.textContent = '+';
        text.textContent = 'Save to Atlas';
    }
}

async function handleBucketListToggleSubmit() {
    if (!isLoggedIn) {
        window.location.href = './auth.html';
        return;
    }

    // --- TOKEN HUNTER (For the Request Header) ---
    const storedUserStr = localStorage.getItem('storyscapes_user');
    let token = localStorage.getItem('token') || localStorage.getItem('storyscapes_token');
    if (!token && storedUserStr) {
        token = JSON.parse(storedUserStr).token;
    }

    const btn = document.getElementById('bucketlist-btn');
    gsap.to(btn, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });

    try {
        const response = await fetch(`http://localhost:5000/api/auth/bucketlist/${globalDestinationId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            const updatedList = result.data;
            const savedIds = updatedList.map(item => String(item._id || item));
            const targetId = String(globalDestinationId);

            const storedUser = JSON.parse(localStorage.getItem('storyscapes_user'));
            storedUser.bucketList = savedIds;
            localStorage.setItem('storyscapes_user', JSON.stringify(storedUser));

            const isNowSaved = savedIds.includes(targetId);
            setButtonSavedState(isNowSaved);
            
            if (isNowSaved) {
                showToast("Added to your Atlas!");
            } else {
                showToast("Removed from your Atlas");
            }

        } else {
            console.error("Atlas Sync Failure:", result.message);
            showToast("Failed to sync with Atlas", true);
        }
    } catch (error) {
        console.error("Network Exception Encountered:", error);
        showToast("Network connection error", true);
    }
}

// ==========================================
// NEW: DYNAMIC TOAST NOTIFICATION GENERATOR
// ==========================================
function showToast(message, isError = false) {
    // Check if a toast already exists, otherwise create it
    let toast = document.getElementById('atlas-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'atlas-toast';
        toast.className = 'prof-toast-popup'; // Uses your existing premium CSS
        document.body.appendChild(toast);
    }
    
    // Set text and reset classes
    toast.textContent = message;
    toast.className = 'prof-toast-popup';
    if (isError) toast.classList.add('error');
    
    // Force browser reflow to restart CSS animations, then slide it in
    void toast.offsetWidth; 
    toast.classList.add('show');
    
    // Hide it after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

async function fetchDestinationStories(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/stories?destination=${id}`);
        const grid = document.getElementById('stories-grid');
        const emptyState = document.getElementById('empty-stories-state');
        const writeStoryBtn = document.getElementById('write-story-cta') || document.querySelector('.write-story-btn');

        const storedUser = localStorage.getItem('storyscapes_user'); 
        let isAdmin = false;

        if (storedUser) {
            const parsedData = JSON.parse(storedUser);
            if (parsedData.role === 'admin') {
                isAdmin = true;
            }
        }

        if (!response.ok) throw new Error('Failed to fetch stories');

        const jsonResponse = await response.json();
        const stories = jsonResponse.data || []; 

        if (stories.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'flex'; 
            
            if (isAdmin && writeStoryBtn) {
                writeStoryBtn.style.display = 'none';
                const placeholderText = emptyState.querySelector('.placeholder-text');
                if (placeholderText) {
                    placeholderText.textContent = "Archive empty. No traveler stories have been published for this location yet.";
                }
            }
        } else {
            grid.style.display = 'grid';
            emptyState.style.display = 'none';
            grid.innerHTML = ''; 
            
            stories.forEach(story => {
                const card = document.createElement('div');
                card.className = 'story-card';
                card.innerHTML = `
                    <span class="story-author">By ${story.user?.name || 'Traveler'}</span>
                    <h3 class="story-title">${story.title}</h3>
                    <p class="story-excerpt">${story.content.substring(0, 120)}...</p>
                    <a href="./singleStory.html?id=${story._id}" class="read-more">Read Journey</a>
                `;
                grid.appendChild(card);
            });
        }
    } catch (error) {
        console.error("Error loading stories:", error);
        document.getElementById('stories-grid').style.display = 'none';
        document.getElementById('empty-stories-state').style.display = 'flex';
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
    .to("#dest-image", {
        scale: 1.05, 
        duration: 2,
        ease: "power3.out"
    }, "-=0.8")
    .fromTo([".back-link", ".dest-tagline", ".dest-title", ".dest-actions"], {
        y: 40,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
    }, "-=1.8");

    gsap.to("#dest-image", {
        scrollTrigger: {
            trigger: ".dest-hero",
            start: "top top",
            end: "bottom top",
            scrub: true 
        },
        y: 100, 
        ease: "none"
    });

    const archiveTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".single-destination-archive",
            start: "top 70%", 
            toggleActions: "play none none reverse"
        }
    });

    archiveTl.from(".archive-chronicle-page", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    })
    .from(".Ornamental-drop-cap", {
        scale: 1.3,
        opacity: 0,
        duration: 1.5,
        ease: "back.out(1.5)"
    }, "-=0.8")
    .from(".chronicle-entry", {
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out"
    }, "-=1.2")
    .fromTo(".postcard-culture", {
        y: -100, 
        opacity: 0,
        rotation: 0
    }, {
        y: 0,
        opacity: 1,
        rotation: 5,
        duration: 1.8,
        ease: "elastic.out(1, 0.75)" 
    }, "-=0.6")
    .from(".quill-vector", {
        opacity: 0,
        duration: 2,
        ease: "power2.out"
    }, "-=1.2")
    .from(".stamp-distressed", {
        scale: 1.2,
        opacity: 0,
        color: "#fff", 
        duration: 1.5,
        ease: "power3.out"
    }, "-=0.2");

    gsap.from(".chronicle-echoes-from-travelers", {
        scrollTrigger: {
            trigger: ".chronicle-echoes-from-travelers",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out"
    });

    gsap.to(".write-story-btn", {
        scrollTrigger: {
            trigger: ".chronicle-echoes-from-travelers",
            start: "top 60%",
            toggleActions: "play reverse play reverse"
        },
        boxShadow: "0 25px 45px rgba(224, 122, 95, 0.2)",
        repeat: -1, 
        yoyo: true, 
        duration: 1.5,
        ease: "sine.inOut"
    });

    gsap.from(".site-footer", {
        scrollTrigger: {
            trigger: ".site-footer",
            start: "top 95%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });
}
