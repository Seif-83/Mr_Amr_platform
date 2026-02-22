
import { PrepData } from './types';

export const VALID_ACCESS_CODES = [
  '123',
  'safaa2025',
  'science-is-fun',
  'prep-master',
  'student-access-77'
];

export const PREP_LEVELS_DATA: PrepData[] = [
  {
    id: '1st-prep',
    title: '1st Prep',
    titleAr: 'الصف الأول الإعدادي',
    image: 'sections/1st_prep.jpeg',
    description: 'Explore the basics of matter, energy, and living organisms.',
    lessons: []
  },
  {
    id: '2nd-prep',
    title: '2nd Prep',
    titleAr: 'الصف الثاني الإعدادي',
    image: 'sections/2nd_prep.jpeg',
    description: 'Dive deep into periodic tables, waves, and sound mechanics.',
    lessons: []
  },
  {
    id: '3rd-prep',
    title: '3rd Prep',
    titleAr: 'الصف الثالث الإعدادي',
    image: 'sections/3rd_prep.jpeg',
    description: 'Master physics, genetics, and the wonders of the universe.',
    lessons: []
  }
];
