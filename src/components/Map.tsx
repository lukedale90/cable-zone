import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Polygon,
  useMap,
  useMapEvent,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { useParameters } from "../context/ParametersContext";
import { Parameters } from "../context/ParametersProvider";

import "leaflet/dist/leaflet.css";

import WindDialContainer from "./WindDial";
import {
  calculateAverageDirection,
  calculateDistance,
  calculateDriftCoordinates,
  calculateStropDrift,
  calculateIntervalPositions,
  calculateStropHeights,
  calculateWindComponents,
  calculateWindGradient,
} from "../utils";
import MapKeyContainer from "./MapKey";

type Coordinate = {
  lat: number;
  lng: number;
};

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

const GeolocationControl = () => {
  const map = useMap();
  const { setParameters } = useParameters();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    // Create geolocation control
    const GeolocationControlClass = L.Control.extend({
      options: {
        position: "topleft",
      },

      onAdd: function () {
        const div = L.DomUtil.create("div", "leaflet-control-geolocation");
        div.innerHTML = `
          <div style="
            background: white; 
            border-radius: 4px; 
            padding: 5px; 
            box-shadow: 0 1px 5px rgba(0,0,0,0.4);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <button class="geolocation-btn" style="
              border: none;
              background: none;
              padding: 0;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 24px;
              height: 24px;
            " title="Show my location">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <line x1="12" y1="1" x2="12" y2="5"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="1" y1="12" x2="5" y2="12"/>
          <line x1="19" y1="12" x2="23" y2="12"/>
              </svg>
            </button>
          </div>
        `;

        // Prevent map interaction when clicking button
        L.DomEvent.disableClickPropagation(div);

        // Add event listener
        div.addEventListener("click", () => {
          getCurrentLocation();
        });

        return div;
      },
    });

    const geolocationControl = new GeolocationControlClass();
    geolocationControl.addTo(map);

    return () => {
      map.removeControl(geolocationControl);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    // Check if we're on HTTP (not HTTPS) and warn user
    if (location.protocol !== "https:" && location.hostname !== "localhost") {
      alert(
        "Geolocation requires HTTPS. Please use: https://" +
          location.host +
          location.pathname,
      );
      return;
    }

    const btn = document.querySelector(".geolocation-btn");
    btn?.classList.add("locating");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };

        setUserLocation(newLocation);

        // Center map on user location
        map.setView([latitude, longitude], Math.max(map.getZoom(), 15));

        // Update parameters to center view
        setParameters((prev) => ({
          ...prev,
          viewLocation: newLocation,
          zoomLevel: Math.max(map.getZoom(), 15),
        }));

        btn?.classList.remove("locating");
      },
      (error) => {
        console.error("Error getting location:", error);
        let message = "Unable to get your location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            if (
              location.protocol !== "https:" &&
              location.hostname !== "localhost"
            ) {
              message =
                "Location access requires HTTPS. Please use: https://" +
                location.host +
                location.pathname;
            } else {
              message =
                "Location access denied. Please allow location access in your browser settings and try again.";
            }
            break;
          case error.POSITION_UNAVAILABLE:
            message =
              "Location information unavailable. Please check your GPS/location services are enabled.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out. Please try again.";
            break;
        }

        alert(message);
        btn?.classList.remove("locating");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    );
  };

  return (
    <>
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={L.divIcon({
            className: "user-location-marker",
            html: `
              <div style="
                width: 20px;
                height: 20px;
                background: #007bff;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                position: relative;
              ">
                <div style="
                  width: 40px;
                  height: 40px;
                  background: rgba(0,123,255,0.2);
                  border-radius: 50%;
                  position: absolute;
                  top: -10px;
                  left: -10px;
                  animation: locationPulse 2s infinite;
                "></div>
              </div>
              <style>
                @keyframes locationPulse {
                  0% { transform: scale(0.5); opacity: 1; }
                  100% { transform: scale(2); opacity: 0; }
                }
              </style>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })}
        />
      )}
    </>
  );
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
      start: Coordinate;
      drift: Coordinate;
    }[]
  >([]);

  // const [distanceLabels, setDistanceLabels] = React.useState<
  //   { distance: number; height: number }[]
  // >([]);

  const [sausagePolygon, setSausagePolygon] = React.useState<Coordinate[]>([]);
  //const [RWYHeading, setRWYHeading] = React.useState<number>(0);
  // Create a custom yellow circle icon
  const winchIcon = L.divIcon({
    className: "custom-icon",
    html: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" style="cursor: move;">
             <circle cx="10" cy="10" r="10" fill="yellow" />
           </svg>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  const launchIcon = L.divIcon({
    className: "custom-icon",
    html: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" style="cursor: move;">
             <circle cx="10" cy="10" r="10" fill="white" />
           </svg>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  type AnimatedPolylineProps = {
    positions: LatLngExpression[] | LatLngExpression[][];
    pathOptions?: L.PathOptions;
  };

  const AnimatedPolyline: React.FC<AnimatedPolylineProps> = ({
    positions,
    pathOptions,
  }) => {
    const polylineRef = React.useRef<L.Polyline>(null);

    useEffect(() => {
      if (polylineRef.current) {
        const polylineElement = polylineRef.current.getElement();
        if (polylineElement) {
          polylineElement.classList.add("animated-dash");
        }
      }
    }, []);

    return (
      <Polyline
        ref={polylineRef}
        positions={positions}
        pathOptions={pathOptions}
      />
    );
  };

  const averageDirection = React.useMemo(() => {
    return calculateAverageDirection(
      parameters.surfaceWind.direction,
      parameters.twoThousandFtWind.direction,
    );
  }, [
    parameters.surfaceWind.direction,
    parameters.twoThousandFtWind.direction,
  ]);

  useEffect(() => {
    const distance = calculateDistance(
      parameters.winchLocation,
      parameters.launchPoint,
    );

    if (distance > 5000) {
      alert("Alight mate? Launching to the moon are we?");
    }

    const stropHeights = calculateStropHeights(
      distance,
      parameters.releaseHeight,
      parameters.surfaceWind.speed,
      parameters.customLaunchProfile,
      parameters.twoThousandFtWind.speed,
    );

    // const distanceLabels = stropHeights.slice(1); //remove first in the array - don't care about zero
    // setDistanceLabels(distanceLabels);

    const windGradient = calculateWindGradient(
      parameters.surfaceWind.speed,
      parameters.twoThousandFtWind.speed,
      parameters.surfaceWind.direction,
      parameters.twoThousandFtWind.direction,
      parameters.releaseHeight,
    );

    const stropDrift = calculateStropDrift(
      parameters.stropWeight,
      parameters.stropDiameter,
      parameters.stropLength,
      stropHeights,
      windGradient,
      parameters.safetyBuffer,
    );

    const intervalPositions = calculateIntervalPositions(
      parameters.winchLocation.lat,
      parameters.winchLocation.lng,
      parameters.launchPoint.lat,
      parameters.launchPoint.lng,
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
        minDriftY,
      );
      const maxDrift = calculateDriftCoordinates(
        lat,
        lng,
        maxDriftX,
        maxDriftY,
      );

      return { min: minDrift, max: maxDrift };
    });

    const minValues = sausageCoordinates.map(
      (coord: {
        min: { lat: number; lng: number };
        max: { lat: number; lng: number };
      }) => coord.min,
    );
    const maxValues = sausageCoordinates.map(
      (coord: {
        min: { lat: number; lng: number };
        max: { lat: number; lng: number };
      }) => coord.max,
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

    //setRWYHeading(brng);
    setParameters((prev) => ({ ...prev, RWYHeading: brng }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters.winchLocation, parameters.launchPoint]);

  useEffect(() => {
    //update theoretical max height
    const lengthInFeet = parameters.cableLength * 3.28084;

    const nilWindHeight = lengthInFeet * 0.3; // 60% of cable length in feet

    const averageSpeed =
      (parameters.surfaceWind.speed + parameters.twoThousandFtWind.speed) / 2;

    const { headwind } = calculateWindComponents(
      averageSpeed,
      averageDirection,
      parameters.RWYHeading,
    );

    const windFactor = (headwind * 5.5) / 100 + 1; // Rough linear approximation
    const theoreticalMaxHeight = nilWindHeight * windFactor;

    setParameters((prev) => ({
      ...prev,
      theroreticalMaxHeight: Math.round(theoreticalMaxHeight),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    parameters.cableLength,
    parameters.surfaceWind.speed,
    parameters.twoThousandFtWind.speed,
  ]);

  //update headwind and crosswind components
  useEffect(() => {
    const { headwind, crosswind } = calculateWindComponents(
      parameters.surfaceWind.speed,
      parameters.surfaceWind.direction,
      parameters.RWYHeading,
    );

    setParameters((prev) => ({
      ...prev,
      headWindComponent: Math.round(headwind),
      crossWindComponent: Math.round(crosswind),
    }));
  }, [parameters.surfaceWind, parameters.RWYHeading, setParameters]);

  useEffect(() => {
    setView([parameters.viewLocation.lat, parameters.viewLocation.lng]);
  }, [parameters.viewLocation, setParameters]);

  //use Parameters type
  const MapEventHandler = ({
    setParameters,
  }: {
    setParameters: React.Dispatch<React.SetStateAction<Parameters>>;
  }) => {
    useMapEvent("moveend", (event) => {
      const map = event.target; // Get the map instance
      const center = map.getCenter(); // Get the new center
      const zoom = map.getZoom(); // Get the new zoom level

      // Update the parameters with the new center and zoom
      setParameters((prev) => ({
        ...prev,
        viewLocation: { lat: center.lat, lng: center.lng },
        zoomLevel: zoom,
      }));
    });

    return null;
  };

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <MapContainer
        center={view}
        zoom={parameters.zoomLevel}
        style={{ height: "100%", width: "100%" }}>
        <UpdateMapView center={view} />
        <MapEventHandler setParameters={setParameters} />
        <GeolocationControl />

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
            html: `<div style="background:rgba(255, 255, 255, 0.47);padding:2px 8px;border-radius:4px;border:1px solid #cdcdcdff;font-size:12px;color:#000;white-space:nowrap;">
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
          pathOptions={{ color: "black", weight: 2 }}
          interactive={false}
        />
        {/* Heading label */}
        {(() => {
          const { winchLocation, launchPoint } = parameters;
          const midLat = (winchLocation.lat + launchPoint.lat) / 2;
          const midLng = (winchLocation.lng + launchPoint.lng) / 2;

          const boxHeading =
            parameters.RWYHeading < 180
              ? parameters.RWYHeading + 270
              : parameters.RWYHeading + 90; // Invert if heading is less than 180

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
                ${parameters.RWYHeading.toFixed(0).padStart(3, "0")}° ${
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

        {/* {driftCoordinates2.map((coord, index) => {

            console.log('index', index, 'coord', coord)

          if (index === 7) {

            // console.log('index', index)
            // return null;

          }

          return (
            <Marker
              key={index}
              position={{
                lat: coord.start.lat,
                lng: coord.start.lng,
              }}
              icon={L.divIcon({
                className: "custom-icon",
                html: `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
               <circle cx="10" cy="10" r="10" fill="blue" />
             </svg>`,
                iconSize: [20, 20], // Size of the icon
                iconAnchor: [10, 10], // Center the icon at the marker's position
              })}>
              <Tooltip title={"Test"}>
                <span>
                  Distance: {coord.start.lat.toFixed(2)}
                  <br />
                  Height: {coord.start.lng.toFixed(2)}
                </span>
              </Tooltip>
            </Marker>
          );
        })} */}
        <Polyline
          positions={driftCoordinates.map((coord) => [coord.lat, coord.lng])}
          pathOptions={{ color: "white", weight: 2, dashArray: "5, 10" }}
          interactive={false}
        />
        <Polygon
          positions={sausagePolygon.map((coord) => [coord.lat, coord.lng])}
          pathOptions={{
            color: "transparent",
            fillColor: "red",
            fillOpacity: 0.4, // Adjust opacity as needed
          }}
          interactive={false}
        />
        {driftCoordinates2.map((item, index) => (
          <AnimatedPolyline
            key={index}
            positions={[
              [item.start.lat, item.start.lng],
              [item.drift.lat, item.drift.lng],
            ]}
            pathOptions={{
              color: "white",
              weight: 1,
              opacity: 0.7,
              dashArray: "5, 10",
            }}
          />
        ))}
        <style>
          {`
            .leaflet-interactive.animated-dash {
              stroke-dasharray: 2, 6;
              animation: dashmove ${Math.max(
                0.1,
                2 - (parameters.surfaceWind.speed / 20) * 1.9,
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
              (coord) => [coord.lat, coord.lng] as LatLngExpression,
            ),
          ]}
          pathOptions={{
            color: "rgba(255, 0, 0, 0.3)",
            fillColor: "orange",
            fillOpacity: 0.25,
          }}
          interactive={false}
        />
      </MapContainer>
      <WindDialContainer />
      <MapKeyContainer />
    </div>
  );
};

export default Map;
