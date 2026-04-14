export const site = {
  name: "RCEES",
  fullName: "Regional Centre for Energy and Environmental Sustainability",
  tagline: "A World Bank-funded Africa Centre of Excellence",
  host: "University of Energy and Natural Resources, Sunyani, Ghana",
  description:
    "RCEES is a World Bank-funded Africa Centre of Excellence at the University of Energy and Natural Resources, advancing research and postgraduate education in energy and environmental sustainability across Africa.",
  url: "https://rcees.uenr.edu.gh",
  address: {
    lines: [
      "Regional Centre for Energy and Environmental Sustainability",
      "University of Energy and Natural Resources",
      "Off Sunyani–Fiapre Road",
      "Sunyani, Bono Region, Ghana",
    ],
  },
  phones: ["+233 554 981 410", "+233 50 636 6712"],
  email: "rcees@uenr.edu.gh",
  helpDesk: "https://uenr.edu.gh/help",
  admissionsPortal: "https://admissions.uenr.edu.gh",
};

// Real imagery from rcees.uenr.edu.gh
const R = "https://rcees.uenr.edu.gh/wp-content/uploads";
const RT = "https://rcees.uenr.edu.gh/wp-content/themes/acadia/assets/img";

export const images = {
  // Hero slots — real RCEES event photos
  heroStudents: `${R}/2024/10/RCE_0206-scaled.jpg`,         // workshop / students on site
  heroSolar: `${R}/2025/04/RCE_5418-min-scaled.jpg`,        // ACE@10 event
  heroWind: `${R}/2025/05/RCE_5588_1-min-scaled.jpg`,       // event photo
  heroLab: `${R}/2025/05/RCE_5734-min-scaled.jpg`,          // environmental engineering
  heroAfrica: `${RT}/breadcrumb/breadcrumb-bg-3.jpg`,       // breadcrumb bg
  heroGraduation: `${R}/2024/10/RCE_0206-scaled.jpg`,       // workshop

  // Editorial / about imagery
  aboutTeaser: `${R}/2024/09/about-thumb-1-2.jpg`,          // about page photo
  directorWelcome: `${R}/2025/12/ADAMA.jpeg`,               // portrait
  history: `${R}/2025/04/RCE_5418-min-scaled.jpg`,          // ACE@10 event
  researchLab: `${R}/2025/05/RCE_5734-min-scaled.jpg`,      // env engineering

  // Facility / programme imagery
  facilityA: `${R}/2025/05/RCE_5734-min-scaled.jpg`,
  facilityB: `${R}/2025/05/RCE_5588_1-min-scaled.jpg`,
  facilityC: `${R}/2024/10/RCE_0206-scaled.jpg`,
  facilityD: `${R}/2024/09/about-thumb-1-2.jpg`,

  academicsHero: `${R}/2024/10/RCE_0206-scaled.jpg`,        // workshop
  researchHero: `${R}/2025/05/RCE_5734-min-scaled.jpg`,
  projects: `${R}/2025/04/RCE_5418-min-scaled.jpg`,
  engineer: `${R}/2025/12/ADAMA.jpeg`,

  news1: `${R}/2025/05/RCE_5588_1-min-scaled.jpg`,
  news2: `${R}/2025/04/RCE_5418-min-scaled.jpg`,
  news3: `${R}/2024/10/RCE_0206-scaled.jpg`,

  contact: `${R}/2024/09/about-thumb-1-2.jpg`,
  logo: "/rcees-logo.png",

  // Landing-page programme cards — local imagery
  phdCard: "/images/phd-card.jpg",
  mscCard: "/images/msc-card.jpg",
  shortCoursesCard: "/images/short-courses-card.jpg",
};

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Overview", href: "/about", description: "Vision, mission and values" },
      { label: "The Team", href: "/about/team", description: "Leadership, faculty and boards" },
      { label: "Faculty", href: "/about/faculty", description: "Teaching and research staff" },
      { label: "History", href: "/about/history", description: "Milestones since 2019" },
      { label: "Facilities", href: "/about/facilities", description: "Labs and infrastructure" },
    ],
  },
  {
    label: "Academics",
    href: "/academics",
    children: [
      { label: "Overview", href: "/academics" },
      { label: "PhD Programmes", href: "/academics/phd" },
      { label: "MSc Programmes", href: "/academics/msc" },
      { label: "MPhil Programmes", href: "/academics/mphil" },
      { label: "Professional Short Courses", href: "/academics/short-courses" },
      { label: "Admissions", href: "/academics/admissions" },
      { label: "Student Resources", href: "/academics/students" },
    ],
  },
  { label: "Research", href: "/research" },
  { label: "Projects", href: "/projects" },
  {
    label: "News & Events",
    href: "/news",
    children: [
      { label: "News", href: "/news" },
      { label: "Events", href: "/news#events" },
      { label: "Success Stories", href: "/news#stories" },
      { label: "Gallery", href: "/news#gallery" },
    ],
  },
  { label: "Partners", href: "/partners" },
  { label: "ACE Impact", href: "/ace-impact" },
  { label: "Contact", href: "/contact" },
];

