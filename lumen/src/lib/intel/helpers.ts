import { BRAND_SUFFIXES, TLDS } from "./lexicon";
import { int, pick } from "./seed";

export function inventishDomain(rand: () => number, salt = ""): string {
  const roots = [
    "signal",
    "orbit",
    "rank",
    "pulse",
    "growth",
    "metric",
    "nova",
    "pixel",
    "trail",
    "craft",
    "north",
    "bright",
    "leaf",
    "cedar",
    "summit",
    "harbor",
    "flint",
    "quartz",
  ];
  const root = pick(rand, roots);
  const suffix = pick(rand, [...BRAND_SUFFIXES]);
  const tld = pick(rand, [...TLDS]);
  if (salt) {
    return `${root}${suffix}${int(rand, 1, 9)}${tld}`;
  }
  return `${root}${suffix}${tld}`;
}
