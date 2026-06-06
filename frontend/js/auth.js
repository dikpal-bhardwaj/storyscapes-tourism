// --- CONFIGURATION & API ---
const API_URL = 'http://localhost:5000/api/auth';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial Landing Animation (Choreography)
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.from(".bg-drone-shot", { scale: 1.2, duration: 3 })
      .from(".bg-overlay", { opacity: 0, duration: 1.5 }, "-=2.5")
      .from(".inner-frame", { y: 100, opacity: 0, duration: 1.5 }, "-=2")
      .from(".floating-badge", { scale: 0, rotation: 180, duration: 1 }, "-=1")
      .from(".auth-form-shell", { x: 50, opacity: 0, duration: 1.5 }, "-=1.5")
      .from(".auth-nav", { opacity: 0, y: -20 }, "-=1");

    // 2. Smart Redirect Logic: Check if user clicked "Start Journey"
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'register') {
        setTimeout(() => {
            toggleAuth('register');
        }, 800); 
    }

    // 3. Mouse Parallax for the Floating Visual Frame
    document.addEventListener("mousemove", (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 35;
        const y = (window.innerHeight / 2 - e.pageY) / 35;
        gsap.to(".floating-visual-frame", { 
            x: x, 
            y: y, 
            rotationY: x / 2, 
            rotationX: -y / 2, 
            duration: 1.2, 
            ease: "power2.out" 
        });
    });
});

// --- UI HELPERS ---

const showMessage = (msg, type) => {
    const msgDiv = document.getElementById('auth-message');
    msgDiv.textContent = msg;
    msgDiv.className = `auth-message ${type}`;
    gsap.fromTo(msgDiv, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 });
};

const hideMessage = () => {
    document.getElementById('auth-message').className = 'auth-message hidden';
};

// Toggle between Login and Register steps
const toggleAuth = (target) => {
    const loginStep = document.getElementById('login-step');
    const registerStep = document.getElementById('register-step');
    const frame = document.querySelector('.inner-frame');
    const badge = document.getElementById('badge-text');
    
    hideMessage();

    if (target === 'register') {
        gsap.to(loginStep, { opacity: 0, x: -20, duration: 0.4, onComplete: () => {
            loginStep.classList.add('hidden');
            registerStep.classList.remove('hidden');
            gsap.fromTo(registerStep, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.6 });
            
            // Morph the frame shape and swap image
            frame.style.borderRadius = "20px 120px 20px 120px";
            badge.innerText = "New Era";
            document.getElementById('morphing-image').src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000";
        }});
    } else {
        gsap.to(registerStep, { opacity: 0, x: 20, duration: 0.4, onComplete: () => {
            registerStep.classList.add('hidden');
            loginStep.classList.remove('hidden');
            gsap.fromTo(loginStep, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6 });
            
            // Morph back
            frame.style.borderRadius = "120px 20px 120px 20px";
            badge.innerText = "Est. 2026";
            document.getElementById('morphing-image').src = "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1000";
        }});
    }
};

// --- BACKEND API HANDLERS ---

// Handle Registration
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('storyscapes_token', data.data.token);
            localStorage.setItem('storyscapes_user', JSON.stringify(data.data));
            showMessage('Narrative created. Welcome aboard!', 'success');
            
            // SMART REDIRECT
            setTimeout(() => {
                if (data.data.role === 'admin') {
                    window.location.href = './admin.html';
                } else {
                    window.location.href = './profile.html';
                }
            }, 1500);
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Connection failed. Is the engine running?', 'error');
    }
});

// Handle Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('storyscapes_token', data.data.token);
            localStorage.setItem('storyscapes_user', JSON.stringify(data.data));
            showMessage('Your journey continues...', 'success');
            
            // SMART REDIRECT
            setTimeout(() => {
                if (data.data.role === 'admin') {
                    window.location.href = './admin.html';
                } else {
                    window.location.href = './profile.html';
                }
            }, 1500);
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        showMessage('Connection failed. Check your local server.', 'error');
    }
});