export const stats = [
  { value: "300", suffix: "+", label: "Postgraduates trained" },
  { value: "13", suffix: "+", label: "African partner countries" },
  { value: "8", suffix: "+", label: "Active research projects" },
  { value: "Top 10", suffix: "", label: "Of 46 ACE centres continent-wide" },
];

export const programmeTiers = [
  {
    title: "PhD Programmes",
    href: "/academics/phd",
    blurb:
      "Four-year doctoral training combining a year of structured coursework with original research in sustainable energy, environmental engineering, and energy policy.",
  },
  {
    title: "MSc Programmes",
    href: "/academics/msc",
    blurb:
      "Two-year master's degrees integrating taught modules and supervised research, preparing graduates for leadership in energy and environmental sectors.",
  },
  {
    title: "Professional Short Courses",
    href: "/academics/short-courses",
    blurb:
      "Certified, industry-aligned courses in solar PV, energy efficiency, energy audit, wind power and cookstove technology for working professionals.",
  },
];

export const researchThemes = [
  {
    title: "Energy Transition",
    summary:
      "Pathways from fossil fuels to renewable and cleaner sources, supporting Africa's progress toward net-zero emissions.",
  },
  {
    title: "Energy Storage",
    summary:
      "Materials, systems and policy frameworks for storing electrical energy — a linchpin of the global renewable transition.",
  },
  {
    title: "Energy–Environment Nexus",
    summary:
      "The environmental consequences of energy consumption and their social, economic and ecological effects on African communities.",
  },
  {
    title: "Sustainable Development",
    summary:
      "Energy as a driver of societal development, managed within the ecological limits of the continent's landscapes.",
  },
];

export const phdProgrammes = [
  {
    title: "PhD Sustainable Energy Engineering and Management (SEEM)",
    duration: "3 years",
    structure: "1 year coursework, 2 years research",
    department: "Department of Energy and Petroleum Engineering, School of Engineering",
    summary:
      "Produces graduates with rigorous research and analytical skills in sustainable energy systems, policy design and engineering management.",
  },
  {
    title: "PhD Environmental Engineering and Management (EEMA)",
    duration: "3 years",
    structure: "1 year coursework, 2 years research",
    department: "School of Engineering",
    summary:
      "Advanced doctoral training in environmental systems, pollution control, and integrated resource management for African contexts.",
  },
  {
    title: "PhD Energy Policy and Sustainability",
    duration: "3 years",
    structure: "1 year coursework, 2 years research",
    department: "School of Energy",
    summary:
      "Interdisciplinary doctoral research on energy governance, regulation, and the political economy of the African energy transition.",
  },
  {
    title: "PhD Energy Economics",
    duration: "3 years",
    structure: "1 year coursework, 2 years research",
    department: "School of Energy",
    summary:
      "Quantitative research on energy markets, pricing, investment and welfare implications of the continent's energy choices.",
  },
];

export const mscProgrammes = [
  {
    title: "MSc Sustainable Energy Engineering and Management",
    duration: "2 years",
    structure: "1 year taught, 1 year research",
    summary:
      "Trains the next generation of expertise in energy, power and environment — combining technical depth with management practice.",
  },
  {
    title: "MSc Environmental Engineering and Management",
    duration: "2 years",
    structure: "1 year taught, 1 year research",
    summary:
      "Graduate training in environmental engineering, impact assessment, and management of natural resources under climate pressure.",
  },
  {
    title: "MSc Energy Economics",
    duration: "2 years",
    structure: "1 year taught, 1 year research",
    summary:
      "Rigorous grounding in the economics of energy supply, demand, policy instruments and investment decisions.",
  },
  {
    title: "MSc Energy Policy and Sustainability",
    duration: "2 years",
    structure: "1 year taught, 1 year research",
    summary:
      "Builds capacity in energy governance, regulatory design, and sustainable development planning.",
  },
];

