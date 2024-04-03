import Image from "next/image";
import SearchData from "./components/SearchList/SearchList";
import { fetchPokemonList, fetchPokemonName, fetchPokemonType, getTypes } from "./libs/ApiPokemon";
import { PokemonList } from "./types/pokemon";

export default async function Home() {
  const pokemonList = await fetchPokemonList(0, );
  const pokemonNames = await fetchPokemonName();
  return (
    <main className="flex flex-col items-center justify-between">
    <SearchData 
     pokemonList={pokemonList as PokemonList[]}
      pokemonName={pokemonNames}
    />
  </main>
  );
}
