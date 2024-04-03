"use client";

import { Pokemon, PokemonList } from "@/app/types/pokemon";
import { useRef, useState } from "react";
import Icon from "./Icon";
import { useDebouncedCallback } from "use-debounce";
import { fetchPokemonList, fetchPokemonType, fetchSearchPokemon } from "@/app/libs/ApiPokemon";
import { CardGrid, CardListItem } from "../atoms/CardGrid/CardGrid";
import { CardSkeleton } from "../common/Header/skeletonsCard";
import CardList from "../common/CardList/CardList";
import clsx from "clsx";
import { cardPillTheme } from "../common/theme";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";


interface PokemonListProps {
    pokemonList: PokemonList[];
    pokemonName: Pokemon[];
}

const DEFAULT_POKEMON_LIST = 20;


export default function SearchData({ pokemonList, pokemonName }: PokemonListProps) {
    const [inputValue, setInputValue] = useState("");
    const [offset, setOffset] = useState(DEFAULT_POKEMON_LIST);
    const [pokemon, setPokemon] = useState<PokemonList[]>(pokemonList);
    const [loadMore, setLoadMore] = useState(false);
    const [isError, setIsError] = useState(false);
    const [searchList, setSearchList] = useState<PokemonList[]>([]);
    const [numberOfSearch, setNumberOfSearch] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [noPokemon, setNoPokemon] = useState(false);
    const scrollRef = useRef({} as HTMLDivElement);

    function scrollTypes(scroll: number) {
        scrollRef.current.scrollLeft += scroll;
    }

    const type = [
        { name: "normal" },
        { name: "fighting" },
        { name: "flying" },
        { name: "poison" },
        { name: "ground" },
        { name: "rock" },
        { name: "bug" },
        { name: "ghost" },
        { name: "steel" },
        { name: "fire" },
        { name: "water" },
        { name: "grass" },
        { name: "electric" },
        { name: "psychic" },
        { name: "ice" },
        { name: "dragon" },
        { name: "dark" },
        { name: "fairy" },
    ]

    const searchFilter = (searchableNames: Pokemon[]) => {
        return searchableNames.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(inputValue.toLowerCase())
        );
    }

    const debounceSearch = useDebouncedCallback(
        async (value: string) => {
            if (value.length < 2) {
                setNoPokemon(false);
                setSearchList([]);
                return;
            }
            const filterPokemonName = searchFilter(pokemonName);
            if (value.length >= 2) {
                setIsLoading(true);
                setNoPokemon(false);
                if (filterPokemonName.length > 0) {
                    const pokemonName = filterPokemonName.map((pokemon) => pokemon.name);
                    setNumberOfSearch(pokemonName.length);
                    try {
                        const promises = pokemonName.map(async (name) => {
                            return await fetchSearchPokemon(name);
                        })

                        const pokemonData = await Promise.all(promises);

                        setSearchList(pokemonData as PokemonList[]);
                        setIsLoading(false);
                    } catch (error) {
                        setIsLoading(false);
                        setNoPokemon(true);
                        setSearchList([]);
                    }
                } else {
                    setIsLoading(false);
                    setNoPokemon(true);
                    setSearchList([]);
                }
            }
        },
        500
    )
    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        debounceSearch(value);
    }

    const filterType = async (type: string) => {
        if (type === "") {
            // setPokemon(pokemonList);
            setOffset(DEFAULT_POKEMON_LIST);
            return;
        }
        else {
            setNumberOfSearch(5);
            setIsLoading(true);
            const filterPokemon = await fetchPokemonType(type) as PokemonList[];
            setPokemon(filterPokemon);
            setOffset(DEFAULT_POKEMON_LIST);
            setIsLoading(false);
        }
    }

    const loadMorePokemon = async () => {
        try {
            setLoadMore(true);
            if (offset + DEFAULT_POKEMON_LIST > pokemon.length) {
                setOffset(offset + (pokemon.length - offset));
                const apiPokemon = await fetchPokemonList(offset, pokemon.length - offset);
                setPokemon([...pokemon, ...(apiPokemon as PokemonList[])]);

            } else {
                setOffset(offset + DEFAULT_POKEMON_LIST);
                const apiPokemon = await fetchPokemonList(offset, DEFAULT_POKEMON_LIST);

                setPokemon([...pokemon, ...(apiPokemon as PokemonList[])]);
            }
            setLoadMore(false);

        } catch (error) {
            setIsError(true);
            setLoadMore(false);
        }
    }

    return (
        <>
            <div className="w-full h-16 lg:h-24 bg-gradient-to-r from-primary to-secondary"></div>
            <div className="flex flex-col max-w-4xl items-center justify-center mx-auto w-11/12 lg:w-full">
                <form className="flex gap-1 py-4 px-6 rounded-lg items-center border-2 border-background drop-shadow-lg bg-background m-[-2rem] w-full mb-8">
                    <Icon />
                    <input
                        placeholder="Search for a pokèmon"
                        type="text"
                        className="rounded-md px-2 outline-none w-full"
                        autoComplete="off"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                </form>

                <div className="w-full sm:text-left sm:self-start mb-8">


                    <div className="flex flex-col gap-4 w-full sm:flex-row items-center sm:items-end mb-6">
                        <div className="flex flex-col gap-2 w-full">
                            <h2 className="text-black font-bold text-2xl lg:text-3xl">Type of Pokemon</h2>

                            <div className="flex flex-row gap-2">
                                <button onClick={() => scrollTypes(-114)}>
                                    <ChevronLeftIcon
                                        width={24}
                                        height={24}
                                        color="#000"
                                        strokeWidth={2.5}
                                    />
                                </button>

                                <div ref={scrollRef} className="flex flex-row gap-1 items-center relative overflow-auto filter-type touch-pan-x lg:gap-3 scroll-smooth"
                                >
                                    {type.map((type) => (
                                        <button
                                            className={clsx(
                                                `capitalize text-black rounded flex items-center w-max px-3 py-1 shadow-md h-min opacity-50 transition-opacity duration-250`,
                                                cardPillTheme(type?.name)
                                            )}

                                            onClick={() => filterType(type.name)}
                                        >
                                            {type.name}
                                        </button>
                                    ))}
                                </div>

                                <button onClick={() => scrollTypes(114)}>
                                    <ChevronRightIcon
                                        width={24}
                                        height={24}
                                        color="#000"
                                        strokeWidth={2.5}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {noPokemon ? (
                    <div>No pokemon, try another.</div>
                ) : isLoading ? (
                    <CardGrid>
                        {Array.from({ length: numberOfSearch }, (_, i) => (
                            <CardListItem key={i}>
                                <CardSkeleton />
                            </CardListItem>
                        ))}
                    </CardGrid>
                ) : (
                    <CardList
                        pokemonList={inputValue.length >= 2 ? searchList : pokemon}
                        loadMore={loadMore}
                        isError={isError}
                        loadMorePokemon={loadMorePokemon}
                    />
                )}

                {inputValue.length < 2 &&
                    searchList.length === 0 && (
                        <button
                            onClick={loadMorePokemon}
                            className="bg-quinary-dark py-4 px-8 rounded-2xl font-bold text-background mb-8 hover:bg-slate-600 transition-colors w-[147.5px]"
                            disabled={loadMore ? true : false}
                        >
                            {loadMore ? "Loading..." : "Load More"}
                        </button>
                    )}
            </div>
        </>
    )

}