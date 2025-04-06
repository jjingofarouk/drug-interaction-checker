import logo from './logo.svg'; // Keep your existing logo import (optional)
import DrugInteractionChecker from './components/DrugInteractionChecker';
import Navbars from './components/Navbar'; // Import the navbar
import 'bootstrap/dist/css/bootstrap.min.css'; // Required for Bootstrap styling

function App() {
  return (
    <div className="App">
      <Navbars /> {/* Add the navbar here */}
      <DrugInteractionChecker /> {/* Your existing component */}
    </div>
  );
}

export default App;