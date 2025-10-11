export const calculateTerminalVelocity = (
  stropWeight: number, // in kilograms
  stropDiameter: number, // in meters
  stropLength: number // in meters
): number => {
  const g = 9.81; // Gravitational acceleration (m/s²)
  const airDensity = 1.225; // Air density at sea level (kg/m³)
  const dragCoefficient = 1.2; // Adjusted drag coefficient for a cylinder to better match real-world observations

  // Calculate curved surface area (A = 2πrh)
  const radius = stropDiameter / 2;
  const fullSurfaceArea = 2 * Math.PI * radius * stropLength;

  const bottomSurfaceArea = fullSurfaceArea * 0.5; // flat bottom area exposed to airflow
  const surfaceArea = bottomSurfaceArea * 0.33; // rope will not fall perfectly flat, so use a fraction of the bottom area

  // Calculate terminal velocity (v_t = sqrt((2mg) / (ρC_dA)))
  return Math.sqrt(
    (2 * stropWeight * g) / (airDensity * dragCoefficient * surfaceArea)
  );
};

export const calculateStropDrift = (
  stropWeight: number, // in kilograms
  stropDiameter: number, // in meters
  stropLength: number, // in meters
  stropHeights: { distance: number; height: number }[], // Heights at each 10% interval (in feet)
  windData: { height: number; windSpeed: number; windDirection: number }[], // Wind data at each 10% interval
  safetyBuffer: number // in percentage (e.g., 0.1 for 10%)
): {
  distance: number;
  driftX: number;
  driftY: number;
  minDriftX: number;
  maxDriftX: number;
  minDriftY: number;
  maxDriftY: number;
}[] => {
  const terminalVelocity = calculateTerminalVelocity(
    stropWeight,
    stropDiameter,
    stropLength
  );

  return stropHeights.map((strop) => {
    const heightInMeters = strop.height * 0.3048; // Convert height from feet to meters

    // Find the closest height in windData
    const closestWindData = windData.reduce((prev, curr) => {
      return Math.abs(curr.height - strop.height) < Math.abs(prev.height - strop.height)
        ? curr
        : prev;
    });

    const { windSpeed, windDirection } = closestWindData;

    // Convert wind speed from knots to meters per second
    const windSpeedInMetersPerSecond = windSpeed * 0.51444;

    // Convert wind direction to "blowing to" direction
    const windDirectionTo = (windDirection + 180) % 360;
    const windDirectionToRad = (windDirectionTo * Math.PI) / 180;

    // Calculate time to fall
    const timeToFall = heightInMeters / terminalVelocity;

    // Calculate wind components
    const windX = windSpeedInMetersPerSecond * Math.sin(windDirectionToRad); // Crosswind component (East-West)
    const windY = windSpeedInMetersPerSecond * Math.cos(windDirectionToRad); // Headwind/Tailwind component (North-South)

    // Calculate drift in x and y directions
    const driftX = windX * timeToFall;
    const driftY = windY * timeToFall;

    // Calculate dynamic adjustment factors based on safetyBuffer
    const minFactor = 100 - safetyBuffer; // Decrease by safetyBuffer percentage
    const maxFactor = 100 + safetyBuffer; // Increase by safetyBuffer percentage

    // Adjust min and max drift values dynamically
    const minDriftX = driftX * (minFactor / 100);
    const maxDriftX = driftX * (maxFactor / 100);
    const minDriftY = driftY * (minFactor / 100);
    const maxDriftY = driftY * (maxFactor / 100);

    // Return the distance and drift components
    return {
      distance: strop.distance,
      driftX,
      driftY,
      minDriftX,
      maxDriftX,
      minDriftY,
      maxDriftY,
    };
  });
};
