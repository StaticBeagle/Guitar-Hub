import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout";
import { Typography } from "@material-ui/core";

import { Outlet, Link } from "react-router-dom";
import Home from "./home";
import Users from "./users";


export const App = ({ }) => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<Users />} />
            </Routes>
        </>
    )

};

// const Layout = () => {
//     return (
//       <>
//         <nav>
//           <ul>
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//             <li>
//               <Link to="/blogs">Blogs</Link>
//             </li>
//             <li>
//               <Link to="/contact">Contact</Link>
//             </li>
//           </ul>
//         </nav>

//         <Outlet />
//       </>
//     )
//   };