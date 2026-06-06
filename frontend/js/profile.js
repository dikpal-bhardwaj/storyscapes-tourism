const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token') || localStorage.getItem('storyscapes_token');
let currentUser = JSON.parse(localStorage.getItem('storyscapes_user'));

// State tracking for updates
let editingStoryId = null;

window.addEventListener("load", () => {
    if (currentUser) {
        document.getElementById('prof-name').innerText = currentUser.name;
        document.getElementById('prof-initial').innerText = currentUser.name.charAt(0).toUpperCase();
        document.getElementById('set-name').value = currentUser.name;
        document.getElementById('set-email').value = currentUser.email;
    } else {
        window.location.replace('./auth.html');
    }

    // Initial Entrance Animations
    gsap.set(".lux-sidebar", { x: -30, opacity: 0 });
    gsap.set(".gs-reveal", { y: 20, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(".lux-sidebar", { x: 0, opacity: 1, duration: 0.8 })
      .to(".gs-reveal", { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, "-=0.4");

    fetchMyStories();
    fetchDestinationsForDropdown();
    fetchBucketList();
    setupTabs();
});

// --- ELEGANT TAB SWITCHING ---
function setupTabs() {
    const tabs = document.querySelectorAll('.lux-tab');
    const views = document.querySelectorAll('.lux-view');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;
            
            // If leaving the draft tab, reset the edit state safely
            if (editingStoryId && tab.getAttribute('data-target') !== 'tab-draft') {
                resetDraftForm();
            }

            const targetId = tab.getAttribute('data-target');
            const targetView = document.getElementById(targetId);

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Crossfade views
            gsap.to(views, { 
                opacity: 0, 
                duration: 0.2, 
                onComplete: () => {
                    views.forEach(v => {
                        v.style.display = 'none';
                        v.classList.remove('active-view');
                    });
                    
                    if (targetView) {
                        targetView.style.display = 'block';
                        targetView.classList.add('active-view');
                        gsap.fromTo(targetView, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
                    }
                }
            });
        });
    });
}

// --- PREMIUM TOAST NOTIFICATION ---
const showToast = (msg, isError = false) => {
    const toast = document.getElementById('prof-toast');
    if (!toast) return;

    toast.textContent = msg;
    toast.className = `lux-toast ${isError ? 'error' : ''}`;
    
    // Force reflow
    void toast.offsetWidth;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
};

// --- DATA FETCHING ---
async function fetchMyStories() {
    try {
        const res = await fetch(`${API_URL}/stories/me`, { headers: { 'Authorization': `Bearer ${token}` }});
        const json = await res.json();
        const data = json.data || []; 
        const grid = document.getElementById('journal-grid');
        grid.innerHTML = '';

        if (data.length === 0) {
            grid.innerHTML = '<p class="lux-empty-state">Your journal is currently empty. The pages await your memories.</p>';
            return;
        }

        data.forEach(s => {
            const destName = s.destination ? s.destination.name : 'Unknown Location';
            const imgHtml = s.images && s.images.length > 0 
                ? `<img src="${s.images[0]}" alt="${s.title}">` 
                : `<div class="lux-story-img-placeholder"></div>`;

            // We inject the story data as JSON into a data attribute so we can parse it for editing
            const storyDataStr = encodeURIComponent(JSON.stringify(s));

            grid.innerHTML += `
                <div class="lux-story-card gs-item">
                    <div class="lux-story-img">${imgHtml}</div>
                    <div class="lux-story-content">
                        <span class="lux-story-meta">${destName}</span>
                        <h3>${s.title}</h3>
                        <div class="lux-story-actions">
                            <a href="./singleStory.html?id=${s._id}" class="lux-action-link view">Read</a>
                            <button class="lux-action-link edit" onclick="triggerEditStory('${storyDataStr}')">Edit</button>
                        </div>
                    </div>
                </div>`;
        });

        gsap.fromTo(".gs-item", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 });
    } catch (e) { console.error("Failed to load stories:", e); }
}

async function fetchDestinationsForDropdown() {
    try {
        const res = await fetch(`${API_URL}/destinations`);
        const json = await res.json();
        const select = document.getElementById('write-dest');
        (json.data || []).forEach(d => {
            select.innerHTML += `<option value="${d._id}">${d.name}</option>`;
        });
    } catch (e) { console.error("Failed to load destinations:", e); }
}

