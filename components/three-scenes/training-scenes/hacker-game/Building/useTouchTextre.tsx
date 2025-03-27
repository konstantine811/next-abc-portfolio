import { easeOutSine } from "@/services/three-js/easing.utils";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Point {
  x: number;
  y: number;
  age: number;
  force: number;
}

interface UseTouchTextureOptions {
  persist?: boolean;
  size?: number;
  maxAge?: number;
  radius?: number;
}

export function useTouchTexture({
  size = 256,
  maxAge = 100,
  radius = 0.1,
  persist = false,
}: UseTouchTextureOptions) {
  const trail = useRef<Point[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const textureRef = useRef<THREE.Texture>(new THREE.Texture());

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.height = size;
    ctxRef.current = canvas.getContext("2d");

    const ctx = ctxRef.current;
    if (ctx) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, size, size);
    }

    const texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;

    textureRef.current = texture;
  }, [size]);

  const clear = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, size, size);
  };

  const drawTouch = (point: Point) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const pos = {
      x: point.x * size,
      y: (1 - point.y) * size,
    };

    let intensity = 1;
    if (!persist) {
      if (point.age < maxAge * 0.3) {
        intensity = easeOutSine(point.age / (maxAge * 0.3), 0, 1, 1);
      } else {
        intensity = easeOutSine(
          1 - (point.age - maxAge * 0.3) / (maxAge * 0.7),
          0,
          1,
          1
        );
      }
      intensity *= point.force;
    }

    const r = size * radius * intensity;

    const grd = ctx.createRadialGradient(
      pos.x,
      pos.y,
      r * 0.25,
      pos.x,
      pos.y,
      r
    );
    grd.addColorStop(0, `rgba(255,255,255,0.2)`);
    grd.addColorStop(1, `rgba(0,0,0,0.0)`);

    ctx.beginPath();
    ctx.fillStyle = grd;
    ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  const update = (delta: number) => {
    if (!persist) clear();

    trail.current = trail.current.filter((point) => {
      if (!persist) point.age++;
      return persist || point.age <= maxAge;
    });

    trail.current.forEach(drawTouch);
    textureRef.current.needsUpdate = true;
  };

  const addTouch = (point: { x: number; y: number }) => {
    let force = 1;
    if (!persist) {
      const last = trail.current[trail.current.length - 1];
      if (last) {
        const dx = last.x - point.x;
        const dy = last.y - point.y;
        const dd = dx * dx + dy * dy;
        force = Math.min(dd * 10000, 1);
      }
    }
    trail.current.push({ ...point, age: 0, force });
  };

  return {
    texture: textureRef.current,
    canvas: canvasRef.current,
    addTouch,
    update,
    clear,
  };
}
