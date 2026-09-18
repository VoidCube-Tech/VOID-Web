import { heroStages, stageIndexAt } from "./heroMedia";

const boundaries = [0.1, 0.3, 0.5, 0.7, 0.9];
const overlap = 0.02;

export function transitionProgress(index: number, progress: number): number {
	const start = boundaries[index - 1];
	const end = boundaries[index];
	return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}

export function stageOpacities(progress: number): number[] {
	const opacity = Array<number>(heroStages.length).fill(0);
	const position = Math.min(1, Math.max(0, progress));
	for (let index = 0; index < boundaries.length; index++) {
		const distance = position - boundaries[index];
		if (Math.abs(distance) > overlap) continue;
		const blend = (distance + overlap) / (overlap * 2);
		opacity[index] = 1;
		opacity[index + 1] = blend;
		return opacity;
	}
	opacity[stageIndexAt(position)] = 1;
	return opacity;
}
