import { ActivityListItem, ActivityItem } from './ActivityItem';
import { Booking } from './Booking';
import { User } from './User';

export interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
  errors?: string[];
}

export interface UserResponse extends ApiResponse {
  user: User;
}

export interface ActivitiesResponse extends ApiResponse {
  activities?: ActivityListItem[];
  activity?: ActivityItem;
}

export interface BookingsResponse extends ApiResponse {
  week?: number[][];
  day?: number[];
  bookings?: Booking[];
}