async function fetchBucketList() {
    try {
        const res = await fetch(`${API_URL}/auth/bucketlist`, { headers: { 'Authorization': `Bearer ${token}` }});
        const json = await res.json();
        const grid = document.getElementById('grid-bucketlist');
        grid.innerHTML = '';

        if (!json.data || json.data.length === 0) {
            grid.innerHTML = '<p class="lux-empty-state" style="grid-column: span 2;">Your atlas is blank. Discover destinations to add them here.</p>';
            return;
        }

        json.data.forEach(d => {
            grid.innerHTML += `
                <a href="./singleDestination.html?id=${d._id}" class="lux-bucket-card gs-bucket">
                    <img src="${d.heroImage}" alt="${d.name}">
                    <div class="lux-bucket-overlay">
                        <h3>${d.name}</h3>
                        <p>${d.tagline}</p>
                    </div>
                </a>`;
        });
        
        gsap.fromTo(".gs-bucket", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1 });
    } catch (e) { console.error("Failed to load atlas:", e); }
}

// --- STORY CREATION & UPDATING ---

window.triggerEditStory = function(encodedStoryData) {
    const story = JSON.parse(decodeURIComponent(encodedStoryData));
    editingStoryId = story._id;

    // Populate Form
    document.getElementById('write-title').value = story.title;
    document.getElementById('write-dest').value = story.destination._id;
    document.getElementById('write-content').value = story.content;
    document.getElementById('write-images').value = story.images ? story.images.join(', ') : '';

    // Transform UI for Updating
    document.getElementById('draft-eyebrow').textContent = "REVISION";
    document.getElementById('draft-title').innerHTML = "Refine your <em>memory.</em>";
    document.getElementById('submit-story-btn').textContent = "Update Journal Entry";
    document.getElementById('cancel-edit-btn').style.display = 'inline-block';

    // Switch to the write tab
    document.querySelector('[data-target="tab-draft"]').click();
};

function resetDraftForm() {
    editingStoryId = null;
    document.getElementById('form-write').reset();
    document.getElementById('draft-eyebrow').textContent = "AUTHOR";
    document.getElementById('draft-title').innerHTML = "Chronicle a <em>memory.</em>";
    document.getElementById('submit-story-btn').textContent = "Publish to Journal";
    document.getElementById('cancel-edit-btn').style.display = 'none';
}

document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    resetDraftForm();
    document.querySelector('[data-target="tab-journal"]').click();
});

document.getElementById('form-write').addEventListener('submit', async (e) => {
    e.preventDefault();
    const imgString = document.getElementById('write-images').value;
    const imagesArray = imgString ? imgString.split(',').map(s => s.trim()).filter(s => s) : [];

    const payload = {
        title: document.getElementById('write-title').value,
        destination: document.getElementById('write-dest').value,
        content: document.getElementById('write-content').value,
        images: imagesArray
    };
    
    // Determine if we are creating (POST) or updating (PUT)
    const method = editingStoryId ? 'PUT' : 'POST';
    const endpoint = editingStoryId ? `${API_URL}/stories/${editingStoryId}` : `${API_URL}/stories`;

    try {
        const res = await fetch(endpoint, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });
        
        if (res.ok) { 
            showToast(editingStoryId ? 'Memory Refined Successfully' : 'Story Published to Journal!'); 
            resetDraftForm();
            fetchMyStories(); 
            document.querySelector('[data-target="tab-journal"]').click();
        } else {
            showToast('Failed to save story. Check backend route.', true);
        }
    } catch(err) {
        console.error(err);
        showToast('Network error while saving.', true);
    }
});

// --- SETTINGS SUBMISSIONS ---
document.getElementById('form-profile').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
            name: document.getElementById('set-name').value,
            email: document.getElementById('set-email').value
        })
    });
    
    if (res.ok) { 
        const { data } = await res.json();
        currentUser = { ...currentUser, name: data.name, email: data.email };
        localStorage.setItem('storyscapes_user', JSON.stringify(currentUser));
        document.getElementById('prof-name').innerText = currentUser.name;
        document.getElementById('prof-initial').innerText = currentUser.name.charAt(0).toUpperCase();
        showToast('Preferences Updated Successfully'); 
    }
});

document.getElementById('form-password').addEventListener('submit', async (e) => {
    e.preventDefault();
    const oldPassword = document.getElementById('old-pass').value;
    const newPassword = document.getElementById('new-pass').value;
    const confirmPassword = document.getElementById('confirm-pass').value;

    if (newPassword !== confirmPassword) {
        return showToast('New passwords do not match.', true);
    }

    const res = await fetch(`${API_URL}/auth/changepassword`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ oldPassword, newPassword })
    });
    
    const json = await res.json();
    if (res.ok) { 
        e.target.reset();
        showToast('Password Updated Securely'); 
    } else {
        showToast(json.message || 'Failed to update password', true);
    }
});

// Navigation Logout
document.getElementById('prof-logout-nav').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('storyscapes_token');
    localStorage.removeItem('storyscapes_user');
    window.location.replace('./auth.html');
});
