const fuvarArray = [];
const fuvarTable = document.getElementById('fuvarTable');

document.getElementById('fuvarForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const myFormData = new FormData(e.target);
    const fuvarData = Object.fromEntries(myFormData);

    // Szám típusokra konvertálás (különben stringként megy el)
    fuvarData.fuvar_id = parseInt(fuvarData.fuvar_id);
    fuvarData.tavolsag = parseFloat(fuvarData.tavolsag);
    fuvarData.viteldij = parseFloat(fuvarData.viteldij);

    // Küldés a szervernek
    fetch('/taxi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fuvarData)
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg); // Pl. "Sikeres mentés."
        // Hozzáadás a táblázathoz
        fuvarArray.push(fuvarData);
        fuvarTable.innerHTML = fuvarArray.map((fuvar, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${fuvar.fuvar_id}</td>
                <td>${fuvar.indulasi_hely}</td>
                <td>${fuvar.cel}</td>
                <td>${fuvar.tavolsag.toFixed(1)} km</td>
                <td>${fuvar.viteldij.toFixed(2)} Ft</td>
                <td>${fuvar.taxi_id}</td>
            </tr>
        `).join('');
        e.target.reset(); // Űrlap törlése
    })
    .catch(err => {
        console.error('Hiba történt:', err);
        alert('Hiba történt a mentés során.');
    });
});
