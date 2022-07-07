import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout";
import { Typography } from "@material-ui/core";

import { Outlet, Link } from "react-router-dom";
import Home from "./home";
import Users from "./users";
import Admins from "./admins"


export const App = ({ }) => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<Users />} />
                <Route path="/admins" element={<Admins />} />
            </Routes>
        </>
    )

};