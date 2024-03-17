"use client";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "@/lib/store/hooks";

const InitMap = () => {
  const [mounted, setMounted] = useState(false);
  const mapNode = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map>(null!);
  const headerHeight = useAppSelector(
    (state) => state.uiStateReducer.value.headerHeight
  );
  useEffect(() => {
    // set map
    const node = mapNode.current;
    if (typeof window === "undefined" || node === null) return;
    // add map height relative to header height
    node.style.height = `calc(100vh - ${headerHeight}px)`;

    // get current orientation
    // Listen to deviceorientation event
    window.addEventListener("deviceorientation", function (event) {
      // Do something with event
      console.log(event.alpha, event.beta, event.gamma, event.absolute);
    });
    // add a map
    const map = new mapboxgl.Map({
      container: node,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_API_KEY,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: [-74.5, 40],
      zoom: 9,
      projection: "globe" as any,
    });
    const geoControl = new mapboxgl.GeolocateControl({
      trackUserLocation: true,
      showUserHeading: true,
      positionOptions: { enableHighAccuracy: true, timeout: 600 },
    });
    map.addControl(geoControl);
    setMap(map);
    map.on("load", () => {
      geoControl.trigger();
    });

    return () => {
      map?.remove();
    };
  }, [headerHeight]);

  return <div ref={mapNode} style={{ width: "100%" }}></div>;
};

export default InitMap;
