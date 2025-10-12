import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Polygon,
  useMap,
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

const UpdateMapView = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();

  useEffect(() => {
    // Ensure the map is ready before updating the view
    map.whenReady(() => {
      const currentCenter = map.getCenter();

      // Extract latitude and longitude from the center
      const [lat, lng] = Array.isArray(center)
        ? center
        : [center.lat, center.lng];

      // Update the map view only if the center has changed
      if (currentCenter.lat !== lat || currentCenter.lng !== lng) {
        map.setView(center);
      }
    });
  }, [center, map]);

  return null;
};

const Map = () => {
  const { parameters, setParameters } = useParameters();
  const [view, setView] = React.useState<LatLngExpression>([
    parameters.viewLocation.lat,
    parameters.viewLocation.lng,
  ]);
  const [driftCoordinates, setDriftCoordinates] = React.useState<
    { lat: number; lng: number }[]
  >([]);
  const [driftCoordinates2, setDriftCoordinates2] = React.useState<
    {
      start: { lat: number; lng: number };
      drift: { lat: number; lng: number };
    }[]
  >([]);
  const [sausagePolygon, setSausagePolygon] = React.useState<
    { lat: number; lng: number }[]
  >([]);
  const [RWYHeading, setRWYHeading] = React.useState<number>(0);
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

  const averageDirection = (() => {
    const surfaceDirectionRad =
      (parameters.surfaceWind.direction * Math.PI) / 180;
    const twoThousandFtDirectionRad =
      (parameters.twoThousandFtWind.direction * Math.PI) / 180;

    // Convert directions to vectors
    const x =
      Math.cos(surfaceDirectionRad) + Math.cos(twoThousandFtDirectionRad);
    const y =
      Math.sin(surfaceDirectionRad) + Math.sin(twoThousandFtDirectionRad);

    // Calculate the average direction in radians
    const avgDirectionRad = Math.atan2(y, x);

    // Convert back to degrees and normalize to 0-360°
    return (avgDirectionRad * 180) / Math.PI >= 0
      ? (avgDirectionRad * 180) / Math.PI
      : (avgDirectionRad * 180) / Math.PI + 360;
  })();

  useEffect(() => {
    const distance = calculateDistance(
      parameters.winchLocation,
      parameters.launchPoint
    );

    const stropHeights = calculateStropHeights(
      distance,
      parameters.releaseHeight,
      parameters.surfaceWind.speed,
      parameters.customLaunchProfile
    );

    const windGradient = calculateWindGradient(
      parameters.surfaceWind.speed,
      parameters.twoThousandFtWind.speed,
      parameters.surfaceWind.direction,
      parameters.twoThousandFtWind.direction,
      parameters.releaseHeight
    );

    const stropDrift = calculateStropDrift(
      parameters.stropWeight,
      parameters.stropDiameter,
      parameters.stropLength,
      stropHeights,
      windGradient,
      parameters.safetyBuffer
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

      return { start: { lat, lng }, drift };
    });

    const sausageCoordinates = intervalPositions.map((position, index) => {
      const { lat, lng } = position;
      const { minDriftX, maxDriftX, minDriftY, maxDriftY } = stropDrift[index];
      const minDrift = calculateDriftCoordinates(
        lat,
        lng,
        minDriftX,
        minDriftY
      );
      const maxDrift = calculateDriftCoordinates(
        lat,
        lng,
        maxDriftX,
        maxDriftY
      );

      return { min: minDrift, max: maxDrift };
    });

    const minValues = sausageCoordinates.map(
      (coord: {
        min: { lat: number; lng: number };
        max: { lat: number; lng: number };
      }) => coord.min
    );
    const maxValues = sausageCoordinates.map(
      (coord: {
        min: { lat: number; lng: number };
        max: { lat: number; lng: number };
      }) => coord.max
    );

    // Create the polygon by joining min values and reversed max values
    const sausagePolygon = [
      ...minValues,
      ...maxValues.reverse(),
      minValues[0], // Close the polygon by connecting back to the first min value
    ];

    setSausagePolygon(sausagePolygon);
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
    parameters.stropWeight,
    parameters.stropDiameter,
    parameters.stropLength,
    parameters.safetyBuffer,
    parameters.customLaunchProfile,
    setParameters,
  ]);

  useEffect(() => {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const { winchLocation, launchPoint } = parameters;
    const dLon = toRad(winchLocation.lng - launchPoint.lng);
    const lat1 = toRad(launchPoint.lat);
    const lat2 = toRad(winchLocation.lat);
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let brng = Math.atan2(y, x);
    brng = (toDeg(brng) + 360) % 360;

    setRWYHeading(brng);
  }, [parameters.winchLocation, parameters.launchPoint]);

  useEffect(() => {
    //update theoretical max height
    const lengthInFeet = parameters.cableLength * 3.28084;

    const nilWindHeight = lengthInFeet * 0.3; // 60% of cable length in feet

    const averageSpeed =
      (parameters.surfaceWind.speed + parameters.twoThousandFtWind.speed) / 2;

    const windDirectionTo = (averageDirection - RWYHeading + 360) % 360;
    const windDirectionToRad = (windDirectionTo * Math.PI) / 180;
    const headwind = averageSpeed * Math.cos(windDirectionToRad); // Headwind/Tailwind component (North-South)

    const windFactor = (headwind * 3.5) / 100 + 1; // Rough linear approximation
    const theoreticalMaxHeight = nilWindHeight * windFactor;
    
    setParameters((prev) => ({
      ...prev,
      theroreticalMaxHeight: Math.round(theoreticalMaxHeight),
    }));
  }, [
    parameters.cableLength,
    parameters.surfaceWind,
    parameters.twoThousandFtWind,
    setParameters,
  ]);

  useEffect(() => {
    setView([parameters.viewLocation.lat, parameters.viewLocation.lng]);

    //update winch and launch point if view location changes
    setParameters((prev) => ({
      ...prev,
      winchLocation: {
        lat: parameters.viewLocation.lat - 0.0022,
        lng: parameters.viewLocation.lng - 0.0045,
      },
      launchPoint: {
        lat: parameters.viewLocation.lat + 0.0018,
        lng: parameters.viewLocation.lng + 0.011,
      },
    }));
  }, [parameters.viewLocation, setParameters]);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <MapContainer
        center={view}
        zoom={16}
        style={{ height: "100%", width: "100%" }}>
        <UpdateMapView center={view} />
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
        {/* Launch Point label */}
        <Marker
          position={parameters.launchPoint}
          icon={L.divIcon({
            className: "",
            html: `<div style="background:rgba(255, 0, 0, 0.47);padding:2px 8px;border-radius:4px;border:1px solid #d21919ff;font-size:12px;color:#fff;white-space:nowrap;">
              Launch Point
            </div>`,
            iconSize: [90, 24],
            iconAnchor: [45, 40], // place label above marker
          })}
          interactive={false}
        />
        {/* Winch  label */}
        <Marker
          position={parameters.winchLocation}
          icon={L.divIcon({
            className: "",
            html: `<div style="text-align: center; background:rgba(255, 238, 0, 0.54);padding:2px 8px;border-radius:4px;border:1px solid #fbf300ff;font-size:12px;color:#000;white-space:nowrap;">
              Winch
            </div>`,
            iconSize: [60, 24],
            iconAnchor: [30, 40], // place label above marker
          })}
          interactive={false}
        />
        <Polyline
          positions={[
            [parameters.winchLocation.lat, parameters.winchLocation.lng],
            [parameters.launchPoint.lat, parameters.launchPoint.lng],
          ]}
          pathOptions={{ color: "blue", weight: 2 }}
        />
        {/* Heading label */}
        {(() => {
          // Calculate heading in degrees from launch to winch
          // const toRad = (deg: number) => (deg * Math.PI) / 180;
          // const toDeg = (rad: number) => (rad * 180) / Math.PI;
          const { winchLocation, launchPoint } = parameters;
          // const dLon = toRad(winchLocation.lng - launchPoint.lng);
          // const lat1 = toRad(launchPoint.lat);
          // const lat2 = toRad(winchLocation.lat);
          // const y = Math.sin(dLon) * Math.cos(lat2);
          // const x =
          //   Math.cos(lat1) * Math.sin(lat2) -
          //   Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
          // let brng = Math.atan2(y, x);
          // brng = (toDeg(brng) + 360) % 360;

          // setRWYHeading(brng);
          // Midpoint for label
          const midLat = (winchLocation.lat + launchPoint.lat) / 2;
          const midLng = (winchLocation.lng + launchPoint.lng) / 2;

          const boxHeading =
            RWYHeading < 180 ? RWYHeading + 270 : RWYHeading + 90; // Invert if heading is less than 180

          return (
            <>
              {parameters.releaseHeight > parameters.theroreticalMaxHeight ? (
                <Marker
                  position={{ lat: midLat, lng: midLng }}
                  icon={L.divIcon({
                    className: "",
                    html: `<div style="background:rgba(255, 0, 0, 0.8);padding:2px 6px;border-radius:4px;border:1px solid #d21919ff;font-size:12px;color:#fff; transform: rotate(${boxHeading}deg); white-space:nowrap;">
                      Release Height Unreachable
                    </div>`,
                    iconSize: [180, 24],
                    iconAnchor: [90, 12],
                  })}
                  interactive={false}
                />
              ) : (
                <Marker
                  position={{ lat: midLat, lng: midLng }}
                  icon={L.divIcon({
                    className: "",
                    html: `<div style="background:rgba(255,255,255,0.8);padding:2px 6px;border-radius:4px;border:1px solid #1976d2;font-size:12px;color:#1976d2; transform: rotate(${boxHeading}deg); white-space:nowrap;">
                ${RWYHeading.toFixed(0).padStart(3, "0")}° ${
                      parameters.cableLength
                    }m
              </div>`,
                    iconSize: [80, 24],
                    iconAnchor: [40, 12],
                  })}
                  interactive={false}
                />
              )}
            </>
          );
        })()}

        <Polyline
          positions={driftCoordinates.map((coord) => [coord.lat, coord.lng])}
          pathOptions={{ color: "white", weight: 2, dashArray: "5, 10" }}
        />
        <Polygon
          positions={sausagePolygon.map((coord) => [coord.lat, coord.lng])}
          pathOptions={{
            color: "transparent",
            fillColor: "orange",
            fillOpacity: 0.4, // Adjust opacity as needed
          }}
        />
        {driftCoordinates2.map((item, index) => (
          <Polyline
            key={index}
            positions={[
              [item.start.lat, item.start.lng],
              [item.drift.lat, item.drift.lng],
            ]}
            pathOptions={{
              color: "#ffffff80",
              weight: 1,
              dashArray: "2, 6",
              // Animate dashes using CSS class
              className: "animated-dash",
            }}
          />
        ))}
        <style>
          {`
            .leaflet-interactive.animated-dash {
              stroke-dasharray: 2, 6;
              animation: dashmove ${Math.max(
                0.1,
                2 - (parameters.surfaceWind.speed / 20) * 1.9
              )}s linear infinite;
              /* 0kts = 2s, 20kts+ = 0.1s, linear gradient in between */
              /* Clamp to minimum 0.1s */
            }
            @keyframes dashmove {
              to {
                stroke-dashoffset: -8;
              }
            }
          `}
        </style>
        <Polygon
          positions={[
            [
              parameters.winchLocation.lat,
              parameters.winchLocation.lng,
            ] as LatLngExpression,
            [
              parameters.launchPoint.lat,
              parameters.launchPoint.lng,
            ] as LatLngExpression,
            ...driftCoordinates.map(
              (coord) => [coord.lat, coord.lng] as LatLngExpression
            ),
          ]}
          pathOptions={{
            color: "rgba(255, 0, 0, 0.3)",
            fillColor: "red",
            fillOpacity: 0.2,
          }}
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