export const mphilProgrammes = [
  {
    title: "MPhil Energy Policy and Sustainability",
    duration: "2 years",
    summary: "Research-led master's for candidates pursuing advanced work in energy governance and sustainability policy.",
  },
  {
    title: "MPhil Energy Economics",
    duration: "2 years",
    summary: "Research master's focused on applied and theoretical energy economics for African markets.",
  },
];

export const shortCourses = [
  { title: "Design & Installation of Stand-alone Solar PV", mode: "Classroom + field" },
  { title: "Energy Efficiency Management", mode: "Classroom + industry visits" },
  { title: "Energy Audit", mode: "Classroom + field" },
  { title: "Renewable Energy Market & Business Development", mode: "Classroom" },
  { title: "Wind Power Technology", mode: "Classroom + field" },
  { title: "Improved Cookstove Technology", mode: "Classroom + field" },
  { title: "Small Hydro", mode: "Classroom + field" },
];

export const projects = [
  {
    title: "ACE Impact Project",
    funder: "World Bank",
    status: "Active",
    summary:
      "The flagship Africa Centres of Excellence for Development Impact programme underwrites RCEES's research, training and regional partnerships.",
  },
  {
    title: "EPIC Africa",
    funder: "International consortium",
    status: "Active",
    summary:
      "Research on the water–energy–food nexus in Sub-Saharan Africa, focused on integrated planning for climate-resilient livelihoods.",
  },
  {
    title: "SUSTAINDam",
    funder: "University of Würzburg partnership",
    status: "Active",
    summary:
      "A joint research programme examining the long-term sustainability of the Akosombo Dam and its downstream ecosystems.",
  },
  {
    title: "ProREG",
    funder: "KNUST, TU Berlin, DAAD",
    status: "Active",
    summary:
      "Professional education in renewable energy, training graduate engineers and technicians to industry-ready standards.",
  },
  {
    title: "ELMO",
    funder: "University of Sierra Leone, Imperial College London",
    status: "Active",
    summary:
      "Engineering education capacity building across West Africa, with curriculum development and staff exchanges.",
  },
  {
    title: "ImPreSSion",
    funder: "Erasmus+ consortium",
    status: "Active",
    summary:
      "Digital literacy and curriculum modernization for engineering faculties in Ghana and partner institutions.",
  },
  {
    title: "STREAMING / Horizon Europe",
    funder: "European Commission",
    status: "Active",
    summary:
      "Participation in Horizon Europe research consortia on renewable integration, storage and smart grids.",
  },
  {
    title: "Green People's Energy",
    funder: "University of Oldenburg, German Development Cooperation",
    status: "Active",
    summary:
      "Off-grid and mini-grid research partnership focused on rural electrification and community energy access.",
  },
];

export const partners = [
  { name: "The World Bank", role: "Lead funder, ACE Impact programme" },
  { name: "University of Energy and Natural Resources (UENR)", role: "Host university" },
  { name: "Kwame Nkrumah University of Science and Technology", role: "Ghanaian research partner" },
  { name: "Technische Universität Berlin", role: "ProREG partner" },
  { name: "University of Oldenburg", role: "Green People's Energy partner" },
  { name: "University of Würzburg", role: "SUSTAINDam partner" },
  { name: "AGI Energy Service Centre", role: "German Development Cooperation" },
  { name: "Climate Technology Centre & Network (CTCN)", role: "Technology transfer partner" },
  { name: "Imperial College London", role: "ELMO partner" },
  { name: "University of Sierra Leone", role: "Regional partner" },
  { name: "Kumasi Institute of Technology, Energy and Environment", role: "Research partner" },
  { name: "Brew-Hammond Energy Centre", role: "Research partner" },
  { name: "Koforidua, Sunyani, Kumasi & Tamale Technical Universities", role: "Professional training partners" },
  { name: "University of Applied Forest Sciences, Rottenburg", role: "Biomass research partner" },
];

