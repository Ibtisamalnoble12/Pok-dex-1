// Global variables
let allPokemon = []; // Array to store all Pokémon data
let filteredPokemon = []; // Array for filtered Pokémon

// DOM elements
const searchInput = document.getElementById('search');
const pokemonGrid = document.getElementById('pokemon-grid');
const pokemonDetails = document.getElementById('pokemon-details');
const closeDetails = document.getElementById('close-details');

// Function to fetch all Pokémon data from PokéAPI
async function fetchAllPokemon() {
    try {
        // First, get the list of first 151 Pokémon
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();

        // For each Pokémon, fetch detailed information
        const pokemonPromises = data.results.map(async (pokemon) => {
            const pokemonResponse = await fetch(pokemon.url);
            return await pokemonResponse.json();
        });

        // Wait for all detailed fetches to complete
        allPokemon = await Promise.all(pokemonPromises);
        filteredPokemon = [...allPokemon]; // Copy for filtering
        displayPokemon(filteredPokemon);
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        pokemonGrid.innerHTML = '<p>Error loading Pokémon data. Please try again later.</p>';
    }
}

// Function to display Pokémon in the grid
function displayPokemon(pokemonList) {
    pokemonGrid.innerHTML = ''; // Clear existing cards

    pokemonList.forEach(pokemon => {
        // Create a card for each Pokémon
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.onclick = () => showPokemonDetails(pokemon);

        // Get the Pokémon's image (use front_default sprite)
        const imageUrl = pokemon.sprites.front_default;

        // Get the Pokémon's types
        const types = pokemon.types.map(type => type.type.name).join(', ');

        // Create the card content
        card.innerHTML = `
            <img src="${imageUrl}" alt="${pokemon.name}">
            <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
            <p>Type: ${types}</p>
        `;

        pokemonGrid.appendChild(card);
    });
}

// Function to show detailed information about a Pokémon
function showPokemonDetails(pokemon) {
    // Populate the details modal
    document.getElementById('details-name').textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    document.getElementById('details-image').src = pokemon.sprites.front_default;
    document.getElementById('details-type').textContent = pokemon.types.map(type => type.type.name).join(', ');
    document.getElementById('details-height').textContent = pokemon.height;
    document.getElementById('details-weight').textContent = pokemon.weight;
    document.getElementById('details-abilities').textContent = pokemon.abilities.map(ability => ability.ability.name).join(', ');

    // Show the modal
    pokemonDetails.classList.remove('hidden');
}

// Function to filter Pokémon based on search input
function filterPokemon() {
    const searchTerm = searchInput.value.toLowerCase();
    filteredPokemon = allPokemon.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm)
    );
    displayPokemon(filteredPokemon);
}

// Event listeners
searchInput.addEventListener('input', filterPokemon);

closeDetails.addEventListener('click', () => {
    pokemonDetails.classList.add('hidden');
});

// Close modal when clicking outside the content
pokemonDetails.addEventListener('click', (event) => {
    if (event.target === pokemonDetails) {
        pokemonDetails.classList.add('hidden');
    }
});

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', fetchAllPokemon);
