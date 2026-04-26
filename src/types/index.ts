export type Category = "jobs" | "realestate" | "market" | "drink" | "promo" | "food";

export interface Post {
  id: string;
  userId: string;
  category: Category;
  title: string;
  content: string;
  images: string[];
  video?: string;
  phone?: string;
  lat: number;
  lng: number;
  address: string;
  likes: number;
  dislikes: number;
  createdAt: number;
  updatedAt?: number;
  isEdited?: boolean;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  message: string;
  type: "text" | "image" | "voice";
  createdAt: number;
}

export interface ChatRoom {
  id: string;
  userA: string;
  userB: string;
  lastMessage?: string;
  updatedAt: number;
}

export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  type: "like" | "dislike";
  createdAt: number;
}

export interface GroupRoom {
  id: string;
  title: string;
  creatorId: string;
  maxParticipants: number;
  participants: { userId: string; nickname: string }[];
  createdAt: number;
}
