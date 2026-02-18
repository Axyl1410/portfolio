import { formatTimeInVN } from "./nav-shared";

export function useNavData() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const timeInVN = formatTimeInVN(now);

  return {
    currentYear,
    timeInVN,
  };
}
