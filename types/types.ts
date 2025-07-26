// Types
export interface User {
    id: string;
    email: string;
    createdAt: string;
  }
  
  export interface Brand {
    id: string;
    name: string;
    description?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    responses?: Response[];
    stats?: {
      totalResponses: number;
      positiveResponses: number;
      negativeResponses: number;
      unratedResponses: number;
    };
  }
  
  export interface Response {
    id: string;
    text: string;
    brandId: string;
    createdAt: string;
    updatedAt: string;
    rating?: Rating;
    brand?: Brand;
  }
  
  export interface Rating {
    id: string;
    value: boolean; // true for 👍, false for 👎
    responseId: string;
    createdAt: string;
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface CreateBrandData {
    name: string;
    description?: string;
  }
