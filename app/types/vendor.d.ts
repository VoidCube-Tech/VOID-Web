declare module "zdog" {
  type Color = string;

  interface VectorInput {
    x?: number;
    y?: number;
    z?: number;
  }

  class Vector {
    x: number;
    y: number;
    z: number;

    constructor(position?: VectorInput);
    set(position?: VectorInput): this;
    multiply(position: number | VectorInput): this;
  }

  interface AnchorOptions {
    addTo?: Anchor;
    rotate?: VectorInput;
    scale?: number | VectorInput;
    translate?: VectorInput;
  }

  class Anchor {
    addTo?: Anchor;
    children: Anchor[];
    rotate: Vector;
    scale: Vector;
    translate: Vector;

    constructor(options?: AnchorOptions);
    addChild(child: Anchor): void;
    remove(): void;
    removeChild(child: Anchor): void;
    normalizeRotate(): void;
    updateGraph(): void;
  }

  interface IllustrationOptions extends AnchorOptions {
    centered?: boolean;
    dragRotate?: boolean | Anchor;
    element: string | HTMLCanvasElement | SVGSVGElement;
    onDragEnd?: () => void;
    onDragMove?: () => void;
    onDragStart?: () => void;
    resize?: boolean | "fullscreen";
    zoom?: number;
  }

  class Illustration extends Anchor {
    element: HTMLCanvasElement | SVGSVGElement;
    height: number;
    width: number;
    zoom: number;

    constructor(options: IllustrationOptions);
    renderGraph(item?: Anchor): void;
    setResize(resize: boolean | "fullscreen"): void;
    setSize(width: number, height: number): void;
    updateRenderGraph(item?: Anchor): void;
  }

  interface ShapeOptions extends AnchorOptions {
    backface?: boolean | Color;
    closed?: boolean;
    color?: Color;
    fill?: boolean;
    path?: VectorInput[];
    stroke?: boolean | number;
    visible?: boolean;
  }

  class Shape extends Anchor {
    color: Color;
    stroke: boolean | number;

    constructor(options?: ShapeOptions);
  }

  interface RoundedRectOptions extends ShapeOptions {
    cornerRadius?: number;
    height?: number;
    width?: number;
  }

  class RoundedRect extends Shape {
    cornerRadius: number;
    height: number;
    width: number;

    constructor(options?: RoundedRectOptions);
  }

  interface BoxOptions extends ShapeOptions {
    bottomFace?: boolean | Color;
    depth?: number;
    frontFace?: boolean | Color;
    height?: number;
    leftFace?: boolean | Color;
    rearFace?: boolean | Color;
    rightFace?: boolean | Color;
    topFace?: boolean | Color;
    width?: number;
  }

  class Box extends Anchor {
    bottomFace: boolean | Color;
    color: Color;
    depth: number;
    frontFace: boolean | Color;
    height: number;
    leftFace: boolean | Color;
    rearFace: boolean | Color;
    rightFace: boolean | Color;
    stroke: boolean | number;
    topFace: boolean | Color;
    width: number;

    constructor(options?: BoxOptions);
  }
}
