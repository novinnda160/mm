// Inicializar o mapa
const map = L.map("map").setView([-14.235, -51.9253], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Chave da API OpenCage
const apiKey = "0015fbbb711d4074acf8bc2f66fcfe35"; // Substitua pela sua chave da API OpenCage

// Array para armazenar rotas
let routes = [];

// Função para converter endereço em coordenadas
async function geocodeAddress(address) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry;
            return { lat, lng };
        } else {
            throw new Error("Endereço não encontrado.");
        }
    } catch (error) {
        console.error("Erro na geocodificação:", error);
        alert("Erro ao buscar coordenadas para o endereço: " + address);
    }
}

// Adicionar rota ao mapa e à lista
async function addRoute() {
    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;

    if (!origin || !destination) {
        alert("Por favor, insira endereços válidos.");
        return;
    }

    const originCoords = await geocodeAddress(origin);
    const destinationCoords = await geocodeAddress(destination);

    if (originCoords && destinationCoords) {
        // Adicionar ao mapa
        const polyline = L.polyline(
            [[originCoords.lat, originCoords.lng], [destinationCoords.lat, destinationCoords.lng]],
            { color: "blue", weight: 5 }
        ).addTo(map);
        map.fitBounds(polyline.getBounds());

        // Armazenar a rota e atualizar a lista
        const route = { id: Date.now(), origin, destination, polyline };
        routes.push(route);
        updateRoutesList();
    }
}

// Atualizar lista de rotas no DOM
function updateRoutesList() {
    const routesList = document.getElementById("routes-list");
    routesList.innerHTML = ""; // Limpar lista anterior

    routes.forEach(route => {
        const routeElement = document.createElement("div");
        routeElement.className = "route";
        routeElement.innerHTML = `
            <span>Origem: ${route.origin}</span>
            <span>Destino: ${route.destination}</span>
            <button onclick="deleteRoute(${route.id})">Excluir</button>
        `;
        routesList.appendChild(routeElement);
    });
}

// Excluir rota
function deleteRoute(id) {
    // Remover do array de rotas
    const routeIndex = routes.findIndex(route => route.id === id);
    if (routeIndex > -1) {
        // Remover do mapa
        const [removedRoute] = routes.splice(routeIndex, 1);
        map.removeLayer(removedRoute.polyline);
        updateRoutesList();
    }
}
