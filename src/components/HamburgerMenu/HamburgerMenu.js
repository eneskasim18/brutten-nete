import React, { useState } from 'react';
import './HamburgerMenu.css';

const HamburgerMenu = ({ onFutureYearClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleFutureYearClick = () => {
        onFutureYearClick();
        setIsOpen(false);
    };

    return (
        <div className="hamburger-menu">
            <button className="hamburger-button" onClick={toggleMenu}>
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
            </button>

            {isOpen && (
                <div className="hamburger-dropdown">
                    <div className="hamburger-item" onClick={handleFutureYearClick}>
                        Gelecek yıllar için hesaplama
                    </div>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu; 