// Sample events data
export const events = [
  {
    id: '1',
    title: 'Community Town Hall',
    description: 'Join us for a community town hall to discuss local issues and how we can make a difference together.',
    date: new Date('2025-04-15'),
    startTime: '18:00',
    endTime: '20:00',
    location: 'Washington DC Community Center',
    locationType: 'in-person',
    organizer: 'Voices Ignited DC Chapter',
    type: 'meeting',
    imageUrl: '../images/town-hall.jpg'
  },
  {
    id: '2',
    title: 'Voter Registration Drive',
    description: 'Help us register voters in preparation for the upcoming elections. Training will be provided for volunteers.',
    date: new Date('2025-04-22'),
    startTime: '10:00',
    endTime: '16:00',
    location: 'Lincoln Park, Washington DC',
    locationType: 'in-person',
    organizer: 'Voices Ignited Voter Initiative',
    type: 'workshop',
    imageUrl: '../images/voter-registration.jpg'
  },
  {
    id: '3',
    title: 'Digital Activism Workshop',
    description: 'Learn effective strategies for digital activism and how to amplify your voice online.',
    date: new Date('2025-05-05'),
    startTime: '19:00',
    endTime: '21:00',
    location: 'Zoom',
    locationType: 'online',
    organizer: 'Voices Ignited Media Team',
    type: 'workshop',
    imageUrl: '../images/digital-activism.jpg'
  },
  {
    id: '4',
    title: 'Rally for Healthcare Reform',
    description: 'Join us as we rally for comprehensive healthcare reform and advocate for healthcare as a human right.',
    date: new Date('2025-05-20'),
    startTime: '12:00',
    endTime: '15:00',
    location: 'Capitol Building, Washington DC',
    locationType: 'in-person',
    organizer: 'Voices Ignited Healthcare Coalition',
    type: 'protest',
    imageUrl: '../images/healthcare-rally.jpg'
  },
  {
    id: '5',
    title: 'Community Mutual Aid Distribution',
    description: 'Help distribute food, clothing, and supplies to community members in need.',
    date: new Date('2025-06-01'),
    startTime: '09:00',
    endTime: '14:00',
    location: 'East Side Community Center',
    locationType: 'in-person',
    organizer: 'Voices Ignited Mutual Aid Network',
    type: 'meeting',
    imageUrl: '../images/mutual-aid.jpg'
  }
];

// Function to add a new event
export const addEvent = async (event) => {
  // In a real application, this would make an API call to add the event to a database
  console.log('Adding event:', event);
  return true;
};
