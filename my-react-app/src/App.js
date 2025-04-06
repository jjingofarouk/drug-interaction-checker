import logo from './logo.svg'; // Optional, kept from your original
import DrugInteractionChecker from './components/DrugInteractionChecker';
import Navbars from './components/Navbar'; // Import the navbar
import Footer from './components/Footer'; // Import the footer
import 'bootstrap/dist/css/bootstrap.min.css'; // For navbar styling

function App() {
  return (
    <div className="App">
      <Navbars /> {/* Navbar at the top */}
      <DrugInteractionChecker /> {/* Main content */}
      <Footer /> {/* Footer at the bottom */}
    </div>
  );
}

export default App;