import Image from "next/image";

interface PokemonImageProps {
  src: string;
  name: string;
}

export default async function PokemonImage({ src, name }: PokemonImageProps) {


  return (
    <Image
      src={src}
      alt={name}
      placeholder="blur"
      objectFit="cover"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lPAAAAA=="
      width={512}
      height={512}
    />
  );
}
