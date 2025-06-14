import { bubbleSort } from "@/algorithms/utils/sortingAlgorithms/bubbleSort";
import { insertionSort } from "@/algorithms/utils/sortingAlgorithms/insertionSort";
import { selectionSort } from "@/algorithms/utils/sortingAlgorithms/selectionSort";
import { cocktailSort } from "@/algorithms/utils/sortingAlgorithms/cocktailSort";
import { combSort } from "@/algorithms/utils/sortingAlgorithms/combSort";
import { gnomeSort } from "@/algorithms/utils/sortingAlgorithms/gnomeSort";
import { shellSort } from "@/algorithms/utils/sortingAlgorithms/shellSort";
import { oddEvenSort } from "@/algorithms/utils/sortingAlgorithms/oddevenSort";
import { stoogeSort } from "@/algorithms/utils/sortingAlgorithms/stoogeSort";
import { pancakeSort } from "@/algorithms/utils/sortingAlgorithms/pancakeSort";
import { mergeSort } from "@/algorithms/utils/sortingAlgorithms/mergeSort";

export const SORTING_ALGORITHMS = {
  bubble: {
    name: "Bubble Sort",
    func: bubbleSort,
  },
  selection: {
    name: "Selection Sort",
    func: selectionSort,
  },
  insertion: {
    name: "Insertion Sort",
    func: insertionSort,
  },
  merge: {
    name: "Merge Sort",
    func: mergeSort,
  },
  cocktail: {
    name: "Cocktail Sort",
    func: cocktailSort,
  },
  gnome: {
    name: "Gnome Sort",
    func: gnomeSort,
  },
  shell: {
    name: "Shell Sort",
    func: shellSort,
  },
  comb: {
    name: "Comb Sort",
    func: combSort,
  },
  oddEven: {
    name: "Odd-Even Sort",
    func: oddEvenSort,
  },
  pancake: {
    name: "Pancake Sort",
    func: pancakeSort,
  },
  stooge: {
    name: "Stooge Sort",
    func: stoogeSort,
  },
} as const;

export type SortingAlgorithmKey = keyof typeof SORTING_ALGORITHMS;