export const faculty = [
  {
    name: "Rev. Ing. Prof. Eric Antwi Ofosu",
    role: "Centre Leader",
    credentials: "Associate Professor, Civil Engineering",
    photo: "/images/faculty/eric-antwi-ofosu.jpg",
  },
  {
    name: "Prof. Samuel Gyamfi",
    role: "Deputy Centre Leader",
    credentials: "Professor, School of Energy",
    photo: "/images/samuel-gyamfi.png",
  },
  {
    name: "Prof. Amos T. Kabobah",
    role: "Faculty",
    credentials: "Professor, Energy and Environmental Engineering",
    photo: "/images/faculty/amos-kabobah.jpg",
  },
  {
    name: "Prof. Francis Attiogbe",
    role: "Faculty",
    credentials: "Professor, Environmental Engineering",
    photo: "/images/faculty/francis-attiogbe.jpg",
  },
  {
    name: "Prof. Nana Sarfo Derkyi",
    role: "Faculty",
    credentials: "Associate Professor",
    photo: "/images/faculty/nana-sarfo-derkyi.jpg",
  },
  {
    name: "Prof. Daniel Adu",
    role: "Faculty",
    credentials: "Professor",
    photo: "/images/faculty/daniel-adu.png",
  },
  {
    name: "Samuel Fosu Gyasi, PhD",
    role: "Faculty",
    credentials: "Senior Lecturer",
    photo: "/images/faculty/samuel-fosu-gyasi.jpg",
  },
  {
    name: "Ebenezer N. Kumi, PhD",
    role: "Faculty",
    credentials: "Senior Lecturer",
    photo: "/images/faculty/ebenezer-kumi.jpg",
  },
  {
    name: "Ismaila Emahi, PhD",
    role: "Faculty",
    credentials: "Senior Lecturer",
    photo: "/images/faculty/ismaila-emahi.jpg",
  },
  {
    name: "Dr. Emmanuel Amankwah",
    role: "Faculty",
    credentials: "Lecturer",
    photo: "/images/faculty/emmanuel-amankwah.jpg",
  },
  {
    name: "Dr. Martin Domfeh",
    role: "Faculty",
    credentials: "Lecturer",
    photo: "/images/faculty/martin-domfeh.jpg",
  },
  {
    name: "Ing. Dr. Mary Antwi",
    role: "Faculty",
    credentials: "Lecturer",
    photo: "/images/faculty/mary-antwi.webp",
  },
  {
    name: "Mark Amo-Boateng, PhD",
    role: "Faculty",
    credentials: "Senior Lecturer",
    photo: "/images/faculty/mark-amo-boateng.jpg",
  },
  {
    name: "Eric E. Donyina, PhD",
    role: "Faculty",
    credentials: "Lecturer",
    photo: "/images/faculty/eric-donyina.jpg",
  },
  {
    name: "Kamila Kabo-Bah, PhD",
    role: "Faculty",
    credentials: "Lecturer",
    photo: "/images/faculty/kamila-kabo-bah.jpg",
  },
  {
    name: "Diawuo F. Amankwah, PhD",
    role: "Faculty",
    credentials: "Lecturer",
    photo: "/images/faculty/diawuo-amankwah.jpg",
  },
  {
    name: "Prince Antwi-Agyei, PhD",
    role: "Faculty",
    credentials: "Lecturer",
    photo: "/images/prince-antwi-agyei.png",
  },
  {
    name: "David Anaafo, PhD",
    role: "Faculty",
    credentials: "Lecturer",
    photo: null,
  },
  {
    name: "Francis A. Kuranchie, PhD",
    role: "Faculty",
    credentials: "Lecturer",
    photo: null,
  },
  {
    name: "E. Kwesi Nyantakyi, PhD",
    role: "Faculty",
    credentials: "Lecturer",
    photo: null,
  },
  {
    name: "Edward A. Awafo, PhD",
    role: "Faculty",
    credentials: "Lecturer",
    photo: null,
  },
  {
    name: "Kenneth O. Bentum, PhD",
    role: "Faculty",
    credentials: "Lecturer",
    photo: null,
  },
] as const;

type Person = {
  name: string;
  role: string;
  credentials?: string;
  bio?: string;
  photo?: string | null;
};

