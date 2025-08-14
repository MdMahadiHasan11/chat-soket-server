import { Model } from "mongoose";

export interface IBook {
  title: string;
  author: string;
  genre:
    | "FICTION"
    | "NON_FICTION"
    | "SCIENCE"
    | "HISTORY"
    | "BIOGRAPHY"
    | "FANTASY";
  isbn: string;
  description?: string;
  copies: number;
  available?: boolean;
}

export interface IBookDocument extends IBook, Document {
  createdAt?: Date;
  updatedAt?: Date;
  updateAvailability: () => Promise<IBookDocument>; // পুরানো সিগনেচার রাখা হয়েছে
}

// নতুন: ইনস্ট্যান্স মেথডের জন্য ইন্টারফেস
export interface IBookInstanceMethods {
  updateAvailability: () => Promise<IBookDocument>;
}

// নতুন: মডেল টাইপ
export type BookModelType = Model<IBook, object, IBookInstanceMethods>;

export interface IBookQuery {
  filter?: string;
  sortBy?: string;
  sort?: "asc" | "desc";
  limit?: string;
}
