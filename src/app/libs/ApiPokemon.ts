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