export const team: {
  management: Person[];
  administrators: Person[];
  industrialBoard: Person[];
  internationalBoard: Person[];
} = {
  management: [
    {
      name: "Prof. Samuel Gyamfi",
      role: "Centre Director",
      photo: "/images/management/samuel-gyamfi-v2.webp",
    },
    {
      name: "Dr. Prince Antwi-Agyei",
      role: "Deputy Director",
      photo: "/images/management/prince-antwi-agyei-v2.webp",
    },
    {
      name: "Mrs. Bernice Kyei Mensah",
      role: "Centre Registrar",
      photo: "/images/management/bernice-kyei-mensah-v2.webp",
    },
    {
      name: "Dr. Felix Amankwah Diawuo",
      role: "Research Coordinator",
      photo: null,
    },
    {
      name: "Ing. Prof. Emmanuel K. Nyantakyi",
      role: "Coordinator for Partnerships, Collaborations & Internships",
      photo: null,
    },
    {
      name: "Dr. Nana O. B. Ackerson",
      role: "Academics Coordinator",
      photo: null,
    },
    {
      name: "Ing. Emmanuel Y. Asuamah",
      role: "Short Courses & Capacity Building Coordinator",
      photo: "/images/management/emmanuel-asuamah.webp",
    },
    {
      name: "Mr. Samuel Akowuah Okyereh",
      role: "Projects Manager",
      photo: "/images/management/samuel-akowuah-okyereh.jpg",
    },
    {
      name: "Mr. Mamud Musah",
      role: "Business Development Coordinator",
      photo: null,
    },
    {
      name: "Dr. Benjamin Batinge",
      role: "Grants & Consultancy Coordinator",
      photo: "/images/management/benjamin-batinge.webp",
    },
    {
      name: "Dr. Gifty Serwaa Mensah",
      role: "Quality Assurance Coordinator",
      photo: "/images/management/gifty-serwaa-mensah.webp",
    },
  ],
  administrators: [
    {
      name: "Mrs. Bernice Kyei Mensah",
      role: "Centre Registrar",
      photo: "/images/management/bernice-kyei-mensah-v2.webp",
    },
    {
      name: "Mrs. Stephanie Aidoo",
      role: "Principal Administrative Assistant",
      photo: "/images/management/stephanie-aidoo-v2.webp",
    },
    {
      name: "Ruth Agyei Addo",
      role: "Administrative Assistant",
      photo: null,
    },
    {
      name: "Vera Yeboah",
      role: "Administrative Assistant (Facility Manager)",
      photo: null,
    },
    {
      name: "Stephen Adjei",
      role: "Media & Communications Coordinator",
      photo: null,
    },
    {
      name: "Mr. Stephen Yaw Ntiamoah",
      role: "Finance Specialist",
      photo: null,
    },
  ],
  industrialBoard: [
    {
      name: "Seth Agbeve Mahu",
      role: "Deputy Director, Renewable Energy",
      credentials: "Ministry of Energy, Ghana",
      photo: "/images/boards/seth-mahu.jpg",
    },
    {
      name: "Ebenezer Appah-Sampong",
      role: "Deputy Director",
      credentials: "Environmental Protection Agency, Ghana",
      photo: "/images/boards/ebenezer-appah-sampong.jpg",
    },
    {
      name: "Kwabena Agyei Agyapong",
      role: "Ag. Executive Director",
      credentials: "Ghana Institute of Engineering",
      photo: "/images/boards/kwabena-agyapong.jpg",
    },
    {
      name: "Anthony Boye Osafo-Kissi",
      role: "Director of Projects and Engineering",
      credentials: "Bui Power Authority, Ghana",
      photo: null,
    },
    {
      name: "Ben Yaw Ampomah",
      role: "Executive Secretary",
      credentials: "Water Resource Commission, Ghana",
      photo: "/images/boards/ben-ampomah.jpg",
    },
    {
      name: "Maxmillian Kwarteng",
      role: "Ag. Managing Director",
      credentials: "Strategic Power Solutions, Ghana",
      photo: "/images/boards/maxmillian-kwarteng.jpg",
    },
    {
      name: "Benjamin Ntsin",
      role: "Head of Competence Centre, Energy and Environment",
      credentials: "Delegation of German Industry and Commerce in Ghana",
      photo: "/images/boards/benjamin-ntsin.jpg",
    },
  ],
  internationalBoard: [
    {
      name: "Prof. Kodjo Agbossou",
      role: "International Scientific Advisor",
      credentials: "Université du Québec à Trois-Rivières, Canada",
      photo: "/images/boards/kodjo-agbossou.jpg",
    },
    {
      name: "Prof. Kondo H. Adjallah",
      role: "International Scientific Advisor",
      credentials:
        "Ecole Nationale d'Ingénieurs de Metz, Lorraine INP / University of Lorraine, France",
      photo: null,
    },
    {
      name: "Prof. Chris Gordon",
      role: "International Scientific Advisor",
      credentials:
        "Institute of Environment and Sanitation Studies, University of Ghana",
      photo: null,
    },
    {
      name: "Dr. Ijaz Rauf",
      role: "International Scientific Advisor",
      credentials: "York University, Department of Physics and Astronomy, Canada",
      photo: "/images/boards/ijaz-rauf.jpg",
    },
    {
      name: "Prof. Bob Andoh",
      role: "International Scientific Advisor",
      credentials: "Hydro International, United Kingdom",
      photo: "/images/boards/bob-andoh.jpg",
    },
    {
      name: "Prof. Susan Krumdieck",
      role: "International Scientific Advisor",
      credentials: "University of Canterbury, New Zealand",
      photo: "/images/boards/susan-krumdieck.jpg",
    },
    {
      name: "Prof. Mrs. Esi Awuah",
      role: "International Scientific Advisor",
      credentials:
        "Kwame Nkrumah University of Science and Technology (KNUST), Ghana",
      photo: null,
    },
  ],
};

