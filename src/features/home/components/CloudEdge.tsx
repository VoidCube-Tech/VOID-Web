import { useEffect, useRef } from "react";
import { edgeFragmentShader, edgeVertexShader } from "./cloudEdgeSource";
import type { CloudEdgeAppearance, CloudEdgeName } from "./cloudSectionTypes";

interface Props {
	readonly edge: CloudEdgeName;
	readonly size: number;
	readonly appearance: CloudEdgeAppearance;
}

interface Renderer {
	readonly gl: WebGLRenderingContext;
	readonly program: WebGLProgram;
	readonly uniform: (name: string) => WebGLUniformLocation | null;
	readonly draw: () => void;
	readonly syncAnimation: () => void;
}

const edgeIndex: Record<CloudEdgeName, number> = { top: 0, right: 1, bottom: 2, left: 3 };

function rgb(value: string): [number, number, number] {
	const hex = value.replace(/^#/, "");
	const expanded = hex.length === 3 ? [...hex].map((digit) => digit + digit).join("") : hex;
	if (!/^[\da-f]{6}$/i.test(expanded)) return [0, 0, 0];
	return [0, 2, 4].map((offset) => parseInt(expanded.slice(offset, offset + 2), 16) / 255) as [number, number, number];
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
	const shader = gl.createShader(type);
	if (!shader) return null;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
	gl.deleteShader(shader);
	return null;
}

export function CloudEdge({ edge, size, appearance }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const rendererRef = useRef<Renderer | null>(null);
	const sizeRef = useRef(size);
	sizeRef.current = size;
	const animationEnabledRef = useRef(appearance.movementSpeed !== 0 && appearance.noiseSpeed !== 0);
	animationEnabledRef.current = appearance.movementSpeed !== 0 && appearance.noiseSpeed !== 0;
	const appearanceKey = JSON.stringify(appearance);
	const overlap = Math.max(24, appearance.blur * 5 + 8);
	const innerTransition = Math.max(8, overlap - appearance.blur * 3);
	const innerTransitionRef = useRef(innerTransition);
	innerTransitionRef.current = innerTransition;
	const blurRef = useRef(appearance.blur);
	blurRef.current = appearance.blur;
	const horizontal = edge === "top" || edge === "bottom";
	const crossBleed = appearance.blur * 3;
	const placement = horizontal
		? { left: 0, [edge]: -size, width: "100%", height: size + overlap }
		: { top: 0, [edge]: -size, width: size + overlap, height: "100%" };
	const canvasPlacement = horizontal
		? { left: -crossBleed, top: 0, width: `calc(100% + ${crossBleed * 2}px)`, height: "100%" }
		: { top: -crossBleed, left: 0, width: "100%", height: `calc(100% + ${crossBleed * 2}px)` };

	useEffect(() => {
		const canvas = canvasRef.current;
		const gl = canvas?.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false });
		if (!canvas || !gl) return;
		const vertex = compile(gl, gl.VERTEX_SHADER, edgeVertexShader);
		const fragment = compile(gl, gl.FRAGMENT_SHADER, edgeFragmentShader);
		const program = gl.createProgram();
		if (!vertex || !fragment || !program) {
			if (vertex) gl.deleteShader(vertex);
			if (fragment) gl.deleteShader(fragment);
			if (program) gl.deleteProgram(program);
			return;
		}
		gl.attachShader(program, vertex);
		gl.attachShader(program, fragment);
		gl.linkProgram(program);
		gl.deleteShader(vertex);
		gl.deleteShader(fragment);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); return; }
		const buffer = gl.createBuffer();
		if (!buffer) { gl.deleteProgram(program); return; }
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
		gl.useProgram(program);
		const position = gl.getAttribLocation(program, "a_position");
		gl.enableVertexAttribArray(position);
		gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
		const locations = new Map<string, WebGLUniformLocation | null>();
		const uniform = (name: string) => {
			if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name));
			return locations.get(name) ?? null;
		};
		const draw = () => {
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		};
		let frame = 0;
		let visible = false;
		let running = false;
		let frozenTime = 0;
		let startTime = performance.now();
		let lastDraw = 0;
		const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		let reducedMotion = motionQuery.matches;
		const tick = (now: number) => {
			if (now - lastDraw >= 1000 / 15) {
				const location = uniform("u_time");
				if (location) gl.uniform1f(location, frozenTime + (now - startTime) / 1000);
				draw();
				lastDraw = now;
			}
			if (running) frame = requestAnimationFrame(tick);
		};
		const syncAnimation = () => {
			cancelAnimationFrame(frame);
			if (running) frozenTime += (performance.now() - startTime) / 1000;
			running = visible && !reducedMotion && animationEnabledRef.current;
			if (running) {
				startTime = performance.now();
				lastDraw = 0;
				frame = requestAnimationFrame(tick);
			} else {
				const location = uniform("u_time");
				if (location) gl.uniform1f(location, frozenTime);
				draw();
			}
		};
		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			const scale = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(600_000 / Math.max(rect.width * rect.height, 1)));
			canvas.width = Math.max(1, Math.round(rect.width * scale));
			canvas.height = Math.max(1, Math.round(rect.height * scale));
			const resolution = uniform("u_resolution");
			if (resolution) gl.uniform2f(resolution, canvas.width, canvas.height);
			const edgeSize = uniform("u_size");
			const pixelScale = horizontal ? canvas.height / Math.max(rect.height, 1) : canvas.width / Math.max(rect.width, 1);
			if (edgeSize) gl.uniform1f(edgeSize, sizeRef.current * pixelScale);
			const transition = uniform("u_innerTransition");
			if (transition) gl.uniform1f(transition, innerTransitionRef.current * pixelScale);
			const blur = uniform("u_blur");
			if (blur) gl.uniform1f(blur, blurRef.current * pixelScale);
			syncAnimation();
		};
		rendererRef.current = { gl, program, uniform, draw, syncAnimation };
		const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncAnimation(); });
		const resizeObserver = new ResizeObserver(resize);
		observer.observe(canvas);
		resizeObserver.observe(canvas);
		const onMotionChange = () => { reducedMotion = motionQuery.matches; syncAnimation(); };
		motionQuery.addEventListener("change", onMotionChange);
		resize();
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			resizeObserver.disconnect();
			motionQuery.removeEventListener("change", onMotionChange);
			rendererRef.current = null;
			gl.deleteBuffer(buffer);
			gl.deleteProgram(program);
		};
	}, [edge, horizontal]);

	useEffect(() => {
		const renderer = rendererRef.current;
		if (!renderer) return;
		const { gl, program, uniform, draw, syncAnimation } = renderer;
		gl.useProgram(program);
		const number = (name: string, value: number) => {
			const location = uniform(name);
			if (location) gl.uniform1f(location, value);
		};
		const color = (name: string, value: string) => {
			const location = uniform(name);
			if (location) gl.uniform3fv(location, rgb(value));
		};
		color("u_fillColor", appearance.fillColor);
		color("u_cloudColor", appearance.cloudColor);
		color("u_secondaryColor", appearance.secondaryColor);
		number("u_edge", edgeIndex[edge]);
		number("u_opacity", appearance.opacity);
		number("u_density", appearance.density);
		number("u_softness", appearance.softness);
		number("u_edgeNoise", appearance.edgeNoise);
		number("u_intensity", appearance.intensity);
		number("u_movementSpeed", appearance.movementSpeed);
		number("u_noiseSpeed", appearance.noiseSpeed);
		const canvas = canvasRef.current;
		if (canvas) {
			const rect = canvas.getBoundingClientRect();
			const pixelScale = horizontal ? canvas.height / Math.max(rect.height, 1) : canvas.width / Math.max(rect.width, 1);
			number("u_innerTransition", innerTransition * pixelScale);
			number("u_blur", appearance.blur * pixelScale);
		}
		const direction = uniform("u_direction");
		if (direction) gl.uniform2f(direction, appearance.directionX, appearance.directionY);
		syncAnimation();
	}, [appearanceKey, edge]);

	return (
		<div aria-hidden="true" className="pointer-events-none absolute z-0 overflow-clip" style={placement}>
			<canvas ref={canvasRef} className="pointer-events-none absolute" style={{ ...canvasPlacement, filter: `blur(${appearance.blur}px)` }} />
		</div>
	);
}
