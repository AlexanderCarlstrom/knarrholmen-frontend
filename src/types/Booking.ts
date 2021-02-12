import { ActivityItem } from './ActivityItem';

export interface Booking {
  id: string;
  start: string;
  end: string;
  activity: ActivityItem;
}
