const API_URL = 'http://localhost:5000/api/destinations';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMDcwYjQzYTk0NTA1NWUwNjhlMDZiYiIsImlhdCI6MTc3ODg2OTQ4NCwiZXhwIjoxNzgxNDYxNDg0fQ.pSg35xeFJ3o5hW0EKnUXAkV9xDJTTn61Ba-3DJhLoFM';

const destinations = [
    { name: "Kyoto, Japan", tagline: "The Silent Temples of Autumn", heroImage: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=1500&auto=format&fit=crop", description: "Wander through bamboo groves and ancient shrines where time seems to stand still. Kyoto is a masterful preservation of Japan’s imperial past, cloaked in mist and maple leaves.", culture: "Deeply rooted in Zen Buddhism, the intricate art of the tea ceremony, and a harmonious balance between nature and traditional wooden architecture." },
    { name: "London, UK", tagline: "Echoes of the Empire", heroImage: "https://images.unsplash.com/photo-1513635269975-5969336ac1cb?q=80&w=1500&auto=format&fit=crop", description: "A sprawling metropolis where medieval history and modern innovation collide. From the fog-rolling Thames to the vibrant energy of Soho, London is a city of endless narratives.", culture: "A cosmopolitan melting pot built on a foundation of royal tradition, literary giants, and centuries of global influence." },
    { name: "Bali, Indonesia", tagline: "Spirits of the Canopy", heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1500&auto=format&fit=crop", description: "Lush emerald rice terraces cascade down volcanic slopes into crystal waters. Bali is not just a place, but a mood—a spiritual awakening hidden in the jungle.", culture: "Balinese Hinduism shapes daily life, evident in the omnipresent canang sari offerings and mesmerizing traditional gamelan music." },
    { name: "Swiss Alps, Switzerland", tagline: "Whispers of the Alps", heroImage: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1500&auto=format&fit=crop", description: "Jagged, snow-capped peaks pierce the sky above pristine alpine lakes. A sanctuary of absolute silence, broken only by the wind through the pines.", culture: "A rugged mountain heritage defined by high-altitude farming, precision craftsmanship, and a deep reverence for the unforgiving landscape." },
    { name: "Sahara, Morocco", tagline: "Ocean of Sand", heroImage: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1500&auto=format&fit=crop", description: "Endless undulating dunes glow crimson at sunset. The Sahara is a vast, humbling expanse that forces you to listen to the rhythm of the earth.", culture: "Nomadic Berber traditions thrive here, centered around starry desert camps, mint tea hospitality, and ancient trade routes." },
    { name: "Rome, Italy", tagline: "The Eternal Echoes", heroImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1500&auto=format&fit=crop", description: "Walk the same cobblestones as emperors. Rome is an open-air museum where everyday life plays out against a backdrop of monumental antiquity.", culture: "A passionate embrace of la dolce vita—where art, culinary mastery, and historical pride are woven into the fabric of daily life." },
    { name: "Patagonia, Argentina", tagline: "At the Edge of the World", heroImage: "https://images.unsplash.com/photo-1534430480872-3498384e54e5?q=80&w=1500&auto=format&fit=crop", description: "Glaciers crack and roar into freezing lakes beneath towering granite spires. This is the raw, untamed frontier of the South American continent.", culture: "The spirit of the gaucho endures in these harsh windswept plains, defined by resilience, folklore, and a deep connection to the wild." },
    { name: "Paris, France", tagline: "City of Golden Light", heroImage: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1500&auto=format&fit=crop", description: "Morning light cascades through centuries-old stone streets. Paris is a canvas of romantic ideals, literary history, and unparalleled elegance.", culture: "A society that elevates leisure to an art form, revolving around café philosophy, haute couture, and gastronomic perfection." },
    { name: "Varanasi, India", tagline: "The Sacred Ghats", heroImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1500&auto=format&fit=crop", description: "Life and death exist side-by-side on the steps leading to the Ganges. An intensely spiritual city that overwhelms the senses and challenges the soul.", culture: "The epicenter of Hindu devotion, marked by the mesmerizing evening Ganga Aarti, ancient silk weaving, and absolute spiritual surrender." },
    { name: "Jaipur, India", tagline: "The Pink City’s Royal Legacy", heroImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1500&auto=format&fit=crop", description: "A majestic grid of terracotta-pink palaces and imposing forts. Jaipur is a living testament to Rajput valor and architectural opulence.", culture: "Steeped in royal tradition, famous for intricate block printing, gem cutting, and the vibrant festivals of Rajasthan." },
    { name: "Meghalaya, India", tagline: "Abode of Clouds", heroImage: "https://images.unsplash.com/photo-1620619946465-b15234ce16e8?q=80&w=1500&auto=format&fit=crop", description: "Living root bridges stretch across emerald rivers in the wettest place on earth. A mystical, mist-shrouded land of waterfalls and deep caves.", culture: "Home to the matrilineal Khasi and Garo tribes, whose sustainable indigenous engineering and folklore are inextricably tied to the forest." },
    { name: "Ladakh, India", tagline: "The High Mountain Desert", heroImage: "https://images.unsplash.com/photo-1581793746485-04698e79a4e8?q=80&w=1500&auto=format&fit=crop", description: "Barren, dramatic mountains encircle crystal-clear blue lakes at breathtaking altitudes. A stark, lunar landscape that demands reverence.", culture: "A bastion of Tibetan Buddhism, where ancient monasteries cling to cliffs and prayer flags scatter blessings into the fierce wind." },
    { name: "Kerala, India", tagline: "Serenity in the Tropics", heroImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1500&auto=format&fit=crop", description: "A tranquil labyrinth of palm-fringed backwaters and serene houseboats. The pace of life here is dictated by the gentle ebb and flow of the tides.", culture: "Known as God’s Own Country, celebrated for its Ayurvedic healing traditions, Kathakali dance storytelling, and spice-rich cuisine." },
    { name: "Hampi, India", tagline: "Ruins of a Forgotten Empire", heroImage: "https://images.unsplash.com/photo-1600100397608-f010f41cb8e1?q=80&w=1500&auto=format&fit=crop", description: "Surreal boulder-strewn landscapes hide the magnificent ruins of the Vijayanagara Empire. A captivating collision of geology and ancient history.", culture: "A UNESCO heritage site where temple architecture and mythology draw historians, pilgrims, and wanderers alike." },
    { name: "Santorini, Greece", tagline: "Whitewashed Dreams", heroImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1500&auto=format&fit=crop", description: "Dazzling white buildings with blue domes cling to the edge of a submerged caldera. A Mediterranean paradise built on the remnants of a volcanic eruption.", culture: "Defined by its seafaring history, resilient vineyards, and a relaxed, sun-drenched island lifestyle." },
    { name: "Machu Picchu, Peru", tagline: "Lost City of the Incas", heroImage: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1500&auto=format&fit=crop", description: "Hidden high in the Andes, this 15th-century citadel emerges from the morning fog like a ghost. An architectural marvel perfectly aligned with the stars.", culture: "A profound symbol of the Incan Empire’s astronomical wisdom, agricultural mastery, and reverence for the mountain deities." },
    { name: "Reykjavik, Iceland", tagline: "Land of Fire and Ice", heroImage: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?q=80&w=1500&auto=format&fit=crop", description: "A quirky, colorful capital sitting on the edge of the Arctic Circle, serving as the gateway to erupting geysers, black sand beaches, and the Northern Lights.", culture: "A resilient Nordic society steeped in Viking sagas, a thriving contemporary music scene, and a deep respect for the volatile earth." },
    { name: "Serengeti, Tanzania", tagline: "The Great Migration", heroImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1500&auto=format&fit=crop", description: "Vast golden savannahs stretch to the horizon, hosting the greatest wildlife spectacle on the planet. The raw, unfiltered circle of life plays out here daily.", culture: "Home to the Maasai people, whose pastoral traditions, vibrant beadwork, and deep understanding of the land have endured for centuries." },
    { name: "Banff, Canada", tagline: "Emerald Lakes and Peaks", heroImage: "https://images.unsplash.com/photo-1518481852452-9415b262eba4?q=80&w=1500&auto=format&fit=crop", description: "Glacier-fed lakes glow with an impossible, vibrant turquoise beneath the towering Rocky Mountains. A sanctuary of untamed wilderness and fresh alpine air.", culture: "A culture rooted in outdoor exploration, indigenous history, and the preservation of one of the world’s most stunning national park systems." },
    { name: "Venice, Italy", tagline: "The Sinking Romance", heroImage: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=1500&auto=format&fit=crop", description: "A city built on water, where gondolas glide through narrow canals reflecting Renaissance palaces. An impossibly beautiful, fragile masterpiece.", culture: "Famous for its mysterious Carnevale masks, exquisite Murano glassblowing, and a maritime history that once dominated the Mediterranean." },
    { name: "Havana, Cuba", tagline: "Rhythm of the Old World", heroImage: "https://images.unsplash.com/photo-1506506200949-df8644f002d1?q=80&w=1500&auto=format&fit=crop", description: "Classic cars roll past decaying colonial facades while the sound of salsa spills into the streets. A city frozen in time, pulsating with life.", culture: "A vibrant fusion of Spanish colonial heritage, Afro-Cuban rhythms, and a fiercely resilient, warm-hearted local spirit." },
    { name: "Petra, Jordan", tagline: "The Rose-Red City", heroImage: "https://images.unsplash.com/photo-1501231454593-0185f4705335?q=80&w=1500&auto=format&fit=crop", description: "Carved directly into sheer, blushing sandstone cliff faces, this ancient Nabataean capital is a wonder of archaeological scale and ambition.", culture: "A testament to the ingenuity of desert nomads who mastered water engineering and controlled the ancient spice trade routes." },
    { name: "Queenstown, New Zealand", tagline: "The Adventurer’s Canvas", heroImage: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?q=80&w=1500&auto=format&fit=crop", description: "Nestled beside a deep blue lake and surrounded by the dramatic Remarkables mountain range. The undisputed global capital of adrenaline.", culture: "A high-octane mix of extreme sports culture, indigenous Māori mythology, and laid-back Kiwi hospitality." },
    { name: "Tokyo, Japan", tagline: "Neon Pulse and Ancient Souls", heroImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1500&auto=format&fit=crop", description: "A hyper-modern metropolis of towering neon and endless crowds, hiding quiet Shinto shrines in its ultra-dense urban folds.", culture: "A fascinating paradox where cutting-edge technology and pop culture exist seamlessly alongside rigorous traditional etiquette." },
    { name: "New York City, USA", tagline: "The Concrete Jungle", heroImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1500&auto=format&fit=crop", description: "A relentless skyline of steel and glass rising above streets that never sleep. The ultimate epicenter of human ambition and diversity.", culture: "Defined by an unapologetic, fast-paced hustle, iconic arts scenes, and a culinary landscape shaped by millions of immigrants." }
];

async function floodDatabase() {
    console.log(`Starting database flood with ${destinations.length} destinations...\n`);
    
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < destinations.length; i++) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TOKEN}`
                },
                body: JSON.stringify(destinations[i])
            });

            if (response.ok) {
                console.log(`[✓] Success: Added ${destinations[i].name}`);
                successCount++;
            } else {
                const errorData = await response.json();
                console.error(`[X] Failed: ${destinations[i].name} - ${errorData.message || response.statusText}`);
                failCount++;
            }
        } catch (error) {
            console.error(`[!] Network Error on ${destinations[i].name}: ${error.message}`);
            failCount++;
        }
        
        // Add a tiny 100ms delay between requests to be gentle on your local MongoDB
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`\nFlood Complete! Successfully added: ${successCount} | Failed: ${failCount}`);
}

floodDatabase();
