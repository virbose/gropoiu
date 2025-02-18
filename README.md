# Gropoiu

A web application for reporting and tracking potholes in your area. Built with React and Firebase.

## Features

- 📍 Interactive map for precise pothole location
- 🌍 Automatic address lookup from coordinates
- 📱 Responsive design with mobile-friendly interface
- 🌐 Bilingual support (English/Romanian)
- 📊 View all reported potholes on a map
- 📝 Detailed reporting with severity levels
- 📍 Current location detection
- 🗺️ Custom map controls

## Tech Stack

- React
- Firebase Realtime Database
- Leaflet Maps
- React Router
- Environment Variables for configuration

## Getting Started

### Prerequisites

- Node.js
- npm
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/gropoiu.git
cd gropoiu
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your Firebase configuration.

5. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## Environment Variables

Required environment variables:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Project Structure

```
src/
├── components/         # React components
├── contexts/          # Context providers
├── firebase.js        # Firebase configuration
├── translations.js    # Language translations
└── App.js            # Main application component
```

## Features in Detail

### Report Creation
- Select location on map
- Automatic address lookup
- Severity selection
- Description
- Email for contact

### Report Viewing
- Interactive map with all reports
- List view with details
- Severity indicators
- Status tracking

### UI/UX
- Responsive sidebar navigation
- Mobile-friendly design
- Bilingual interface
- Location-based features

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
