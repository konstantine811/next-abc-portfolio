import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Map } from "mapbox-gl";
import * as THREE from "three";

const MapboxThreeScene = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const threeContainer = useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<Map | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    mapRef.current = new Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [30.5234, 50.4501], // Київ
      zoom: 14,
      pitch: 45,
      bearing: 0,
      antialias: true,
    });

    mapRef.current.on("style.load", () => {
      mapRef.current!.resize();
    });
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      <Canvas
        ref={threeContainer}
        style={{ position: "absolute", top: 0, left: 0 }}
      ></Canvas>
    </div>
  );
};

export default MapboxThreeScene;
