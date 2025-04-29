
import { BookProps } from '@/components/BookItem';

// Mock data for books
export const mockBooks: BookProps[] = [
  {
    id: '1',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71FxgtFKcQL.jpg',
    distance: 0.8,
    condition: 'Good',
    carbonSaving: 2.3
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg',
    distance: 1.2,
    condition: 'Like New',
    carbonSaving: 2.8
  },
  {
    id: '3',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71FTb9X6wsL.jpg',
    distance: 0.3,
    condition: 'Fair',
    carbonSaving: 1.9
  },
  {
    id: '4',
    title: 'Brave New World',
    author: 'Aldous Huxley',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81zE42gT3xL.jpg',
    distance: 2.5,
    condition: 'Well Used',
    carbonSaving: 1.7
  },
  {
    id: '5',
    title: 'Lord of the Flies',
    author: 'William Golding',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81WUAoL-wFL.jpg',
    distance: 0.5,
    condition: 'Good',
    carbonSaving: 2.2
  },
  {
    id: '6',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81OthjkJBuL.jpg',
    distance: 1.7,
    condition: 'Like New',
    carbonSaving: 2.6
  }
];

// User impact data
export const userImpact = {
  totalSaved: 22.4,
  swapCount: 8,
  level: 2,
  points: 145
};

// Achievements data
export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  progress?: number;
}

export const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Swap',
    description: 'Complete your first book swap',
    iconName: 'Book',
    unlocked: true
  },
  {
    id: '2',
    title: 'Carbon Saver',
    description: 'Save 10kg of carbon dioxide',
    iconName: 'Leaf',
    unlocked: true
  },
  {
    id: '3',
    title: 'Book Worm',
    description: 'Swap 10 books',
    iconName: 'BookOpenText',
    unlocked: false,
    progress: 80
  },
  {
    id: '4',
    title: 'Local Hero',
    description: 'Complete swaps with 5 different people',
    iconName: 'Users',
    unlocked: false,
    progress: 60
  },
  {
    id: '5',
    title: 'Tree Planter',
    description: 'Save equivalent of planting 5 trees',
    iconName: 'TreePine',
    unlocked: false,
    progress: 40
  }
];
