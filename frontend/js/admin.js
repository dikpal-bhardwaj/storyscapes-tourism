const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token') || localStorage.getItem('storyscapes_token');
const currentUser = JSON.parse(localStorage.getItem('storyscapes_user'));

let allDestinations = []; 

window.addEventListener("load", () => {
    
    // Set Profile Info
    if (currentUser) {
        const nameEl = document.getElementById('admin-name');
        const initialEl = document.getElementById('admin-initial');
        if (nameEl) nameEl.innerText = currentUser.name;
        if (initialEl) initialEl.innerText = currentUser.name.charAt(0).toUpperCase();
    }

    // Landing Animations
    gsap.set(".curator-sidebar", { x: -30, opacity: 0 });
    gsap.set(".gs-reveal", { y: 20, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(".curator-sidebar", { x: 0, opacity: 1, duration: 0.8 })
      .to(".gs-reveal", { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 }, "-=0.4");

    // Fetch initial data
    fetchDestinations();
    fetchStories();
    fetchDestinationsForEditor(); 

    // Tab Switching Logic
    const tabs = document.querySelectorAll('.curator-tab');
    const views = document.querySelectorAll('.curator-view');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;

            const targetId = tab.getAttribute('data-target');
            const targetView = document.getElementById(targetId);

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

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
});

// FOOLPROOF TOAST LOGIC
const showToast = (msg, isError = false) => {
    const toast = document.getElementById('curator-toast');
    if (!toast) return;

    toast.textContent = msg;
    toast.className = `curator-toast ${isError ? 'error' : ''}`;
    
    void toast.offsetWidth; // Reflow
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
};

// --- DATA FETCHING ---
async function fetchDestinations() {
    try {
        const res = await fetch(`${API_URL}/destinations`);
        const json = await res.json();
        const data = json.data || []; 
        
        const list = document.getElementById('list-dest');
        list.innerHTML = '';

        if (data.length === 0) {
            list.innerHTML = '<p class="curator-empty">No destinations established yet.</p>';
            return;
        }

        data.forEach(dest => {
            list.innerHTML += `
                <div class="curator-record gs-item">
                    <img src="${dest.heroImage}" class="record-img" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=150&q=80'">
                    <div class="record-info">
                        <h4>${dest.name}</h4>
                        <p>${dest.tagline}</p>
                    </div>
                    <button onclick="delDest('${dest._id}')" class="record-del-btn">Remove</button>
                </div>`;
        });

        gsap.fromTo(".gs-item", { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.05 });
    } catch (e) { showToast('Database connection failed', true); }
}

async function fetchDestinationsForEditor() {
    try {
        const res = await fetch(`${API_URL}/destinations`);
        const json = await res.json();
        allDestinations = json.data || [];
        
        const select = document.getElementById('edit-dest-select');
        if (!select) return;
        
        select.innerHTML = '<option value="" disabled selected>Select an archive to revise...</option>';
        allDestinations.sort((a, b) => a.name.localeCompare(b.name)).forEach(d => {
            select.innerHTML += `<option value="${d._id}">${d.name}</option>`;
        });
    } catch (e) { console.error("Failed to load destinations", e); }
}

async function fetchStories() {
    try {
        const res = await fetch(`${API_URL}/stories`);
        const json = await res.json();
        const data = json.data || [];
        
        const list = document.getElementById('list-stor');
        list.innerHTML = '';
        
        if (data.length === 0) {
            list.innerHTML = '<p class="curator-empty">No community stories pending.</p>';
            return;
        }

        data.forEach(s => {
            let authorName = s.user?.name || 'Unknown Traveler';
            let authorEmail = s.user?.email || '';
            const destName = s.destination ? s.destination.name : 'Unknown Coordinates';

            list.innerHTML += `
                <div class="curator-record wide-record gs-story">
                    <div class="record-main">
                        <span class="record-badge">${destName}</span>
                        <h4>${s.title}</h4>
                        <p class="record-meta">Penned by <strong>${authorName}</strong> ${authorEmail ? `&middot; ${authorEmail}` : ''}</p>
                    </div>
                    <div class="record-actions">
                        <a href="./singleStory.html?id=${s._id}" class="record-link-btn" target="_blank">View</a>
                        <button onclick="delStor('${s._id}')" class="record-del-btn">Erase</button>
                    </div>
                </div>`;
        });

        gsap.fromTo(".gs-story", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 });
    } catch (e) { console.error(e); }
}

// --- FORMS & SUBMISSIONS ---

// Create Destination
const destForm = document.getElementById('form-dest');
if (destForm) {
    destForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById('dest-name').value,
            tagline: document.getElementById('dest-tagline').value,
            heroImage: document.getElementById('dest-image').value,
            description: document.getElementById('dest-desc').value,
            culture: document.getElementById('dest-culture').value
        };
        
        const res = await fetch(`${API_URL}/destinations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });
        
        if (res.ok) { 
            e.target.reset(); 
            fetchDestinations(); 
            fetchDestinationsForEditor(); 
            showToast('Destination Added to Atlas!'); 
        }
        else { showToast('Failed to save', true); }
    });
}

// Edit Destination Auto-Fill
const editDestSelect = document.getElementById('edit-dest-select');
if (editDestSelect) {
    editDestSelect.addEventListener('change', (e) => {
        const destId = e.target.value;
        const dest = allDestinations.find(d => d._id === destId);
        
        if (dest) {
            document.getElementById('edit-dest-name').value = dest.name;
            document.getElementById('edit-dest-tagline').value = dest.tagline;
            document.getElementById('edit-dest-image').value = dest.heroImage;
            document.getElementById('edit-dest-desc').value = dest.description;
            document.getElementById('edit-dest-culture').value = dest.culture || '';
        }
    });
}

// Update Destination
const editDestForm = document.getElementById('form-edit-dest');
if (editDestForm) {
    editDestForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const destId = document.getElementById('edit-dest-select').value;
        if (!destId) return showToast('Select a destination first.', true);

        const payload = {
            name: document.getElementById('edit-dest-name').value,
            tagline: document.getElementById('edit-dest-tagline').value,
            heroImage: document.getElementById('edit-dest-image').value,
            description: document.getElementById('edit-dest-desc').value,
            culture: document.getElementById('edit-dest-culture').value
        };

        const res = await fetch(`${API_URL}/destinations/${destId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            showToast('Atlas Revision Complete!');
            fetchDestinations(); 
            fetchDestinationsForEditor(); 
        } else {
            showToast('Failed to update', true);
        }
    });
}

// --- DELETIONS ---
window.delDest = async (id) => {
    if(!confirm('Erase this destination from the atlas?')) return;
    const res = await fetch(`${API_URL}/destinations/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    if(res.ok) { 
        fetchDestinations(); 
        fetchDestinationsForEditor(); 
        showToast('Coordinates erased.'); 
    }
};

window.delStor = async (id) => {
    if(!confirm('Permanently remove this traveler story?')) return;
    const res = await fetch(`${API_URL}/stories/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    if(res.ok) { fetchStories(); showToast('Record removed.'); }
};

// --- LOGOUT ---
document.getElementById('admin-logout-nav').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('storyscapes_token');
    localStorage.removeItem('storyscapes_user');
    window.location.replace('./auth.html');
});
