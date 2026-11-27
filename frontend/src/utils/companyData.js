// High-quality vector SVG company brand logos (100% self-contained & reliable)
export const companyLogos = {
  'Nova Digital Labs': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%233B82F6"/><stop offset="100%" stop-color="%231D4ED8"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(%23g1)"/><path d="M50 20 L58 38 L78 42 L63 56 L67 76 L50 66 L33 76 L37 56 L22 42 L42 38 Z" fill="%23FFFFFF"/><circle cx="50" cy="50" r="8" fill="%2393C5FD"/></svg>`,
  'CloudScale Systems': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2306B6D4"/><stop offset="100%" stop-color="%230284C7"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(%23g2)"/><path d="M35 65 h34 a16 16 0 0 0 2 -32 a20 20 0 0 0 -38 -6 a15 15 0 0 0 -13 14 a14 14 0 0 0 15 24 z" fill="%23FFFFFF"/><path d="M42 52 l8 -8 l8 8 M50 44 v16" stroke="%230284C7" stroke-width="3" stroke-linecap="round" fill="none"/></svg>`,
  'Apex Cognitive Labs': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%238B5CF6"/><stop offset="100%" stop-color="%236D28D9"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(%23g3)"/><circle cx="50" cy="30" r="7" fill="%23FFFFFF"/><circle cx="30" cy="65" r="7" fill="%23FFFFFF"/><circle cx="70" cy="65" r="7" fill="%23FFFFFF"/><circle cx="50" cy="52" r="9" fill="%23C4B5FD"/><line x1="50" y1="30" x2="50" y2="52" stroke="%23FFFFFF" stroke-width="4"/><line x1="30" y1="65" x2="50" y2="52" stroke="%23FFFFFF" stroke-width="4"/><line x1="70" y1="65" x2="50" y2="52" stroke="%23FFFFFF" stroke-width="4"/></svg>`,
  'PixelCraft Studio': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23EC4899"/><stop offset="100%" stop-color="%23F43F5E"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(%23g4)"/><rect x="26" y="26" width="22" height="22" rx="6" fill="%23FFFFFF"/><rect x="52" y="26" width="22" height="22" rx="6" fill="%23FED7AA"/><rect x="26" y="52" width="22" height="22" rx="6" fill="%23FDE047"/><rect x="52" y="52" width="22" height="22" rx="6" fill="%23FFFFFF"/></svg>`,
  'Vanguard Solutions': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2310B981"/><stop offset="100%" stop-color="%23047857"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(%23g5)"/><path d="M50 22 L74 32 v22 c0 16 -10 28 -24 32 c-14 -4 -24 -16 -24 -32 V32 Z" fill="%23FFFFFF"/><path d="M42 50 l6 6 l12 -12" stroke="%23047857" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
  'InsightStream Analytics': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23F59E0B"/><stop offset="100%" stop-color="%23D97706"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(%23g6)"/><rect x="26" y="54" width="10" height="24" rx="3" fill="%23FFFFFF"/><rect x="42" y="42" width="10" height="36" rx="3" fill="%23FFFFFF"/><rect x="58" y="30" width="10" height="48" rx="3" fill="%23FFFFFF"/><path d="M26 44 l18 -12 l16 6 l16 -14" stroke="%23FEF3C7" stroke-width="3" stroke-linecap="round" fill="none"/></svg>`,
};

export const defaultCompanyLogo = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="gd" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2364748B"/><stop offset="100%" stop-color="%23334155"/></linearGradient></defs><rect width="100" height="100" rx="22" fill="url(%23gd)"/><path d="M30 70 V35 h40 v35 M42 70 V52 h16 v18 M40 42 h6 M54 42 h6" stroke="%23FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;

export const getCompanyLogo = (companyName) => {
  if (!companyName) return defaultCompanyLogo;
  const match = Object.keys(companyLogos).find(
    (name) => name.toLowerCase() === companyName.toLowerCase().trim()
  );
  return match ? companyLogos[match] : defaultCompanyLogo;
};

// Formats any salary string to standard Nepali Rupees (NPR)
export const formatSalary = (salary) => {
  if (!salary) return '';
  const trimmed = salary.toString().trim();
  if (trimmed.startsWith('NPR') || trimmed.startsWith('रू')) {
    return trimmed;
  }
  // Convert USD hourly rates to realistic NPR monthly stipends
  if (trimmed.includes('$35 - $42') || trimmed.includes('35 - 42')) {
    return 'NPR 30,000 - 40,000 / mo';
  }
  if (trimmed.includes('$36 - $44') || trimmed.includes('36 - 44')) {
    return 'NPR 35,000 - 45,000 / mo';
  }
  if (trimmed.includes('$40 - $50') || trimmed.includes('40 - 50')) {
    return 'NPR 40,000 - 55,000 / mo';
  }
  if (trimmed.includes('$32 - $38') || trimmed.includes('32 - 38')) {
    return 'NPR 28,000 - 38,000 / mo';
  }
  if (trimmed.includes('$95,000') || trimmed.includes('95,000 - 115,000')) {
    return 'NPR 90,000 - 130,000 / mo';
  }
  if (trimmed.includes('$30 - $36') || trimmed.includes('30 - 36')) {
    return 'NPR 25,000 - 35,000 / mo';
  }
  // Generic dollar replacement
  if (trimmed.includes('$')) {
    return trimmed.replace(/\$/g, 'NPR ');
  }
  return `NPR ${trimmed}`;
};

export const companyProfiles = [
  {
    name: 'Nova Digital Labs',
    industry: 'Digital Product Engineering',
    location: 'Remote / Kathmandu',
    description: 'A modern engineering studio focused on building high-performance web applications, design systems, and developer productivity tools.',
    founded: '2021',
    size: '50 - 150 employees',
    logo: companyLogos['Nova Digital Labs'],
  },
  {
    name: 'CloudScale Systems',
    industry: 'Cloud Infrastructure & Networks',
    location: 'Remote',
    description: 'Provides scalable backend microservices, resilient data streaming, and enterprise infrastructure solutions for high-growth tech ventures.',
    founded: '2019',
    size: '100 - 250 employees',
    logo: companyLogos['CloudScale Systems'],
  },
  {
    name: 'Apex Cognitive Labs',
    industry: 'Applied Artificial Intelligence',
    location: 'Hybrid / Lalitpur',
    description: 'Specializes in machine learning research, neural model optimization, and data intelligence pipelines across biotechnology and robotics.',
    founded: '2022',
    size: '25 - 50 employees',
    logo: companyLogos['Apex Cognitive Labs'],
  },
  {
    name: 'PixelCraft Studio',
    industry: 'Product Design & Creative Tech',
    location: 'Remote',
    description: 'An award-winning product design agency creating accessible design systems, user interfaces, and brand experiences for next-generation software.',
    founded: '2020',
    size: '30 - 75 employees',
    logo: companyLogos['PixelCraft Studio'],
  },
  {
    name: 'Vanguard Solutions',
    industry: 'Enterprise Software & Security',
    location: 'Kathmandu / Hybrid',
    description: 'Delivers mission-critical enterprise platforms, distributed cloud architecture, and security-hardened web applications for global organizations.',
    founded: '2018',
    size: '200 - 500 employees',
    logo: companyLogos['Vanguard Solutions'],
  },
  {
    name: 'InsightStream Analytics',
    industry: 'Data Intelligence & Analytics',
    location: 'Remote',
    description: 'Empowers organizations with predictive analytics, business intelligence dashboards, and real-time operational data processing.',
    founded: '2020',
    size: '60 - 120 employees',
    logo: companyLogos['InsightStream Analytics'],
  },
];
