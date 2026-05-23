export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  languages: string[];
  licenseNo?: string;
  linkedin?: string;
}

const u = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const team: TeamMember[] = [
  {
    _id: 't1',
    name: 'Hassan Al Mansoori',
    role: 'Founding Partner · CEO',
    bio: 'Built the firm from a DIFC suite into one of the most trusted private brokerages in the UAE. Former private wealth at HSBC.',
    avatar: u('1507003211169-0a1dd7228f2d'),
    languages: ['English', 'Arabic', 'French'],
    licenseNo: 'BRN 10001',
    linkedin: 'https://linkedin.com',
  },
  {
    _id: 't2',
    name: 'Sarah Al Mansour',
    role: 'Senior Advisor · Prime Markets',
    bio: 'Eight years in Dubai prime. Specialises in Palm, Downtown and branded residences for international family offices.',
    avatar: u('1494790108377-be9c29b29330'),
    languages: ['English', 'Arabic'],
    licenseNo: 'BRN 54321',
    linkedin: 'https://linkedin.com',
  },
  {
    _id: 't3',
    name: 'Idris Khan',
    role: 'Director · Investment Sales',
    bio: 'Models every deal on gross yield, capital appreciation and exit horizon. Previously real-estate PE in London and Singapore.',
    avatar: u('1500648767791-00dcc994a43e'),
    languages: ['English', 'Urdu', 'Hindi'],
    licenseNo: 'BRN 67890',
    linkedin: 'https://linkedin.com',
  },
  {
    _id: 't4',
    name: 'Layla Al Hashimi',
    role: 'Advisor · Off-Plan & Branded',
    bio: 'Priority access to nearly every developer launch in Dubai. Built her book sourcing first-look opportunities for HNW clients.',
    avatar: u('1438761681033-6461ffad8d80'),
    languages: ['English', 'Arabic', 'Italian'],
    licenseNo: 'BRN 11223',
    linkedin: 'https://linkedin.com',
  },
  {
    _id: 't5',
    name: 'Marcus Weber',
    role: 'Head of International',
    bio: 'Runs the Zurich and London desks. Helps international investors structure UAE acquisitions for tax and residency outcomes.',
    avatar: u('1472099645785-5658abf4ff4e'),
    languages: ['English', 'German', 'French'],
    licenseNo: 'BRN 33445',
    linkedin: 'https://linkedin.com',
  },
  {
    _id: 't6',
    name: 'Priya Ramakrishnan',
    role: 'Head of Marketing',
    bio: 'Cinematic media, global lead generation and the creative voice behind every developer mandate the firm runs.',
    avatar: u('1573496359142-b8d87734a5a2'),
    languages: ['English', 'Hindi', 'Tamil'],
    linkedin: 'https://linkedin.com',
  },
];

export interface Award {
  year: string;
  title: string;
  issuer: string;
}

export const awards: Award[] = [
  { year: '2025', title: 'Brokerage of the Year', issuer: 'Property Finder Awards' },
  { year: '2024', title: 'Top 5 Luxury Brokerage', issuer: 'Bayut Business Awards' },
  { year: '2024', title: 'Excellence in Service', issuer: 'Dubai Land Department' },
  { year: '2023', title: 'Emaar Top Performer', issuer: 'Emaar Properties' },
  { year: '2023', title: 'Best Off-Plan Sales Team', issuer: 'Damac Partners' },
  { year: '2022', title: 'Most Trusted Brokerage', issuer: "AGBI Reader's Choice" },
];
