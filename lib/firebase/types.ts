import { Timestamp } from "firebase/firestore";

export interface BaseEntity {
  id?: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}
