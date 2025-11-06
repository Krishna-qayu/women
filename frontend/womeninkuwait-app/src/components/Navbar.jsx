import React, { useEffect, useState, useRef } from "react";
import "../Nav.css";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

import logo from "../assets/logo1.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isMobileJoinOpen, setIsMobileJoinOpen] = useState(false);
  const navRef = useRef(null);
  const joinDropdownRef = useRef(null);
  // Effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        joinDropdownRef.current &&
        !joinDropdownRef.current.contains(event.target)
      ) {
        setIsJoinOpen(false);
      }
    };
    if (isJoinOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isJoinOpen]);

  const navHeight = navRef.current?.offsetHeight || 80;

  return (
    <>
      <div style={{ height: isSticky ? `${navHeight}px` : "auto" }} />
      <nav ref={navRef} className={isSticky ? "navbar sticky" : "navbar"}>
        <div className="nav-container">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Women in Kuwait Logo" className="logo-img" />
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/gallery">Gallery</Link>
            </li>
            <li>
              <Link to="/about-us">About </Link>
            </li>
            <li className="dropdown-container" ref={joinDropdownRef}>
              <div
                className="nav-link-dropdown"
                onClick={() => setIsJoinOpen(!isJoinOpen)}
              >
                <li>
                  <Link to="/join">Register</Link>
                </li>
                <ChevronDown
                  size={16}
                  className={`chevron-icon ${isJoinOpen ? "open" : ""}`}
                />
              </div>
              {isJoinOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/join">Register</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact</Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link to="/events">Events</Link>
            </li>
          </ul>
          <div className="menu-icon" onClick={() => setIsOpen(true)}>
            <Menu size={26} />
          </div>
        </div>
        {/* Mobile Side Menu */}
        {isOpen && (
          <div
            className="mobile-side-menu-overlay"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="mobile-side-menu"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="side-menu-header">
                <Link to="/" className="logo-link">
                  <img
                    src={logo}
                    alt="Women in Kuwait Logo"
                    className="logo-img"
                  />
                </Link>
                <span className="close-menu" onClick={() => setIsOpen(false)}>
                  <X size={28} />
                </span>
              </div>
              <ul>
                <li>
                  <Link to="/" onClick={() => setIsOpen(false)}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/gallery">Gallery</Link>
                </li>

                <li>
                  <Link to="/about-us" onClick={() => setIsOpen(false)}>
                    About
                  </Link>
                </li>
                <li className="mobile-dropdown-container">
                  <div
                    className="mobile-dropdown-toggle"
                    onClick={() => setIsMobileJoinOpen(!isMobileJoinOpen)}
                  >
                    <span>Register</span>
                    <ChevronDown
                      size={20}
                      className={`chevron-icon ${
                        isMobileJoinOpen ? "open" : ""
                      }`}
                    />
                  </div>
                  {isMobileJoinOpen && (
                    <ul className="mobile-dropdown-menu">
                      <li>
                        <Link to="/join" onClick={() => setIsOpen(false)}>
                          Register
                        </Link>
                      </li>
                      <li>
                        <Link to="/contact" onClick={() => setIsOpen(false)}>
                          Contact
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <Link to="/events" onClick={() => setIsOpen(false)}>
                    Events
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
