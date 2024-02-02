import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Link,
  Outlet,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Chat } from "./components/Chat";
import { Home } from "./components/Home";
import { useState } from "react";

function App() {
  const [isActive, setIsActive] = useState(false);

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
      <RouterProvider router={router} />
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
