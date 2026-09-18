import { CloudEdge } from "./CloudEdge";
import type { CloudEdgeAppearance, CloudEdgeName, CloudSectionProps } from "./cloudSectionTypes";

const edges: CloudEdgeName[] = ["top", "right", "bottom", "left"];

export function CloudSection({
	width = "100%", height = "40vh", position = "relative", style, className = "", children,
	fillColor = "#081012", cloudColor = "#6086a4", secondaryColor = "#9265a6",
	opacity = 0.82, blur = 12, density = 0.7, softness = 0.65, edgeNoise = 0.65,
	intensity = 1, movementSpeed = 0.15, noiseSpeed = 0.08, directionX = 1, directionY = 0.15,
	dispersion = { top: true, bottom: true }, dispersionSize = { top: 120, bottom: 160 },
}: CloudSectionProps) {
	const appearance: CloudEdgeAppearance = {
		fillColor, cloudColor, secondaryColor, opacity, blur, density, softness, edgeNoise,
		intensity, movementSpeed, noiseSpeed, directionX, directionY,
	};
	return (
		<section className={`relative isolate ${className}`} style={{ position, width, height, backgroundColor: fillColor, ...style }}>
			{edges.map((edge) => {
				const size = Math.max(0, dispersionSize[edge] ?? 0);
				return dispersion[edge] && size > 0
					? <CloudEdge key={edge} edge={edge} size={size} appearance={appearance} />
					: null;
			})}
			<div className="relative z-10 size-full">{children}</div>
		</section>
	);
}
