// App.jsx
// Fluxo completo: god_select → knight_select → run → result → (reinicia)

import { useState } from "react";
import GodSelect from "./screens/GodSelect";
import KnightSelect from "./screens/KnightSelect";
import Run from "./screens/Run";
import Result from "./screens/Result";

export default function App() {

    const [screen, setScreen] = useState("god_select");
    const [selectedGod, setSelectedGod] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [runData, setRunData] = useState(null);

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

    // Reinicia tudo do zero
    function handleRestart() {
        setScreen("god_select");
        setSelectedGod(null);
        setSelectedTeam([]);
        setRunData(null);
    }

    return (
        <div>
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
                />
            )}
        </div>
    );
}
