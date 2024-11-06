import React, { useState } from 'react'

const Header = () => {
    // Définir un état pour suivre si l'icône est celle de base ou celle au clic
    const [isClicked, setIsClicked] = useState(false);

    // Fonction pour changer l'icône quand on clique sur le bouton
    const toggleIcon = () => {
        setIsClicked(prevState => !prevState);
    };

    return (
        <div className='relative shadow-xl shadow-black-500 h-16 flex items-center justify-center mb-8'>
            <h1 className='absolute text-xl font-bold'>Mosquito stats</h1>

            <button className='absolute left-16' onClick={toggleIcon}>
                {isClicked ? (
                    // SVG affiché après clic
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_i_91_143)">
                            <path d="M2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9035 2.5 27.5 8.09644 27.5 15C27.5 21.9035 21.9035 27.5 15 27.5C8.09644 27.5 2.5 21.9035 2.5 15ZM13.5695 10.1937C12.5281 9.61693 11.25 10.3701 11.25 11.5606V18.4395C11.25 19.63 12.5281 20.3831 13.5695 19.8064L20.7668 15.8201C21.065 15.655 21.25 15.3409 21.25 15C21.25 14.6591 21.065 14.3451 20.7668 14.1799L13.5695 10.1937Z" fill="#72D870" />
                        </g>
                        <defs>
                            <filter id="filter0_i_91_143" x="0" y="0" width="32" height="32" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="2" dy="2" />
                                <feGaussianBlur stdDeviation="2.5" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_91_143" />
                            </filter>
                        </defs>
                    </svg>
                ) : (
                    // SVG de base avant clic
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_i_91_145)">
                            <path d="M2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9035 2.5 27.5 8.09644 27.5 15C27.5 21.9035 21.9035 27.5 15 27.5C8.09644 27.5 2.5 21.9035 2.5 15ZM13.5695 10.1937C12.5281 9.61693 11.25 10.3701 11.25 11.5606V18.4395C11.25 19.63 12.5281 20.3831 13.5695 19.8064L20.7668 15.8201C21.065 15.655 21.25 15.3409 21.25 15C21.25 14.6591 21.065 14.3451 20.7668 14.1799L13.5695 10.1937Z" fill="#E66462" />
                        </g>
                        <defs>
                            <filter id="filter0_i_91_145" x="0" y="0" width="32" height="32" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                <feOffset dx="2" dy="2" />
                                <feGaussianBlur stdDeviation="2.5" />
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_91_145" />
                            </filter>
                        </defs>
                    </svg>
                )}
            </button>
        </div>
    )
}

export default Header;
