document.addEventListener("DOMContentLoaded", () => {
    
    const initSmartNavbar = () => {
        const userStr = localStorage.getItem('storyscapes_user');
        const navActions = document.querySelector('.nav-actions');

        // If a user is logged in
        if (userStr) {
            const user = JSON.parse(userStr);
            const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

            // --- SMART PATHING ---
            const isSubPage = window.location.pathname.includes('/pages/');

            // --- NEW: HIDE JOURNAL FOR ADMINS ---
            if (user.role === 'admin') {
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    // Hunt for the link containing the text "Journal" and hide it
                    if (link.textContent.trim().toLowerCase() === 'journal') {
                        link.style.display = 'none';
                    }
                });
            }

            // If the navbar exists on this specific page, swap the button
            if (navActions) {
                // Assign the correct link based on their role and current location
                let dashboardLink;
                if (user.role === 'admin') {
                    dashboardLink = isSubPage ? './admin.html' : './pages/admin.html';
                } else {
                    dashboardLink = isSubPage ? './profile.html' : './pages/profile.html';
                }

                // Swap the "Sign In" button for the Premium 3D Avatar
                navActions.innerHTML = `
                    <a href="${dashboardLink}" class="user-avatar" title="Go to Dashboard">
                        ${initial}
                    </a>
                `;
            }
        }
    };

    // Run the navbar check immediately
    initSmartNavbar();
});
