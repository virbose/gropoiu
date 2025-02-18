# Pothole Reporter

A web application that allows citizens to report potholes in their area. Users can easily mark pothole locations on a map, provide details about the severity, and submit reports for maintenance.

## Features

- Interactive map using OpenStreetMap
- Click or tap to place markers
- Drag markers to adjust location
- Automatic address lookup for selected locations
- Severity level selection (Low/Medium/High)
- Detailed description field for additional information
- Mobile-responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd pothole-reporter
```

2. Install dependencies:
```bash
npm install leaflet react-leaflet react-router-dom
```

3. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## Usage

1. Navigate to the "Report Pothole" page
2. Click on the map to place a marker where the pothole is located
3. Drag the marker to adjust its position if needed
4. The address will automatically be detected
5. Fill in the description of the pothole
6. Select the severity level
7. Click "Submit Report" to send the report

## Technologies Used

- React.js
- React Router for navigation
- OpenStreetMap with react-leaflet for mapping
- Nominatim for reverse geocoding (address lookup)

## Future Enhancements

- User authentication
- Photo upload capability
- View all reported potholes on a map
- Status tracking for reported potholes
- Mobile apps for Android and iOS
- Integration with municipal maintenance systems

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
