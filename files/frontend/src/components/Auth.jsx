import React, { useState } from "react";
import styled from "styled-components";
import cities from "../utils/cities";
import api from "../utils/api";

const AuthWrap = styled.div`
  /* stile HOT */
  min-height: 100vh; background: #fff9f0; display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 2rem;
`;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ /* username, email, ... */ });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // Chiamata API login
    } else {
      // Chiamata API register (con check città, bio, etc)
    }
  };

  return (
    <AuthWrap>
      <form onSubmit={handleSubmit}>
        {/* campi login o register dinamici */}
        {/* select città da array cities */}
        {/* select maschio/femmina, select cosa cerco */}
        {/* input bio minLength=5 */}
        {/* checkbox "Resta connesso" */}
        <button type="submit">{isLogin ? "Login" : "Registrati"}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Non hai un account? Registrati" : "Hai già un account? Login"}
      </button>
      {error && <div style={{color:"red"}}>{error}</div>}
    </AuthWrap>
  );
}