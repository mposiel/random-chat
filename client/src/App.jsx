import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Chat } from "./components/Chat";
import { Home } from "./components/Home";
import { useState, useContext } from "react";
import { LanguageContext } from "./components/contexts/languageContext.jsx";


function App() {
  const [isActive, setIsActive] = useState(false);
  const [language, setLanguage] = useState("eng");

  const updateActiveState = (newState) => {
    setIsActive(newState);
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route index element={<Home updateActiveState={updateActiveState} />} />
        <Route
          path="/chat"
          element={isActive ? <Chat /> : <Navigate replace to="/" />}
        />
      </Route>
    )
  );

  return (
    <div className="App">
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <RouterProvider router={router} />
      </LanguageContext.Provider>
    </div>
  );
}

const Root = () => {
  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default App;
