export interface Artwork {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: "available" | "sold";
  category: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

export interface PurchaseRequest {
  id: string;
  artworkId: string;
  artworkTitle: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  consentGiven: boolean;
  status: "pending" | "contacted" | "completed" | "closed_sold";
  createdAt: string;
}

export interface SoldOutRequest {
  id: string;
  artworkId: string;
  artworkTitle: string;
  name: string;
  email: string;
  consentGiven: boolean;
  status: "pending" | "contacted" | "completed";
  createdAt: string;
}

export interface CustomRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  budget: string;
  consentGiven: boolean;
  status: "pending" | "contacted" | "completed";
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  address: string;
  consentGiven: boolean;
  status: "pending" | "read" | "replied";
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  approved: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  lastDocId: string | null;
  hasMore: boolean;
}

/** Data for creating/updating an artwork from the admin dashboard. */
export interface ArtworkInput {
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  status: "available" | "sold";
  featured: boolean;
  order: number;
}
