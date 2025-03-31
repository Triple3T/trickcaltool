/**
 * Returns character icon image URL.
 * @param chara Character code name.
 * @param variant Image variant.
 */
export const getCharaImageUrl = (chara: string, variant?: string | boolean): string => {
  if (variant === "af")
    return getCharaImageUrl(
      chara,
      `af-${["i", "f", "s"][Math.floor(Math.random() * 3)]}`
    );
  if (variant === "af-i")
    return `https://media-af-tr.triple-lab.com/Mini_${chara}_Idle.png`;
  if (variant === "af-f")
    return `https://media-af-tr.triple-lab.com/Mini_${chara}_Fail.png`;
  if (variant === "af-s")
    return `https://media-af-tr.triple-lab.com/Mini_${chara}_Success.png`;
  return `/charas/${chara}.png`;
};
