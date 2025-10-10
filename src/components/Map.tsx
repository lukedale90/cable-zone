import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Polygon,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { useParameters } from "../context/ParametersContext";

import "leaflet/dist/leaflet.css";
import { calculateDistance } from "../utils/calculate-distance"; // Import the utility function
import { calculateStropHeights } from "../utils/calculate-strop-height";
import { calculateWindGradient } from "../utils/calculate-wind-gradient";
import { calculateStropDrift } from "../utils/calculate-strop-drift";
import {
  calculateDriftCoordinates,
  calculateIntervalPositions,
} from "../utils/calculate-drift-coordinates";
import WindDialContainer from "./WindDial";

const Map = () => {
  const { parameters, setParameters } = useParameters();
  const [driftCoordinates, setDriftCoordinates] = React.useState<
    { lat: number; lng: number }[]
  >([]);
  const [driftCoordinates2, setDriftCoordinates2] = React.useState<
    { start: { lat: number; lng: number }; drift: { lat: number; lng: number } }[]
  >([]);
  // Create a custom yellow circle icon
  const winchIcon = L.divIcon({
    className: "custom-icon",
    html: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
             <circle cx="10" cy="10" r="10" fill="yellow" />
           </svg>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const launchIcon = L.divIcon({
    className: "custom-icon",
    html: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
             <circle cx="10" cy="10" r="10" fill="red" />
           </svg>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  useEffect(() => {
    const distance = calculateDistance(
      parameters.winchLocation,
      parameters.launchPoint
    );

    const stropHeights = calculateStropHeights(
      distance,
      parameters.releaseHeight,
      parameters.surfaceWind.speed
    );
    console.log(stropHeights);

    const windGradient = calculateWindGradient(
      parameters.surfaceWind.speed,
      parameters.twoThousandFtWind.speed,
      parameters.surfaceWind.direction,
      parameters.twoThousandFtWind.direction,
      parameters.releaseHeight
    );

    const stropDrift = calculateStropDrift(
      // parameters.stropWeight,
      // parameters.stropDiameter,
      // parameters.stropLength,
      stropHeights,
      windGradient
    );

    const intervalPositions = calculateIntervalPositions(
      parameters.winchLocation.lat,
      parameters.winchLocation.lng,
      parameters.launchPoint.lat,
      parameters.launchPoint.lng
    );

    //reverse Interval positions to match strop heights from launch to winch
    intervalPositions.reverse();

    const driftCoordinates = intervalPositions.map((position, index) => {
      const { lat, lng } = position;
      const { driftX, driftY } = stropDrift[index];
      return calculateDriftCoordinates(lat, lng, driftX, driftY);
    });

    const driftCoordinates2 = intervalPositions.map((position, index) => {
      const { lat, lng } = position;
      const { driftX, driftY } = stropDrift[index];
      const drift = calculateDriftCoordinates(lat, lng, driftX, driftY);

      return { start: {lat, lng}, drift };
    });

    setDriftCoordinates(driftCoordinates);
    setDriftCoordinates2(driftCoordinates2);

    //set cable length based on distance between winch and launch point
    setParameters((prev) => ({
      ...prev,
      cableLength: distance,
    }));
  }, [
    parameters.winchLocation,
    parameters.launchPoint,
    parameters.releaseHeight,
    parameters.surfaceWind,
    parameters.twoThousandFtWind,
    setParameters,
  ]);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <MapContainer
        center={[parameters.viewLocation.lat, parameters.viewLocation.lng]}
        zoom={16}
        style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; <a href='https://www.esri.com/'>Esri</a> contributors"
        />
        <Marker
          position={parameters.winchLocation}
          icon={winchIcon}
          draggable={true}
          eventHandlers={{
            dragend: (event) => {
              const { lat, lng } = event.target.getLatLng();
              setParameters((prev) => ({
                ...prev,
                winchLocation: { lat, lng },
              }));
            },
          }}
        />
        <Marker
          position={parameters.launchPoint}
          icon={launchIcon}
          draggable={true}
          eventHandlers={{
            dragend: (event) => {
              const { lat, lng } = event.target.getLatLng();
              setParameters((prev) => ({
                ...prev,
                launchPoint: { lat, lng },
              }));
            },
          }}
        />
        <Polyline
          positions={[
            [parameters.winchLocation.lat, parameters.winchLocation.lng],
            [parameters.launchPoint.lat, parameters.launchPoint.lng],
          ]}
          pathOptions={{ color: "blue", weight: 2 }}
        />
        <Polyline
          positions={driftCoordinates.map((coord) => [coord.lat, coord.lng])}
          pathOptions={{ color: "red", weight: 2, dashArray: "5, 10" }}
        />
        {driftCoordinates2.map((item, index) => (
          <Polyline
            key={index}
            positions={[
              [item.start.lat, item.start.lng],
              [item.drift.lat, item.drift.lng],
            ]}
            pathOptions={{ color: "red", weight: 1, dashArray: "2, 6" }}
          />
        ))}
        <Polygon
          positions={[
            [parameters.winchLocation.lat, parameters.winchLocation.lng] as LatLngExpression,
            [parameters.launchPoint.lat, parameters.launchPoint.lng] as LatLngExpression,
            ...driftCoordinates.map((coord) => [coord.lat, coord.lng] as LatLngExpression),
          ]}
          pathOptions={{ color: "rgba(255, 0, 0, 0.3)", fillColor: "red", fillOpacity: 0.2 }}
        />
      </MapContainer>
      <WindDialContainer
        surfaceWind={parameters.surfaceWind}
        twoThousandFtWind={parameters.twoThousandFtWind}
      />
    </div>
  );
};

export default Map;
