import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import "./Recap.css";

// Enregistrement des composants nécessaires de Chart.js
Chart.register(...registerables);

const Recap = ({ co2Level, mosquitoCount }) => {
    const chartRef = useRef(null); // Référence au canvas du graphique
    const co2ChartInstance = useRef(null); // Référence à l'instance du graphique
    const [dailyData, setDailyData] = useState([]); // Stocker les données journalières de CO2
    const [weeklyAverages, setWeeklyAverages] = useState([0, 0, 0, 0, 0, 0, 0]); // Moyennes pour les 7 derniers jours (CO2)
    const [currentDay, setCurrentDay] = useState(0); // Indice du jour actuel (0 à 6 pour les 7 jours de la semaine)
    const [timePassed, setTimePassed] = useState(0); // Compteur pour simuler le temps en secondes

    // États pour le comptage des moustiques
    const [mosquitoHour, setMosquitoHour] = useState(0); // Nombre de moustiques dernière heure
    const [mosquitoDay, setMosquitoDay] = useState(0); // Nombre de moustiques dernier jour
    const [mosquitoWeek, setMosquitoWeek] = useState(0); // Nombre de moustiques dernière semaine
    const [mosquitoMonth, setMosquitoMonth] = useState(0); // Nombre de moustiques dernier mois
    const [mosquitoYear, setMosquitoYear] = useState(0); // Nombre de moustiques dernière année
    const [lastMosquitoCount, setLastMosquitoCount] = useState(0); // Dernier nombre de moustiques enregistré

    // Fonction pour incrémenter tous les compteurs à chaque nouvelle réception de moustiques
    const incrementMosquitoCounters = (newMosquitoes) => {
        setMosquitoHour((prev) => prev + newMosquitoes);
        setMosquitoDay((prev) => prev + newMosquitoes);
        setMosquitoWeek((prev) => prev + newMosquitoes);
        setMosquitoMonth((prev) => prev + newMosquitoes);
        setMosquitoYear((prev) => prev + newMosquitoes);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTimePassed((prev) => prev + 1);

            // Réinitialiser les compteurs à leurs intervalles respectifs
            if (timePassed >= 60) { // Réinitialiser chaque heure (60 secondes simulées)
                setMosquitoHour(0);
            }

            if (timePassed >= 60 * 24) { // Réinitialiser chaque jour (1440 secondes simulées)
                setMosquitoDay(0);
            }

            if (timePassed >= 60 * 24 * 7) { // Réinitialiser chaque semaine (10080 secondes simulées)
                setMosquitoWeek(0);
            }

            if (timePassed >= 60 * 24 * 30) { // Réinitialiser chaque mois (43200 secondes simulées)
                setMosquitoMonth(0);
            }

            if (timePassed >= 60 * 24 * 365) { // Réinitialiser chaque année (525600 secondes simulées)
                setMosquitoYear(0);
            }

            // Simuler une journée complète pour le CO2 (chaque 60 secondes = 1 journée)
            if (timePassed >= 60) {
                const dailyAverage = dailyData.reduce((acc, val) => acc + val, 0) / dailyData.length;
                setWeeklyAverages((prevAverages) => {
                    const newAverages = [...prevAverages];
                    newAverages[currentDay] = dailyAverage || 0; // Remplacer la moyenne du jour
                    return newAverages;
                });

                setDailyData([]); // Réinitialiser les données journalières de CO2
                setCurrentDay((prevDay) => (prevDay + 1) % 7); // Passer au jour suivant
                setTimePassed(0); // Réinitialiser le temps pour simuler une nouvelle journée
            }
        }, 1000); // Intervalle de 1 seconde (ajuster selon tes besoins)

        return () => clearInterval(interval);
    }, [timePassed, dailyData, currentDay]);

    // Ajouter les nouvelles données de CO2 à l'état 'dailyData'
    useEffect(() => {
        setDailyData((prevData) => [...prevData, co2Level]);
    }, [co2Level]);

    // Ajouter les nouvelles données de moustiques uniquement lorsque le compteur change
    useEffect(() => {
        if (mosquitoCount !== lastMosquitoCount) {
            const newMosquitoes = mosquitoCount - lastMosquitoCount;
            incrementMosquitoCounters(newMosquitoes); // Incrémenter tous les compteurs
            setLastMosquitoCount(mosquitoCount); // Mettre à jour le dernier nombre de moustiques enregistré
        }
    }, [mosquitoCount, lastMosquitoCount]);

    // Mettre à jour le graphique avec les moyennes hebdomadaires (CO2)
    useEffect(() => {
        const chartCanvas = chartRef.current;

        // Détruire l'instance précédente du graphique avant d'en créer une nouvelle
        if (co2ChartInstance.current) {
            co2ChartInstance.current.destroy();
        }

        // Créer une nouvelle instance de graphique avec les moyennes hebdomadaires
        co2ChartInstance.current = new Chart(chartCanvas, {
            type: "bar",
            data: {
                labels: ["mo", "tu", "we", "th", "fr", "sa", "su"], // Étiquettes des jours
                datasets: [
                    {
                        label: "Average CO2 Level",
                        data: weeklyAverages, // Utiliser les moyennes des 7 jours pour le CO2
                        backgroundColor: "rgba(49, 49, 49, 0.70)",
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                responsive: true,
                plugins: {
                    legend: {
                        display: true, // Afficher la légende
                    },
                },
            },
        });

        // Nettoyage: détruire le graphique à la destruction du composant
        return () => {
            if (co2ChartInstance.current) {
                co2ChartInstance.current.destroy();
            }
        };
    }, [weeklyAverages]); // Mettre à jour le graphique chaque fois que les moyennes changent

    return (
        <div className="recap-container">
            <div className="recap-title">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                >
                    <path
                        d="M3.54166 3.33333C2.50612 3.33333 1.66666 4.17279 1.66666 5.20833V7.29166C1.66666 8.32719 2.50612 9.16666 3.54166 9.16666H5.62499C6.66052 9.16666 7.49999 8.32719 7.49999 7.29166V5.20833C7.49999 4.17279 6.66052 3.33333 5.62499 3.33333H3.54166ZM9.37499 4.16666C9.02982 4.16666 8.74999 4.44649 8.74999 4.79166C8.74999 5.13684 9.02982 5.41666 9.37499 5.41666H17.7083C18.0535 5.41666 18.3333 5.13684 18.3333 4.79166C18.3333 4.44649 18.0535 4.16666 17.7083 4.16666H9.37499ZM9.37499 6.66666C9.02982 6.66666 8.74999 6.94649 8.74999 7.29166C8.74999 7.63684 9.02982 7.91666 9.37499 7.91666H15.2083C15.5535 7.91666 15.8333 7.63684 15.8333 7.29166C15.8333 6.94649 15.5535 6.66666 15.2083 6.66666H9.37499ZM3.54166 10.8333C2.50612 10.8333 1.66666 11.6728 1.66666 12.7083V14.7917C1.66666 15.8272 2.50612 16.6667 3.54166 16.6667H5.62499C6.66052 16.6667 7.49999 15.8272 7.49999 14.7917V12.7083C7.49999 11.6728 6.66052 10.8333 5.62499 10.8333H3.54166ZM9.37499 11.6667C9.02982 11.6667 8.74999 11.9465 8.74999 12.2917C8.74999 12.6368 9.02982 12.9167 9.37499 12.9167H17.7083C18.0535 12.9167 18.3333 12.6368 18.3333 12.2917C18.3333 11.9465 18.0535 11.6667 17.7083 11.6667H9.37499ZM9.37499 14.1667C9.02982 14.1667 8.74999 14.4465 8.74999 14.7917C8.74999 15.1368 9.02982 15.4167 9.37499 15.4167H15.2083C15.5535 15.4167 15.8333 15.1368 15.8333 14.7917C15.8333 14.4465 15.5535 14.1667 15.2083 14.1667H9.37499Z"
                        fill="#313131"
                    />
                </svg>
                <h2>Recap</h2>
            </div>

            {/* Affichage des moustiques comptabilisés */}
            <div className="recap-mosquito-nb">
                <div className="recap-mosquito-nb-i">
                    <h3>{mosquitoHour}</h3>
                    <h6>last hour</h6>
                </div>
                <div className="recap-mosquito-nb-i">
                    <h3>{mosquitoDay}</h3>
                    <h6>last day</h6>
                </div>
                <div className="recap-mosquito-nb-i">
                    <h3>{mosquitoWeek}</h3>
                    <h6>last week</h6>
                </div>
                <div className="recap-mosquito-nb-i">
                    <h3>{mosquitoMonth}</h3>
                    <h6>last month</h6>
                </div>
                <div className="recap-mosquito-nb-i">
                    <h3>{mosquitoYear}</h3>
                    <h6>last year</h6>
                </div>
            </div>

            {/* Graphique pour le CO2 */}
            <div className="recap-co2-box">
                <canvas id="co2Chart" ref={chartRef}></canvas>
            </div>
        </div>
    );
};

export default Recap;
