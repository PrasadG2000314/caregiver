export const MALAYSIAN_STATES = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Penang',
  'Perak',
  'Perlis',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
  'Kuala Lumpur',
  'Labuan',
  'Putrajaya',
] as const;

export const MALAYSIAN_CITIES: Record<string, string[]> = {
  'Selangor': ['Petaling Jaya', 'Subang Jaya', 'Shah Alam', 'Klang', 'Ampang', 'Kajang', 'Rawang', 'Sepang'],
  'Kuala Lumpur': ['Kuala Lumpur Central', 'Cheras', 'Bukit Bintang', 'Mont Kiara', 'Bangsar', 'Setapak', 'Kepong'],
  'Penang': ['Georgetown', 'Bayan Lepas', 'Butterworth', 'Bukit Mertajam', 'Batu Ferringhi'],
  'Johor': ['Johor Bahru', 'Iskandar Puteri', 'Batu Pahat', 'Muar', 'Kulai', 'Kluang'],
  'Perak': ['Ipoh', 'Taiping', 'Teluk Intan', 'Manjung'],
  'Melaka': ['Melaka City', 'Ayer Keroh', 'Alor Gajah', 'Jasin'],
  'Negeri Sembilan': ['Seremban', 'Port Dickson', 'Nilai'],
  'Kedah': ['Alor Setar', 'Sungai Petani', 'Kulim', 'Langkawi'],
  'Pahang': ['Kuantan', 'Temerloh', 'Bentong'],
  'Kelantan': ['Kota Bharu', 'Pasir Mas'],
  'Terengganu': ['Kuala Terengganu', 'Chukai'],
  'Sabah': ['Kota Kinabalu', 'Sandakan', 'Tawau'],
  'Sarawak': ['Kuching', 'Miri', 'Sibu', 'Bintulu'],
  'Putrajaya': ['Precinct 1-20'],
  'Labuan': ['Victoria'],
  'Perlis': ['Kangar', 'Arau'],
};

export const CAREGIVER_SKILLS = [
  'Palliative Care',
  'Wound Care & Dressing',
  'Tracheostomy Care',
  'Vital Signs Monitoring',
  'Dementia & Alzheimer\'s Care',
  'Medication Administration',
  'Post-Stroke Rehabilitation',
  'Physical Mobility Assistance',
  'Bed-to-Chair Transfers',
  'Feeding Tube (NGT/PEG) Care',
  'Catheter Care',
  'Elderly Companion & Respite',
  'Meal Preparation & Nutrition',
  'Bedside Nursing',
  'Post-Operative Recovery',
  'Pediatric & Special Needs Care',
] as const;

export const LANGUAGES = [
  'Bahasa Melayu',
  'English',
  'Mandarin',
  'Cantonese',
  'Hokkien',
  'Tamil',
] as const;

export const WORK_ELIGIBILITY_OPTIONS = [
  'Malaysian Citizen (MyKad)',
  'Permanent Resident (MyPR)',
  'Valid Work Permit / Visa',
] as const;

