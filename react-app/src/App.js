import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import RepositoryList from "./components/RepositoryList";
import Statistics from "./components/Statistics";
import About from "./components/About";
import Contact from "./components/Contact";
import Request from "./components/Request";
import Repository from "./components/Repository";

// const getInitialState = () => {
//     const storedData = sessionStorage.getItem('isToggleOpen');
//     console.log(storedData);
//     if (!storedData) return false;
//     console.log(storedData === 'true');
//     return storedData === 'true';
// }
function App() {
    // const [isOpen, setIsOpen] = useState(getInitialState);
    //
    // const ToggleSidebar = () => {
    //     sessionStorage.setItem('isToggleOpen', isOpen === true ? 'false' : 'true');
    //     console.log(sessionStorage.getItem('isToggleOpen'));
    //     isOpen === true ? setIsOpen(false) : setIsOpen(true);
    // }
    return (
        <div className="wrapper">
            {/* MainHeader */}
            <Header />
            {/* Sidebar */}
            <SideBar />
            {/* Content Wrapper */}
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />}  />
                    <Route path="/repositories" element={<RepositoryList />}  />
                    <Route path="/statistics" element={<Statistics />}  />
                    <Route path="/about" element={<About />}  />
                    <Route path="/contact" element={<Contact />}  />
                    <Route path="/request" element={<Request />}  />
                    <Route path="/:user/:repo_name" element={<Repository />} />
                </Routes>
            </Router>
            <Footer/>
        </div>
    );
}
export default App;
