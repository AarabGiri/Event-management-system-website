/**
 * EventPulse - Comprehensive Initial Events Dataset
 * Dynamically computes upcoming dates so countdown timers are always live and ticking!
 */

const getFutureDate = (daysAhead, hours = 10, minutes = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
};

const INITIAL_EVENTS = [
    {
        id: "evt-01",
        title: "NextGen AI & Cloud Summit 2026",
        tagline: "Exploring the future of generative AI, neural architectures, and intelligent cloud systems.",
        category: "Tech & AI",
        featured: true,
        date: getFutureDate(3, 9, 30),
        displayDate: "In 3 Days • 9:30 AM - 5:00 PM",
        venue: "Silicon Innovation Center, Hall A",
        city: "San Francisco / Virtual",
        mapUrl: "https://maps.google.com/?q=Silicon+Valley",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
        price: 0,
        priceLabel: "Free Entry",
        totalCapacity: 500,
        registeredCount: 412,
        badge: "Trending 🔥",
        description: "Join leading AI researchers, developers, and founders for a comprehensive deep-dive into autonomous agents, large multimodal models, and next-generation cloud infrastructure. Includes live coding labs, breakthrough demos, and networking mixers.",
        agenda: [
            { time: "09:30 AM", title: "Keynote: Autonomous Agents & Frontier Intelligence", speaker: "Dr. Elena Rostova" },
            { time: "11:30 AM", title: "Building Resilient Cloud Infrastructures for AI", speaker: "Marcus Vance" },
            { time: "01:30 PM", title: "Networking Lunch & Interactive Tech Pavilions", speaker: "All Attendees" },
            { time: "03:00 PM", title: "Hands-on Workshop: Fine-tuning & Deployment", speaker: "Sarah Jenkins" },
            { time: "04:30 PM", title: "Closing Panel & Startup Pitch Showcase", speaker: "VC Panelists" }
        ],
        speakers: [
            { name: "Dr. Elena Rostova", role: "Head of AI Research", company: "DeepMind Labs", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" },
            { name: "Marcus Vance", role: "VP of Cloud Architecture", company: "Nexus Networks", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
            { name: "Sarah Jenkins", role: "Lead Systems Engineer", company: "Prism ML", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["AI", "Cloud", "Machine Learning", "Tech Summit"]
    },
    {
        id: "evt-02",
        title: "Neon Echoes Indie Music Festival",
        tagline: "An electrifying open-air evening featuring top indie rock bands and synth-wave artists.",
        category: "Music & Concerts",
        featured: true,
        date: getFutureDate(7, 18, 0),
        displayDate: "In 7 Days • 6:00 PM - 11:30 PM",
        venue: "Sunset Amphitheatre, Riverfront Park",
        city: "Austin, TX",
        mapUrl: "https://maps.google.com/?q=Austin+Riverfront+Amphitheater",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
        price: 49,
        priceLabel: "$49 / Pass",
        totalCapacity: 1200,
        registeredCount: 1080,
        badge: "Selling Fast ⚡",
        description: "Experience high-energy live music across three custom neon-lit stages. Enjoy artisan food trucks, immersive laser visual shows, VIP lounge decks, and non-stop indie and electronic performances.",
        agenda: [
            { time: "06:00 PM", title: "Gates Open & Acoustic Sunset Lounge", speaker: "The Sunlit Quartet" },
            { time: "07:30 PM", title: "Indie Rock Wavefront Stage", speaker: "Velvet Horizon" },
            { time: "09:15 PM", title: "Headline Synth-Wave & Laser Experience", speaker: "CyberDream Collective" },
            { time: "11:00 PM", title: "Grand Finale Fireworks & Encore", speaker: "Festival All-Stars" }
        ],
        speakers: [
            { name: "Velvet Horizon", role: "Indie Rock Band", company: "Nashville Sound", avatar: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=200&q=80" },
            { name: "CyberDream Collective", role: "Electronic Synthesis Duo", company: "SynthWave Records", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["Music", "Festival", "Concert", "Nightlife"]
    },
    {
        id: "evt-03",
        title: "Global UX/UI Design & Product Masterclass",
        tagline: "Master modern design systems, micro-interactions, and accessible product craft.",
        category: "Design & Arts",
        featured: true,
        date: getFutureDate(11, 14, 0),
        displayDate: "In 11 Days • 2:00 PM - 6:30 PM",
        venue: "Designworks Hub, Studio 4",
        city: "New York / Hybrid",
        mapUrl: "https://maps.google.com/?q=New+York+Design+Hub",
        image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
        price: 29,
        priceLabel: "$29 / Seat",
        totalCapacity: 150,
        registeredCount: 135,
        badge: "Popular 🎨",
        description: "An intensive masterclass tailored for designers and frontend developers. Learn the principles of building scalable design tokens, WCAG 2.2 accessibility compliance, spatial UI, and crafting delight in modern web interfaces.",
        agenda: [
            { time: "02:00 PM", title: "Evolution of Design Systems in 2026", speaker: "Chloe Sterling" },
            { time: "03:15 PM", title: "Interactive Prototyping & Motion Design", speaker: "Leo Zhang" },
            { time: "04:45 PM", title: "Live Design Teardowns & Portfolio Reviews", speaker: "Panel of Design Leads" },
            { time: "05:45 PM", title: "Open Q&A and Resource Kit Distribution", speaker: "All Mentors" }
        ],
        speakers: [
            { name: "Chloe Sterling", role: "Design Director", company: "Aura Studio", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
            { name: "Leo Zhang", role: "Principal Product Designer", company: "Starlight UX", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["UI/UX", "Design", "Figma", "Frontend"]
    },
    {
        id: "evt-04",
        title: "Venture Velocity: Startup Pitch & Angel Summit",
        tagline: "Connecting visionary founders with active angel investors and venture capitalists.",
        category: "Business & Startups",
        featured: false,
        date: getFutureDate(15, 10, 0),
        displayDate: "In 15 Days • 10:00 AM - 4:00 PM",
        venue: "Grand Metropolitan Ballroom",
        city: "Boston, MA",
        mapUrl: "https://maps.google.com/?q=Boston+Convention+Center",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
        price: 75,
        priceLabel: "$75 / Delegate",
        totalCapacity: 300,
        registeredCount: 220,
        badge: "Exclusive 💼",
        description: "Watch 20 curated high-growth seed and Series-A startups pitch live for over $1.5M in investment commitments. Features private investor roundtables, founder legal workshops, and speed-networking sessions.",
        agenda: [
            { time: "10:00 AM", title: "Opening Address: The 2026 Startup Landscape", speaker: "Harrison Reed" },
            { time: "11:00 AM", title: "Session 1: SaaS & AI Pitch Showcase", speaker: "10 Startup Finalists" },
            { time: "01:00 PM", title: "Investor Luncheon & Deal-Flow Matching", speaker: "Accredited Angels" },
            { time: "02:30 PM", title: "Session 2: Climate Tech & Hardware Demos", speaker: "10 Startup Finalists" },
            { time: "03:45 PM", title: "Awards Ceremony & Winner Announcement", speaker: "Harrison Reed" }
        ],
        speakers: [
            { name: "Harrison Reed", role: "Managing Partner", company: "Apex Venture Partners", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" },
            { name: "Amara Patel", role: "Angel Syndicates Lead", company: "Frontier Angels", avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["Business", "Startups", "Investment", "Networking"]
    },
    {
        id: "evt-05",
        title: "CodeCraft 48-Hour Fullstack Hackathon",
        tagline: "Build innovative web & mobile solutions for real-world impact. $15,000 in prizes!",
        category: "Workshops & Hackathons",
        featured: false,
        date: getFutureDate(19, 17, 0),
        displayDate: "In 19 Days • 5:00 PM Kickoff",
        venue: "TechHub Innovation Garage",
        city: "Seattle / Global Online",
        mapUrl: "https://maps.google.com/?q=Seattle+Tech+Hub",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
        price: 0,
        priceLabel: "Free Entry",
        totalCapacity: 400,
        registeredCount: 360,
        badge: "Prizes $15K 🏆",
        description: "Form a team of up to 4 members or join solo to hack for 48 hours. Mentors on-site around the clock, free meals, swag bags, and direct interviews with top recruiting partner companies.",
        agenda: [
            { time: "05:00 PM", title: "Problem Statement Reveal & Team Formation", speaker: "Organizing Team" },
            { time: "07:00 PM", title: "Hacking Begins & Mentor Check-ins", speaker: "All Teams" },
            { time: "12:00 PM +1", title: "Mid-way Progress Evaluation & Snacks", speaker: "Mentors" },
            { time: "03:00 PM +2", title: "Code Freeze & Project Submissions", speaker: "All Teams" },
            { time: "05:00 PM +2", title: "Live Demos & Grand Prize Ceremony", speaker: "Judging Committee" }
        ],
        speakers: [
            { name: "Alex Chen", role: "Staff Engineer & Open Source Lead", company: "BuildCloud", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80" },
            { name: "Nadia Rossi", role: "DevRel Advocate", company: "API Forge", avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["Hackathon", "Coding", "Fullstack", "Competition"]
    },
    {
        id: "evt-06",
        title: "City Marathon & Urban Wellness Expo 2026",
        tagline: "Celebrate fitness, health, and endurance across scenic 5K, 10K, and 21K routes.",
        category: "Sports & Fitness",
        featured: false,
        date: getFutureDate(24, 6, 30),
        displayDate: "In 24 Days • 6:30 AM Start",
        venue: "Olympic Plaza & Waterfront Course",
        city: "Chicago, IL",
        mapUrl: "https://maps.google.com/?q=Chicago+Waterfront+Plaza",
        image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80",
        price: 25,
        priceLabel: "$25 / Runner",
        totalCapacity: 2500,
        registeredCount: 2190,
        badge: "Health & Sport 🏃",
        description: "Join thousands of runners and fitness enthusiasts for the annual city marathon. Includes official timing bib, finisher medal, hydration stations, and post-race wellness expo featuring nutritionists and sports physiotherapists.",
        agenda: [
            { time: "06:00 AM", title: "Warm-up & Athlete Assembly", speaker: "Coach Dave Miller" },
            { time: "06:30 AM", title: "Half-Marathon (21K) Flag-off", speaker: "City Mayor" },
            { time: "07:15 AM", title: "10K & 5K Fun Run Flag-off", speaker: "Athletics Committee" },
            { time: "10:30 AM", title: "Finisher Celebrations & Podium Awards", speaker: "All Runners" }
        ],
        speakers: [
            { name: "Dave Miller", role: "Olympic Marathon Coach", company: "PaceMasters", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
            { name: "Dr. Rachel Kim", role: "Sports Nutrition Specialist", company: "Vitality Clinic", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["Marathon", "Running", "Fitness", "Health"]
    },
    {
        id: "evt-07",
        title: "Artisan Coffee Roasting & Latte Art Workshop",
        tagline: "Hands-on sensory journey into bean origins, brewing science, and free-pour art.",
        category: "Workshops & Hackathons",
        featured: false,
        date: getFutureDate(28, 11, 0),
        displayDate: "In 28 Days • 11:00 AM - 2:00 PM",
        venue: "Brew & Bean Academy, Roastery Loft",
        city: "Portland, OR",
        mapUrl: "https://maps.google.com/?q=Portland+Coffee+Academy",
        image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
        price: 35,
        priceLabel: "$35 / Person",
        totalCapacity: 30,
        registeredCount: 26,
        badge: "Few Spots Left ☕",
        description: "An intimate workshop guided by championship baristas. Discover how elevation, roast profiles, and milk microfoam texture transform taste. Take home a bag of freshly roasted single-origin beans and custom brewing notes.",
        agenda: [
            { time: "11:00 AM", title: "Cupping Session: Tasting Single-Origin Varietals", speaker: "Lucas Meyer" },
            { time: "12:00 PM", title: "Espresso Extraction & Grinder Calibration", speaker: "Lucas Meyer" },
            { time: "01:00 PM", title: "Latte Art Hands-on Pouring Practice", speaker: "Lucas Meyer" }
        ],
        speakers: [
            { name: "Lucas Meyer", role: "National Barista Champion", company: "RoastCrafters", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["Coffee", "Culinary", "Workshop", "Hands-on"]
    },
    {
        id: "evt-08",
        title: "CyberShield: Ethical Hacking & Security Conference",
        tagline: "Live red vs. blue team drills, zero-day threat analysis, and cryptographic defenses.",
        category: "Tech & AI",
        featured: false,
        date: getFutureDate(34, 10, 0),
        displayDate: "In 34 Days • 10:00 AM - 5:30 PM",
        venue: "Cyber Defense Arena, Tech District",
        city: "Washington, D.C.",
        mapUrl: "https://maps.google.com/?q=Washington+DC+Convention+Center",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
        price: 0,
        priceLabel: "Free Entry",
        totalCapacity: 350,
        registeredCount: 290,
        badge: "Cyber Security 🛡️",
        description: "Explore the bleeding edge of application security, penetration testing, identity management, and cloud defenses with seasoned security researchers and white-hat penetration testers.",
        agenda: [
            { time: "10:00 AM", title: "Threat Vectors 2026: AI-Driven Phishing & Exploits", speaker: "Devon Thorne" },
            { time: "11:45 AM", title: "Live Capture-the-Flag (CTF) Challenge Kickoff", speaker: "Security Ops Team" },
            { time: "02:00 PM", title: "Zero Trust Architecture in Kubernetes", speaker: "Maya Lin" },
            { time: "04:00 PM", title: "CTF Solutions Walkthrough & Winner Recognitions", speaker: "Devon Thorne" }
        ],
        speakers: [
            { name: "Devon Thorne", role: "Principal Penetration Tester", company: "RedTeam Ops", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
            { name: "Maya Lin", role: "Cloud Security Architect", company: "IronClad Systems", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
        ],
        tags: ["Cybersecurity", "InfoSec", "Ethical Hacking", "Tech"]
    }
];

// Helper to get all categories
const CATEGORIES = [
    "All",
    "Tech & AI",
    "Music & Concerts",
    "Design & Arts",
    "Business & Startups",
    "Workshops & Hackathons",
    "Sports & Fitness"
];