export const newsItems = [
  {
    date: "2026-03-18",
    title: "RCEES recognised among top ten performing ACE Impact centres",
    excerpt:
      "The World Bank's ACE@10 review places RCEES in the top decile of the 46-strong Africa Centres of Excellence network for research output, student throughput and regional impact.",
    image: images.news1,
  },
  {
    date: "2026-02-02",
    title: "SUSTAINDam field season opens on the Akosombo reservoir",
    excerpt:
      "RCEES and the University of Würzburg have begun the 2026 field campaign, collecting sediment, water-quality and biodiversity data across the upper reservoir.",
    image: images.news2,
  },
  {
    date: "2026-01-14",
    title: "Call for scholarship applications — 2026 PhD and MSc intake",
    excerpt:
      "Fully funded places are available across RCEES's doctoral and master's programmes in sustainable energy engineering, environmental engineering, energy economics and policy.",
    image: images.news3,
  },
];

export const facilities = [
  {
    title: "Solar Energy Systems Laboratory",
    summary:
      "Instrumented rigs for stand-alone and grid-connected PV, hybrid systems and balance-of-system performance testing.",
    image: images.facilityA,
  },
  {
    title: "Biomass Research Laboratory",
    summary:
      "Thermochemical conversion, cookstove performance and biomass-resource characterisation for West African feedstocks.",
    image: images.facilityB,
  },
  {
    title: "Climate and Environmental Data Centre",
    summary:
      "A regional hub for climate, hydrological and environmental datasets supporting doctoral and policy-facing research.",
    image: images.facilityC,
  },
  {
    title: "Postgraduate Research Commons",
    summary:
      "Dedicated study, computing and seminar spaces for doctoral and master's students across the Centre's programmes.",
    image: images.facilityD,
  },
];

export const milestones = [
  { year: "2019", title: "RCEES established at UENR", body: "Selected by the World Bank as an Africa Centre of Excellence for Development Impact." },
  { year: "2020", title: "Postgraduate intake begins", body: "First cohorts of MSc and PhD students enrol across the Centre's programmes." },
  { year: "2021", title: "Ultramodern Centre building groundbreaking", body: "Construction begins on RCEES's dedicated research and teaching facility." },
  { year: "2023", title: "International accreditation", body: "Programme accreditation secured from continental and international quality assurance bodies." },
  { year: "2024", title: "ProREG professional training launched", body: "Industry-aligned renewable energy training rolls out with KNUST and TU Berlin." },
  { year: "2025", title: "ACE@10 top-ten recognition", body: "RCEES placed among the ten highest-performing ACE Impact centres on the continent." },
];
