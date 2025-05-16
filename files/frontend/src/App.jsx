import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Auth from "./components/Auth";
import Home from "./components/Home";
import PaypalPage from "./components/PaypalPage";
import TokensModal from "./components/TokensModal";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/acquista-gettoni" element={<TokensModal />} />
        <Route path="/compra-paypal" element={<PaypalPage />} />
      </Routes>
    </BrowserRouter>
  );
}