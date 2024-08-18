"use client";
import Map, { MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { useRef, useCallback, use, useEffect, useState } from "react";
import { useAppSelector } from "@/lib/store/hooks";
import CustomOverlay from "./custom-overlay";
import Earth from "../three-scenes/earth";
import { AnimatePresence, motion } from "framer-motion";
import useSWR from "swr";
import fetcher from "@/services/http/httpClient.helper";

const InitMap = () => {
  const mapRef = useRef<MapRef>(null!);
  const earthNode = useRef<HTMLDivElement>(null!);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
  const {
    data: ip,
    error,
    isLoading,
  } = useSWR("https://ipapi.co/json", fetcher);
  const { data } = useSWR(
    `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0/query?where=ISO='${
      (ip as any)?.country_code
    }'&returnGeometry=true&returnEnvelope=true&outSR=4326&f=json`,
    fetcher
  );

  useEffect(() => {
    if (isMapLoaded && map && data) {
      console.log("data", data);
      map.fitBounds([
        [
          (data as any).features[0].envelope.xmin,
          (data as any).features[0].envelope.ymin,
        ],
        [
          (data as any).features[0].envelope.xmax,
          (data as any).features[0].envelope.ymax,
        ],
      ]);
    }
  }, [map, isMapLoaded, data]);
  console.log("geo data", data);
  const headerHeight = useAppSelector(
    (state) => state.uiStateReducer.headerHeight
  );

  useEffect(() => {
    if (earthNode.current) {
      earthNode.current.style.height = `calc(100vh - ${headerHeight}px)`;
    }
  }, [headerHeight]);

  const onMapLoad = useCallback(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    setMap(map);
    map.getContainer().style.height = `calc(100vh - ${headerHeight}px)`;
    /*  navigator.geolocation.getCurrentPosition((position) => {
      map.flyTo({
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 16,
      });
      console.log(map);
     
    }); */
    setIsMapLoaded(true);
  }, [headerHeight]);

  return (
    <div className="relative">
      <Map
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 4,
        }}
        ref={mapRef}
        onLoad={onMapLoad}
        mapLib={mapboxgl}
        style={{ width: "100%", height: "100vh" }}
        minZoom={2}
        projection={{ name: "globe" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={TOKEN}
      >
        <div className="absolute w-full z-[10000]  left-0 bottom-2 pointer-events-none flex justify-center">
          <div className="pointer-events-auto">
            <button
              className=" bg-black px-4 py-2"
              onClick={() => {
                console.log("hello");
              }}
            >
              click
            </button>
          </div>
        </div>
      </Map>
    </div>
  );
};

export default InitMap;
