"use server";

import { PokemonList } from "../types/pokemon";

const API_URL = "https://pokeapi.co/api/v2";

async function fetchDataPokemon(url: string) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

export async function fetchPokemonName() {
    try {
        const url = `${API_URL}/pokemon`;
        const data = await fetchDataPokemon(url);
        return data.results;
    } catch (error) {
        console.error("Error fetching data", error);
    }
}

export async function fetchPokemonList(offset: number, limit: number) {
    try {
        const url = `${API_URL}/pokemon?offset=${offset}&limit=${limit}`;
        const data = await fetchDataPokemon(url);
        // console.log("Data", data);
        const urls = data.results.map((pokemon: PokemonList) => pokemon.url);

        const promises = await Promise.all(
            urls.map((url: string) => fetchDataPokemon(url))
        );

        const pokemonData = promises.map((item) => ({
            name: item.name,
            url: item.sprites.front_default,
            id: item.id,
            type: item.types.map((type: any) => type.type.name).join(", "),
        }))

        return pokemonData;

    } catch (error) {
        console.error("Error fetching data", error);
    }
}

export async function fetchSearchPokemon(name: string) {
    try {
        const url = `${API_URL}/pokemon/${name}`;
        const data = await fetchDataPokemon(url);
        const id = data.id;
        const type = data.types.map((type: any) => type.type.name).join(", ");
        const imageUrls = data.sprites.other.home.front_default;

        return {
            id: id,
            name,
            type: type,
            url: imageUrls
        }
    } catch (error) {
        console.error("Error fetching data", error);
    }
}

export async function getTypes() {
    try {
        const url = `${API_URL}/type/ground`;
        const data = await fetchDataPokemon(url);
        console.log(data);
        return data.results.filter((type: any) => type.name !== "unknown" && type.name !== "shadow").sort((a: any, b: any) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error("Error fetching data", error);
    }
}

export async function fetchPokemonType(type: string) {
    try {
        const url = `${API_URL}/type/${type}`;
        const data = await fetchDataPokemon(url);

        const urls = data?.pokemon?.map((type: any) => type.pokemon.url);

        const promises = await Promise.all(
            urls.map((url: string) => fetchDataPokemon(url))
        );
        
        const pokemonData = promises.map((item) => ({
            name: item?.name,
            url: item?.sprites?.front_default,
            id: item?.id,
            type: item?.types.map((type: any) => type.type.name).join(", "),
        }));

        return pokemonData;


    } catch (error) {
        console.error("Error fetching data", error);
    }
}


export async function fetchSearchedPokemon(name: string) {
    try {
      const url = `${API_URL}/pokemon/${name}`;
      const data = await fetchDataPokemon(url);
      const pokemonId = data.id;
      const primaryType = data.types[0].type.name;
      const imageUrl = data.sprites.other.home.front_default;
  
      return {
        id: pokemonId,
        name,
        type: primaryType,
        url: imageUrl,
      };
    } catch (error) {
      console.error(error);
    }
  }
  
  export async function fetchType(endpoint: string) {
    try {
      const url = `${endpoint}`;
      const data = await fetchDataPokemon(url);
      const doubleDamageFrom = data.damage_relations.double_damage_from;
      const halfDamageFrom = data.damage_relations.half_damage_from;
      const noDamageFrom = data.damage_relations.no_damage_from;
  
      return [doubleDamageFrom, halfDamageFrom, noDamageFrom];
    } catch (error) {
      return null;
    }
  }

  export async function fetchPokemonDetails(name: string) {
    try {
      const url = `${API_URL}/pokemon/${name}`;
      const data = await fetchDataPokemon(url);
      const pokemonStats = data.stats;
      const pokemonId = data.id;
      const height = data.height / 10;
      const weight = data.weight / 10;
      const primaryType = data.types[0].type.name;
      const types = data.types;
      const imageUrl = data.sprites.other.home.front_default;
  
      return {
        pokemonStats,
        pokemonId,
        height,
        weight,
        primaryType,
        types,
        imageUrl,
        name,
      };
    } catch (error) {
      console.error(error);
    }
  }
  
  export async function fetchEvolutionChain(id: number) {
    try {
      const speciesUrl = `${API_URL}/pokemon-species/${id}`;
      const speciesData = await fetchDataPokemon(speciesUrl);
      const evolutionChainUrl = speciesData.evolution_chain.url;
      const evolutionChainData = await fetchDataPokemon(evolutionChainUrl);
  
      const firstEvolution = evolutionChainData.chain.species.name;
      const secondEvolution =
        evolutionChainData.chain.evolves_to[0]?.species.name;
      const thirdEvolution =
        evolutionChainData.chain.evolves_to[0]?.evolves_to[0]?.species.name;
  
      const result = [firstEvolution];
      if (secondEvolution) result.push(secondEvolution);
      if (thirdEvolution) result.push(thirdEvolution);
  
      const promises = result.map(async (name) => {
        return await fetchPokemonDetails(name);
      });
  
      const pokemonData = await Promise.all(promises);
  
      // Return name and images
      return pokemonData.map((item) => {
        return { name: item?.name, url: item?.imageUrl };
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  export async function fetchFlavorText(id: number) {
    try {
      const speciesUrl = `${API_URL}/pokemon-species/${id}`;
      const speciesData = await fetchDataPokemon(speciesUrl);
      const flavorTextEntries = speciesData.flavor_text_entries[1].flavor_text;
  
      return flavorTextEntries;
    } catch (error) {
      console.error(error);
    }
  }