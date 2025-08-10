import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider,createBrowserRouter } from 'react-router-dom';
import About from "./About.jsx";
import Sell from "./sell.jsx";
import ReactDOM from "react-dom/client";
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />
//   },
//   {
//     path: "/about",
//     element: <About />
//   },
//   {
//     path: "/sell",
//     element: <Sell />
//   },
// ]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   {/* <RouterProvider router={router} /> */}
//   </React.StrictMode>
// );
