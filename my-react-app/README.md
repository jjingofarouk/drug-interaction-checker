# Drug Interaction Checker

A **React-based web application** that allows users to check for potential drug interactions. Users can search for two medications and view known interactions or related suggestions.

## Live Demo
Check out the live demo of the app here:  
👉 [Live Demo](https://drug-interaction-checker-ph3r.vercel.app/)

## Screenshots

### Home Screen
![Home Screen](https://github.com/jjingofarouk/drug-interaction-checker/raw/main/images/home.jpeg)
*Initial view of the Drug Interaction Checker*

### Search Interface
![Search Interface](https://github.com/jjingofarouk/drug-interaction-checker/raw/main/images/searches.jpeg)
*Medication search with autocomplete suggestions*

### Interaction Results
![Interaction Results](https://github.com/jjingofarouk/drug-interaction-checker/raw/main/images/results.JPG)
*Detailed view of drug interaction results*



## Features

### Core Functionality
- **Advanced Search System**: 
  - Real-time medication search with autocomplete
  - Comprehensive drug database integration
  - Smart suggestion algorithm for medication names

- **Interaction Analysis**:
  - Detailed drug interaction checking
  - Severity level indicators
  - Comprehensive interaction descriptions
  - Alternative medication suggestions

- **User Interface**:
  - Clean and intuitive design
  - Mobile-responsive layout
  - Accessible to all users
  - Real-time search results

### Technical Features
- **Performance**:
  - Fast search response times
  - Optimized database queries
  - Efficient client-side caching
  - Minimal load times

- **Security**:
  - Secure data handling
  - Privacy-focused design
  - No personal data storage
  - HTTPS encryption

## Installation

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Git

### Setup Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jjingofarouk/drug-interaction-checker.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd drug-interaction-checker
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open the app**:
   Visit `http://localhost:3000` in your browser to view the app.

### Environment Setup
Make sure you have the following environment variables set up in your `.env` file:
```env
REACT_APP_API_URL=your_api_url
REACT_APP_ENV=development
```

## Technologies Used

### Frontend
- **React 18**: Core framework for building the user interface
- **CSS3**: Custom styling and animations
- **Modern JavaScript (ES6+)**: Enhanced functionality and features
- **React Hooks**: State management and component lifecycle
- **Context API**: Global state management

### Development Tools
- **Git**: Version control system
- **npm**: Package management
- **ESLint**: Code quality maintenance
- **Prettier**: Code formatting
- **React Developer Tools**: Debugging and optimization

### Data Management
- **JSON**: Drug database storage
- **Local Storage**: Client-side data persistence
- **Custom APIs**: Data fetching and manipulation

## Project Structure
```
drug-interaction-checker/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── DrugInteractionChecker/
│   │   ├── InteractionCard/
│   │   ├── SuggestionCard/
│   │   └── Footer/
│   ├── data/
│   │   ├── drugOptions.json
│   │   └── drugInteractions.json
│   ├── styles/
│   │   └── main.css
│   ├── utils/
│   │   └── helpers.js
│   ├── App.js
│   └── index.js
├── package.json
├── README.md
└── LICENSE
```

## How It Works

### Search Functionality
1. **Input**: Users enter medication names in two separate search fields
2. **Autocomplete**: System provides real-time suggestions based on input
3. **Selection**: Users select medications from the suggestion list

### Interaction Check
1. **Analysis**: System checks for known interactions between selected medications
2. **Results Display**: 
   - Shows detailed interaction information if found
   - Provides alternative suggestions if no direct interaction exists
3. **Additional Information**: Displays severity levels and recommendations

### Data Processing
1. **Data Fetching**: Retrieves information from local JSON database
2. **Processing**: Analyzes drug combinations for potential interactions
3. **Output**: Generates user-friendly interaction reports

## Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

### Contributing Guidelines
- Write clear, descriptive commit messages
- Update documentation as needed
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

### Resources
- React Documentation
- MDN Web Docs
- Drug Interaction APIs
- Open Source Community

### Special Thanks
- Contributors and reviewers
- Beta testers
- Open source community members

## Contact

### Developer
- **Name**: Jjingo Farouk
- **Email**: jjingofarouq@gmail.com
- **GitHub**: [@jjingofarouk](https://github.com/jjingofarouk)

### Support
For support, please:
1. Check existing issues on GitHub
2. Open a new issue if needed
3. Email for urgent matters

---

Enjoy using the **Drug Interaction Checker**! 🚀
