// 1. CHANGED: Pointing to the Auth Registration endpoint
const API_URL = 'http://localhost:5000/api/auth/register'; 

const users = [
    { name: "Elena Rostova", email: "elena@example.com", password: "Story2026!", role: "user" },
    { name: "Marcus Vance", email: "marcus@example.com", password: "Story2026!", role: "user" },
    { name: "Aisha Khan", email: "aisha@example.com", password: "Story2026!", role: "user" },
    { name: "Julian Wright", email: "julian@example.com", password: "Story2026!", role: "user" },
    { name: "Chloe Chen", email: "chloe@example.com", password: "Story2026!", role: "user" },
    { name: "Liam O'Connor", email: "liam@example.com", password: "Story2026!", role: "user" },
    { name: "Sofia Rossi", email: "sofia@example.com", password: "Story2026!", role: "user" },
    { name: "Noah Silva", email: "noah@example.com", password: "Story2026!", role: "user" },
    { name: "Zoe Dupont", email: "zoe@example.com", password: "Story2026!", role: "user" },
    { name: "Elias Thorne", email: "elias@example.com", password: "Story2026!", role: "user" }
];

async function floodDatabase() {
    console.log(`Starting database flood with ${users.length} travelers...\n`);
    
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < users.length; i++) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 2. REMOVED: No token needed to register new accounts
                },
                body: JSON.stringify(users[i])
            });

            if (response.ok) {
                console.log(`[✓] Success: Registered ${users[i].name}`);
                successCount++;
            } else {
                const errorData = await response.json();
                console.error(`[X] Failed: ${users[i].name} - ${errorData.message || response.statusText}`);
                failCount++;
            }
        } catch (error) {
            console.error(`[!] Network Error on ${users[i].name}: ${error.message}`);
            failCount++;
        }
        
        // Add a tiny 100ms delay between requests to be gentle on your local server
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\nFlood Complete! Successfully registered: ${successCount} | Failed: ${failCount}`);
}

floodDatabase();
