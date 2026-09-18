import { useEffect, useRef } from "react";
import { cloudFragmentShader, cloudVertexShader } from "./cloudShaderSource";
import type { CloudEdges, CloudVisualConfig } from "./cloudTypes";

interface Props {
	readonly config: CloudVisualConfig;
	readonly dispersion: CloudEdges<boolean>;
	readonly dispersionSize: CloudEdges<number>;
}

interface Renderer {
	readonly gl: WebGLRenderingContext;
	readonly program: WebGLProgram;
	readonly draw: () => void;
	readonly uniform: (name: string) => WebGLUniformLocation | null;
}

function hexColor(value: string): [number, number, number] {
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

export function CloudShader({ config, dispersion, dispersionSize }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const rendererRef = useRef<Renderer | null>(null);
	const dispersionSizeRef = useRef(dispersionSize);
	dispersionSizeRef.current = dispersionSize;
	const valuesKey = JSON.stringify({ config, dispersion, dispersionSize });

	useEffect(() => {
		const canvas = canvasRef.current;
		const gl = canvas?.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false });
		if (!canvas || !gl) return;
		const vertex = compile(gl, gl.VERTEX_SHADER, cloudVertexShader);
		const fragment = compile(gl, gl.FRAGMENT_SHADER, cloudFragmentShader);
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
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			gl.deleteProgram(program);
			return;
		}

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
		rendererRef.current = { gl, program, draw, uniform };

		let frame = 0;
		let visible = false;
		let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		let startTime = performance.now();
		let frozenTime = 0;
		let running = false;
		const tick = (now: number) => {
			const location = uniform("u_time");
			if (location) gl.uniform1f(location, frozenTime + (now - startTime) / 1000);
			draw();
			if (visible && !reducedMotion) frame = requestAnimationFrame(tick);
		};
		const syncAnimation = () => {
			cancelAnimationFrame(frame);
			if (running) frozenTime += (performance.now() - startTime) / 1000;
			running = visible && !reducedMotion;
			if (running) {
				startTime = performance.now();
				frame = requestAnimationFrame(tick);
			} else {
				const location = uniform("u_time");
				if (location) gl.uniform1f(location, frozenTime);
				draw();
			}
		};
		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			const scale = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(1_500_000 / Math.max(rect.width * rect.height, 1)));
			canvas.width = Math.max(1, Math.round(rect.width * scale));
			canvas.height = Math.max(1, Math.round(rect.height * scale));
			const location = uniform("u_resolution");
			if (location) gl.uniform2f(location, canvas.width, canvas.height);
			const size = uniform("u_dispersion");
			const currentSize = dispersionSizeRef.current;
			if (size) gl.uniform4f(size,
				Math.max(1, currentSize.top ?? 0) / Math.max(rect.height, 1),
				Math.max(1, currentSize.right ?? 0) / Math.max(rect.width, 1),
				Math.max(1, currentSize.bottom ?? 0) / Math.max(rect.height, 1),
				Math.max(1, currentSize.left ?? 0) / Math.max(rect.width, 1));
			syncAnimation();
		};
		const observer = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			syncAnimation();
		});
		const resizeObserver = new ResizeObserver(resize);
		observer.observe(canvas);
		resizeObserver.observe(canvas);
		const onMotionChange = () => {
			reducedMotion = motionQuery.matches;
			syncAnimation();
		};
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
	}, []);

	useEffect(() => {
		const renderer = rendererRef.current;
		const canvas = canvasRef.current;
		if (!renderer || !canvas) return;
		const { gl, program, draw, uniform } = renderer;
		gl.useProgram(program);
		const number = (name: string, value: number) => {
			const location = uniform(name);
			if (location) gl.uniform1f(location, value);
		};
		const color = (name: string, value: string) => {
			const location = uniform(name);
			if (location) gl.uniform3fv(location, hexColor(value));
		};
		color("u_cloudColor", config.cloudColor);
		color("u_secondaryColor", config.secondaryColor);
		color("u_backgroundColor", config.backgroundColor);
		number("u_opacity", config.opacity);
		number("u_density", config.density);
		number("u_noiseScale", config.noiseScale);
		number("u_noiseDetail", Math.min(6, Math.max(1, config.noiseDetail)));
		number("u_noiseSpeed", config.noiseSpeed);
		number("u_distortion", config.distortion);
		number("u_contrast", config.contrast);
		number("u_brightness", config.brightness);
		number("u_softness", Math.max(0.001, config.softness));
		number("u_grain", config.grain);
		number("u_movementSpeed", config.movementSpeed);
		number("u_intensity", config.intensity);
		const direction = uniform("u_direction");
		if (direction) gl.uniform2f(direction, config.directionX, config.directionY);
		const edges = uniform("u_edges");
		if (edges) gl.uniform4f(edges, Number(!!dispersion.top), Number(!!dispersion.right), Number(!!dispersion.bottom), Number(!!dispersion.left));
		const size = uniform("u_dispersion");
		if (size) gl.uniform4f(size,
			Math.max(1, dispersionSize.top ?? 0) / Math.max(canvas.clientHeight, 1),
			Math.max(1, dispersionSize.right ?? 0) / Math.max(canvas.clientWidth, 1),
			Math.max(1, dispersionSize.bottom ?? 0) / Math.max(canvas.clientHeight, 1),
			Math.max(1, dispersionSize.left ?? 0) / Math.max(canvas.clientWidth, 1));
		draw();
	}, [valuesKey]);

	return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" style={{ filter: `blur(${config.blur}px)` }} />;
}
