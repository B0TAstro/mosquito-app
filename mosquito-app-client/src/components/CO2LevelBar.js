import React from 'react'

const CO2LevelBar = ({ level }) => {
    // Définir les seuils minimum et maximum pour le CO2
    const minCO2 = 620;
    const maxCO2 = 3000;

    // Fonction pour mapper le niveau de CO2 à une position entre 0% et 100%
    const getCursorPosition = (level) => {
        // Si le niveau est inférieur au minimum, place le curseur à 0%
        if (level <= minCO2) return 0;

        // Si le niveau est supérieur au maximum, place le curseur à 100%
        if (level >= maxCO2) return 100;

        // Mapping du niveau de CO2 dans la plage de 0 à 100%
        return ((level - minCO2) / (maxCO2 - minCO2)) * 100;
    };

    const getCO2LevelText = (level) => {
        if (level <= 620) {
            return 'Critical';
        } else if (level <= 1000) {
            return 'Low';
        } else if (level <= 2000) {
            return 'Good';
        } else if (level > 2000){
            return 'Perfect';
        };
    };

    const co2LevelText = getCO2LevelText(level);
    console.log(co2LevelText);

    // Calcul de la position du curseur en pourcentage
    const cursorPosition = `${getCursorPosition(level)}%`;

    return (
        <div className='flex flex-col items-center rounded-3xl p-6 mb-4'
            style={{ boxShadow: '5px 5px 10px 0px #C2C2C2, -5px -5px 10px 0px #FFF' }}>
            <div className='flex justify-between items-center w-full mb-2'>
                <div className='flex items-center'>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.25 1.66667C9.4661 1.66667 7.92025 2.68583 7.1629 4.17365C9.07377 4.26651 10.7432 5.27881 11.7383 6.7776C12.1199 6.70479 12.5139 6.66667 12.9167 6.66667H15.8147C15.827 6.52944 15.8334 6.39046 15.8334 6.25001V2.86743C15.8334 2.20427 15.2958 1.66667 14.6326 1.66667H11.25Z" fill="#313131" />
                        <path d="M7.02156 14.9979C6.97287 14.9993 6.92403 15 6.875 15C4.11357 15 1.875 12.7614 1.875 10V6.26137C1.875 5.56473 2.43973 5 3.13637 5H6.875C8.5135 5 9.968 5.78817 10.8799 7.00605C9.507 7.47905 8.35058 8.41692 7.59866 9.6315L6.27518 8.30806C6.0311 8.06398 5.63538 8.06398 5.3913 8.30806C5.14722 8.55217 5.14722 8.94783 5.3913 9.19192L7.02502 10.8257C6.79297 11.4794 6.66667 12.1833 6.66667 12.9167C6.66667 13.6463 6.79172 14.3468 7.02156 14.9979Z" fill="#313131" />
                        <path d="M7.5 12.9167C7.5 9.92508 9.92508 7.5 12.9167 7.5H17.0113C17.7415 7.5 18.3333 8.09187 18.3333 8.822V12.9167C18.3333 15.9082 15.9082 18.3333 12.9167 18.3333C11.6461 18.3333 10.4777 17.8959 9.55392 17.1634L8.567 18.1502C8.32296 18.3943 7.92723 18.3943 7.68315 18.1502C7.43907 17.9062 7.43907 17.5105 7.68315 17.2664L8.67 16.2795C7.93748 15.3557 7.5 14.1872 7.5 12.9167ZM10.1478 16.5695L13.9837 12.7336C14.2277 12.4895 14.2277 12.0938 13.9837 11.8497C13.7396 11.6057 13.3438 11.6057 13.0997 11.8497L9.26392 15.6856C9.51692 16.0188 9.8145 16.3164 10.1478 16.5695Z" fill="#313131" />
                    </svg>
                    <span className='text-lg font-semibold'>CO2 level</span>
                </div>
                <span className='text-lg font-semibold'>{ co2LevelText }</span>
            </div>

            <div className='relative w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-md'>
                {/* Barre dégradée */}
                <div className='absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-300 to-green-500'></div>

                {/* Curseur ajusté en fonction du niveau */}
                <div
                    className='absolute top-0 h-full w-1 bg-black'
                    style={{ left: cursorPosition }}
                ></div>
            </div>
        </div>
    );
}

export default CO2LevelBar;
