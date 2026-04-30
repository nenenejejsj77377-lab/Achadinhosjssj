export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  affiliateLink: string;
  imageUrl?: string;
  isNew?: boolean;
  dateAdded: number;
}

export type Category = 'Todos' | 'Casa' | 'Tech' | 'Moda' | 'Beleza' | 'Cozinha';
