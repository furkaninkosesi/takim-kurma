import React, { useState, useEffect } from 'react';
import Select from 'react-select';

function App() {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [playersData, setPlayersData] = useState([]); // Yeni state

  // 1. Backend'den mevcut oyuncuları çekme
  useEffect(() => {
    fetch("http://80.253.246.117:5000/players")
      .then((response) => response.json())
      .then((data) => {
        console.log("Backend'den gelen veri:", data);
        if (Array.isArray(data)) {
          setPlayersData(convertDataToArray(data)); // Oyuncuları diziye çevir ve state'e kaydet
        } else {
          console.error("Beklenen veri formatı dizi değil.");
        }
      })
      .catch((error) =>
        console.error("Oyuncular yüklenirken hata oluştu:", error)
      );
  }, []);

  const convertDataToArray = (data) => {
    return data.map((player) => ({
      name: player.name,
      score: player.score,
      label: player.name,
      value: player.name,
    }));
  };

  const getCombinations = (arr, n) => {
    const res = [];
    const combinations = (prefix, arr) => {
      if (prefix.length === n) {
        res.push(prefix);
        return;
      }
      for (let i = 0; i < arr.length; i++) {
        combinations([...prefix, arr[i]], arr.slice(i + 1));
      }
    };
    combinations([], arr);
    return res;
  };

  const calculateAverage = (team) => {
    const total = team.reduce((sum, player) => sum + player.score, 0);
    return total / team.length;
  };

  const generateTeams = () => {
    const selectedCount = selectedPlayers.length;
    if (![6, 8, 10].includes(selectedCount)) {
      alert("Lütfen 6 veya 8 oyuncu seçin!");
      return;
    }

    const half = selectedCount / 2;
    const teamCombinations = getCombinations(selectedPlayers, half);
    const teamResults = teamCombinations.map((teamA) => {
      const teamB = selectedPlayers.filter(
        (player) => !teamA.includes(player)
      );
      const avgA = calculateAverage(teamA);
      const avgB = calculateAverage(teamB);

      return {
        teamA,
        teamB,
        avgDifference: Math.abs(avgA - avgB),
      };
    });

    const bestTeams = teamResults
      .sort((a, b) => a.avgDifference - b.avgDifference)
      .slice(0, 3);

    setTeams(bestTeams);
  };

  const handleSelectChange = (selectedOptions) => {
    setSelectedPlayers(selectedOptions); 
  };

  return (
    <div style={{textAlign: 'center'}}>
      <h1>Takim Kurma Algoritmasi</h1>

      <Select
        isMulti
        options={playersData} 
        onChange={handleSelectChange} 
        value={selectedPlayers} 
        placeholder="Oyuncuları seçin (6 veya 8 oyuncu seçin)"
      />

      <button onClick={generateTeams}>Takımları Oluştur</button>

      {teams.length > 0 && (
        <div>
          {teams.map((team, index) => (
            <div key={index} style={{textAlign: 'center'}}>
              <h2 style={{color: 'red'}}>Takım Önerisi {index + 1}</h2>
              <h3 >Takım A (Ortalama: {calculateAverage(team.teamA).toFixed(2)})</h3>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                {team.teamA.map((player, i) => (
                  <li key={i}>{player.name} - {player.score}</li>
                ))}
              </ul>
              <h3>Takım B (Ortalama: {calculateAverage(team.teamB).toFixed(2)})</h3>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                {team.teamB.map((player, i) => (
                  <li key={i}>{player.name} - {player.score}</li>
                ))}
              </ul>
              <p>Ortalama Farkı: {team.avgDifference.toFixed(2)}</p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
