import { lalezar } from "@/app/fonts";

export default function Header() {
    return (
       <>
       <header>
        <h1 className={`${lalezar.className} flex justify-center text-4xl py-4 md:py-8`}>Pokedex</h1>
       </header>
       </> 
    )
}