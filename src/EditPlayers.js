import React, { useState, useEffect } from "react";

function EditPlayers() {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerScore, setNewPlayerScore] = useState("");
  const [password, setPassword] = useState(""); 
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  const correctPassword = "admins"; 
  const apiUrl = "https://80.253.246.117:5000/players"; 

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPlayers(data);
        } else {
          console.error("Beklenen veri formatı dizi değil.");
          setPlayers([]); // Varsayılan olarak boş bir dizi ayarla
        }
      })
      .catch((error) =>
        console.error("Oyuncular yüklenirken hata oluştu:", error)
      );
  }, []);


  const addPlayer = () => {
    if (!newPlayerName || isNaN(newPlayerScore) || newPlayerScore === "") {
      alert("Lütfen geçerli bir oyuncu adı ve puanı girin.");
      return;
    }

    const newPlayer = { name: newPlayerName, score: parseFloat(newPlayerScore) };
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlayer),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Oyuncu eklenirken hata oluştu.");
        }
        return response.text();
      })
      .then(() => {
        setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
        setNewPlayerName("");
        setNewPlayerScore("");
        alert("Oyuncu başarıyla eklendi!");
      })
      .catch((error) => console.error("Oyuncu eklenirken hata oluştu:", error));
  };

  const updatePlayerScore = (player) => {
    const updatedPlayer = { ...player, score: parseFloat(player.score) };
    fetch(`${apiUrl}/${player.name}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedPlayer),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Oyuncu güncellenirken hata oluştu.");
        }
        return response.text();
      })
      .then(() => {
        setPlayers((prevPlayers) =>
          prevPlayers.map((p) => (p.name === player.name ? updatedPlayer : p))
        );
        alert("Oyuncu puanı başarıyla güncellendi!");
      })
      .catch((error) => console.error("Oyuncu güncellenirken hata oluştu:", error));
  };

  const deletePlayer = (playerName) => {
    fetch(`${apiUrl}/${playerName}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Oyuncu silinirken hata oluştu.");
        }
        return response.text();
      })
      .then(() => {
        setPlayers((prevPlayers) => prevPlayers.filter((player) => player.name !== playerName));
        alert("Oyuncu başarıyla silindi!");
      })
      .catch((error) => console.error("Oyuncu silinirken hata oluştu:", error));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Yanlış parola, lütfen tekrar deneyin.");
    }
  };


  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: "center" }}>
        <h2>Parola ile Giriş</h2>
        <form onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            placeholder="Parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Giriş Yap</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Oyuncu Düzenleme Ekranı</h2>

      {/* Yeni Oyuncu Ekleme Formu */}
      <div>
        <h3>Yeni Oyuncu Ekle</h3>
        <input
          type="text"
          placeholder="Oyuncu Adı"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Oyuncu Puanı"
          value={newPlayerScore}
          onChange={(e) => setNewPlayerScore(e.target.value)}
        />
        <button onClick={addPlayer}>Oyuncu Ekle</button>
      </div>

      {/* Oyuncu Listesi ve Düzenleme */}
      <div>
        <h3>Oyuncu Listesi</h3>
        <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
          {Array.isArray(players) && players.length > 0 ? (
            players.map((player) => (
              <li key={player.name} style={{alignItems: "center"}}>
                <span style={{textAlign: "center" }}>{player.name} - Puan: </span>
                <input
                  type="number"
                  style={{ width: "60px", marginRight: "10px" }}
                  value={player.score}
                  onChange={(e) => {
                    const updatedScore = parseFloat(e.target.value);
                    setPlayers((prevPlayers) =>
                      prevPlayers.map((p) =>
                        p.name === player.name ? { ...p, score: updatedScore } : p
                      )
                    );
                  }}
                />
                <button onClick={() => updatePlayerScore(player)}>Güncelle</button>
                <button onClick={() => deletePlayer(player.name)}>Sil</button>
              </li>
            ))
          ) : (
            <li>Oyuncu bulunamadı</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default EditPlayers;
