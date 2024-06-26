import Link from "next/link";
import clsx from "clsx";
import { lalezar } from "@/app/fonts";
import { navigationTheme } from "../theme";
import { formatId } from "@/app/utils/formatId";
import Icon from "../Icon/Icon";


interface NavigationProps {
  index: number;
  primaryType: string;
  direction: string;
  pokemonId: number;
}

export default function Navigation({
  index,
  primaryType,
  direction,
  pokemonId,
}: NavigationProps) {
  return (
    <>
      {pokemonId > 151 || pokemonId < 1 ? (
        <div
          className={clsx(
            `${lalezar.className} flex w-6/12 uppercase text-xl md:text-2xl`,
            navigationTheme(primaryType, direction)
          )}
        >
          {direction === "left" ? (
            <span className="flex justify-between sm:justify-evenly items-center gap-4 min-w-full px-4 sm:px-6"></span>
          ) : (
            <span className="flex justify-between sm:justify-evenly items-center gap-4 min-w-full px-4 sm:px-6"></span>
          )}
        </div>
      ) : (
        <Link
          href={`/${index}`}
          className={clsx(
            `${lalezar.className} flex w-6/12 uppercase text-xl md:text-2xl transition`,
            navigationTheme(primaryType, direction)
          )}
        >
          {direction === "left" ? (
            <span className="flex justify-between sm:justify-evenly items-center gap-4 min-w-full px-4 sm:px-6">
              <span className="bg-white p-1 sm:p-2 rounded-full">
                <Icon icon="chevronLeft" width="12" height="12" />
              </span>
              <span className="flex -translate-y-2">
                {index}&nbsp;
                <span className="hidden sm:block">{formatId(pokemonId)}</span>
              </span>
            </span>
          ) : (
            <span className="flex justify-between sm:justify-evenly items-center gap-4 min-w-full px-4 sm:px-6">
              <span className="flex -translate-y-2">
                {index}&nbsp;
                <span className="hidden sm:block">{formatId(pokemonId)}</span>
              </span>
              <span className="bg-white p-1 sm:p-2 rounded-full">
                <Icon icon="chevronRight" width="12" height="12" />
              </span>
            </span>
          )}
        </Link>
      )}
    </>
  );
}
