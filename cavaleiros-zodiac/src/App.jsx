// App.jsx
// Fluxo: title → god_select → knight_select → run → result → (reinicia)

import { useState } from "react";
import TitleScreen from "./screens/TitleScreen";
import GodSelect from "./screens/GodSelect";
import KnightSelect from "./screens/KnightSelect";
import Run from "./screens/Run";
import Result from "./screens/Result";

export default function App() {

    const [screen, setScreen] = useState("title");
    const [selectedGod, setSelectedGod] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [runData, setRunData] = useState(null);

    function handleStart() {
        setScreen("god_select");
    }

    function handleGodSelect(godId) {
        setSelectedGod(godId);
        setScreen("knight_select");
    }

    function handleTeamConfirm(team) {
        setSelectedTeam(team);
        setScreen("run");
    }

    function handleRunFinish(history, survivors, fallen) {
        setRunData({ history, survivors, fallen });
        setScreen("result");
    }

    function handleRestart() {
        setScreen("title");
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

    return (
        <div>
            {screen === "title" && (
                <TitleScreen onStart={handleStart} />
            )}

            {screen === "god_select" && (
                <GodSelect onSelect={handleGodSelect} />
            )}

            {screen === "knight_select" && (
                <KnightSelect godId={selectedGod} onConfirm={handleTeamConfirm} />
            )}

            {screen === "run" && (
                <Run team={selectedTeam} godId={selectedGod} onFinish={handleRunFinish} />
            )}

            {screen === "result" && (
                <Result
                    history={runData.history}
                    survivors={runData.survivors}
                    fallen={runData.fallen}
                    godId={selectedGod}
                    onRestart={handleRestart}
                    onRetry={handleRetry}
                />
            )}
        </div>
    );
}
