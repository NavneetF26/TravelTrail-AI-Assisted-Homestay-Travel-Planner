import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Rooms from "./pages/Rooms";
import Contact from "./pages/Contact";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="bg-sky-50 min-h-screen flex flex-col">
      {" "}
      <Navbar />{" "}
      <div className="flex-1">
        {" "}
        <Routes>
          {" "}
          <Route path="/" element={<Home />} />{" "}
          <Route path="/about" element={<About />} />{" "}
          <Route path="/rooms" element={<Rooms />} />{" "}
          <Route path="/contact" element={<Contact />} />{" "}
        </Routes>{" "}
      </div>{" "}
      <Footer />{" "}
    </div>
  );
}
export default App;
