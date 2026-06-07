// App.jsx
// Fluxo: title → location_select → god_select → knight_select → run → result → (reinicia)

import { useState } from "react";
import { LanguageProvider } from "./i18n/LanguageContext";
import TitleScreen from "./screens/TitleScreen";
import LocationSelect from "./screens/LocationSelect";
import GodSelect from "./screens/GodSelect";
import KnightSelect from "./screens/KnightSelect";
import Run from "./screens/Run";
import Result from "./screens/Result";

export default function App() {

    const [screen, setScreen] = useState("title");
    const [selectedLoc, setSelectedLoc] = useState("sanctuary");
    const [selectedGod, setSelectedGod] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [runLayout, setRunLayout] = useState(null);
    const [runTeamSize, setRunTeamSize] = useState(null);
    const [runData, setRunData] = useState(null);

    function handleStart() {
        setScreen("location_select");
    }

    function handleLocationSelect(locationId) {
        setSelectedLoc(locationId);
        setScreen("god_select");
    }

    function handleGodSelect(godId) {
        setSelectedGod(godId);
        setScreen("knight_select");
    }

    function handleTeamConfirm(team, layout, teamSize) {
        setSelectedTeam(team);
        setRunLayout(layout);
        setRunTeamSize(teamSize);
        setScreen("run");
    }

    function handleRunFinish(history, survivors, fallen, fallenHouses) {
        setRunData({ history, survivors, fallen, fallenHouses });
        setScreen("result");
    }

    function handleRestart() {
        setScreen("title");
        setSelectedLoc("sanctuary");
        setSelectedGod(null);
        setSelectedTeam([]);
        setRunData(null);
    }

    // Mantém o mesmo deus e vai direto para a seleção de cavaleiros
    function handleRetry() {
        setSelectedTeam([]);
        setRunData(null);
        setScreen("knight_select");
    }

    // Volta ao menu principal resetando tudo
    function handleMenu() {
        setScreen("title");
        setSelectedLoc("sanctuary");
        setSelectedGod(null);
        setSelectedTeam([]);
        setRunLayout(null);
        setRunTeamSize(null);
        setRunData(null);
    }

    return (
        <LanguageProvider>
            <div>
                {screen === "title" && (
                    <TitleScreen onStart={handleStart} />
                )}

                {screen === "location_select" && (
                    <LocationSelect
                        onSelect={handleLocationSelect}
                        onBack={() => setScreen("title")}
                    />
                )}

                {screen === "god_select" && (
                    <GodSelect
                        onSelect={handleGodSelect}
                        onBack={() => setScreen("location_select")}
                    />
                )}

                {screen === "knight_select" && (
                    <KnightSelect
                        godId={selectedGod}
                        onConfirm={handleTeamConfirm}
                        onBack={() => setScreen("god_select")}
                    />
                )}

                {screen === "run" && (
                    <Run
                        team={selectedTeam}
                        godId={selectedGod}
                        locationId={selectedLoc}
                        layout={runLayout}
                        teamSize={runTeamSize}
                        onFinish={handleRunFinish}
                        onMenu={handleMenu}
                    />
                )}

                {screen === "result" && (
                    <Result
                        history={runData.history}
                        survivors={runData.survivors}
                        fallen={runData.fallen}
                        fallenHouses={runData.fallenHouses}
                        godId={selectedGod}
                        onRestart={handleRestart}
                        onRetry={handleRetry}
                    />
                )}
            </div>
        </LanguageProvider>
    );
}
