"use client";

import { useControls } from "leva";
import mapboxgl, { LngLatLike, Map } from "mapbox-gl";
import { useCallback, useEffect, useRef } from "react";

const MAP_INIT_ZOOM = 5;
const MAP_PITCH = 60;

const Mapbox = () => {
  const mapRef = useRef<Map>(null!);
  const orbitAngle = useRef(0);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const isAnimatingRef = useRef(true);
  // Контролери для leva
  const [{ isAnimating, speed }, set] = useControls(() => ({
    isAnimating: { value: true, label: "Animate Orbit" },
    speed: {
      value: 0.0002,
      min: 0.000000001,
      max: 0.01,
      step: 0.0001,
      label: "Orbit Speed",
    },
  }));
  const animationId = useRef<number | null>(null);
  function getCoordinates() {
    const radius = 170; // Радіус орбіти
    const centerLng = 50; // Довгота центру орбіти
    const centerLat = 30; // Широта центру орбіти

    // Використання динамічної швидкості з leva
    orbitAngle.current += 0.00003;

    // Обчислення нових координат на основі кута орбіти
    const lng = centerLng + radius * Math.cos(orbitAngle.current);
    const lat = centerLat + radius * Math.sin(orbitAngle.current);
    return {
      coord: [lng, lat] as LngLatLike,
      angle: orbitAngle.current * (180 / Math.PI),
    };
  }

  const animateOrbit = useCallback(() => {
    if (!mapRef.current) return;
    if (!isAnimatingRef.current) return;
    const { coord, angle } = getCoordinates();
    mapRef.current.setCenter(coord);
    mapRef.current.setBearing(angle);
    mapRef.current.setPitch(MAP_PITCH);
    mapRef.current.setZoom(MAP_INIT_ZOOM);

    animationId.current = requestAnimationFrame(animateOrbit);
  }, []);

  useEffect(() => {
    isAnimatingRef.current = isAnimating; // Оновлюємо стан анімації через ref

    if (isAnimating && mapRef.current) {
      // Якщо анімація активна, перезапускаємо її
      // Зупиняємо анімацію, якщо isAnimating = false
      const { coord, angle } = getCoordinates();
      mapRef.current
        .flyTo({
          center: coord,
          essential: true, // this animation is considered essential with respect to prefers-reduced-motion
          bearing: angle,
          pitch: MAP_PITCH,
          zoom: MAP_INIT_ZOOM,
        })
        .once("moveend", () => {
          animateOrbit();
        });
    } else if (!isAnimating && animationId.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
    }
  }, [isAnimating, animateOrbit, mapRef]);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoia29uc3RhbnRpbmU4MTEiLCJhIjoiY2themphMDhpMGsyazJybWlpbDdmMGthdSJ9.m2RIe_g8m5dqbce0JrO73w";
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/konstantine811/clxll1zwx00eg01qqcrlphbmk",
        center: [0, 0],
        zoom: MAP_INIT_ZOOM,
      });
      mapRef.current.on("load", animateOrbit);
    }
  }, [animateOrbit]);
  return (
    <div className="min-h-screen relative">
      <div className="min-h-screen relative z-10" ref={mapContainerRef}></div>
    </div>
  );
};

export default Mapbox;
