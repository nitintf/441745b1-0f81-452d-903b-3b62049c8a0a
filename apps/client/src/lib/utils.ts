import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { mergeProps } from "vue";

export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ptViewMerge = (
  globalPTProps = {} as any,
  selfPTProps = {} as any,
  datasets: any
) => {
  const { class: globalClass, ...globalRest } = globalPTProps;
  const { class: selfClass, ...selfRest } = selfPTProps;

  return mergeProps(
    { class: twMerge(globalClass, selfClass) },
    globalRest,
    selfRest,
    datasets
  );
};
