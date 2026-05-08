//User sees:

//balance 💰
//buttons (pay, scan, etc.)
import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Hero from "../../components/HeroOnline";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomeOnline = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/users/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading MeshPay... 💸
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
};

export default HomeOnline;
