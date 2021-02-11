export interface ActivityListItem {
  id: string;
  name: string;
  location: string;
  open: number;
  close: number;
}

export interface ActivityItem {
  id: string;
  name: string;
  description?: string;
  location: string;
  open: number;
  close: number;
}
