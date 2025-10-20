export const calculateDriftCoordinates = (
  startLat: number,
  startLng: number,
  driftX: number,
  driftY: number
): { lat: number; lng: number } => {
  const latOffset = driftY / 111320; // Convert driftY to latitude offset
  const lngOffset = driftX / (111320 * Math.cos((startLat * Math.PI) / 180)); // Convert driftX to longitude offset

  return {
    lat: startLat + latOffset,
    lng: startLng + lngOffset,
  };
};

export const calculateIntervalPositions = (
  winchLat: number,
  winchLng: number,
  launchLat: number,
  launchLng: number
): { lat: number; lng: number }[] => {
  const positions = Array.from({ length: 11 }, (_, index) => {
    const percentage = (index + 1) / 11; // 10%, 20%, ..., 100%
    const lat = winchLat + (launchLat - winchLat) * percentage;
    const lng = winchLng + (launchLng - winchLng) * percentage;
    return { lat, lng };
  });

  // Add the launch point as the first point
  const data = [ ...positions, { lat: launchLat, lng: launchLng }];

  return data;
};