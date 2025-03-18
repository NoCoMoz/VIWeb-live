export interface EventType {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  locationType: 'in-person' | 'online';
  organizer?: string;
  type?: string;
  imageUrl?: string;
}
