export const calculateStropDrift = (
  stropWeight: number, // in kilograms
  stropDiameter: number, // in meters
  stropLength: number, // in meters
  stropHeights: { distance: number; height: number }[], // Heights at each 10% interval (in feet)
  windData: { height: number; windSpeed: number; windDirection: number }[] // Wind data at each 10% interval
): { distance: number; driftX: number; driftY: number }[] => {
//   const g = 9.81; // Gravitational acceleration (m/s²)
//   const rho = 1.225; // Air density (kg/m³)
//   const Cd = 170.25; // Adjusted drag coefficient for a cylinder to better match real-world observations
//   const A = Math.PI * Math.pow(stropDiameter / 2, 2); // Cross-sectional area (m²)

  return stropHeights.map((strop, index) => {
    const heightInMeters = strop.height * 0.3048; // Convert height from feet to meters
    const { windSpeed, windDirection } = windData[index];

    // Convert wind speed from knots to meters per second
    const windSpeedInMetersPerSecond = windSpeed * 0.51444;

    // Convert wind direction to "blowing to" direction
    const windDirectionTo = (windDirection + 180) % 360;
    const windDirectionToRad = (windDirectionTo * Math.PI) / 180;

    // Calculate terminal velocity
    //const terminalVelocity = Math.sqrt((2 * stropWeight * g) / (rho * Cd * A));
    const terminalVelocity = 20;

    // Calculate time to fall
    const timeToFall = heightInMeters / terminalVelocity;

    // Calculate wind components
    const windX = windSpeedInMetersPerSecond * Math.sin(windDirectionToRad); // Crosswind component (East-West)
    const windY = windSpeedInMetersPerSecond * Math.cos(windDirectionToRad); // Headwind/Tailwind component (North-South)

    // Calculate drift in x and y directions
    const driftX = windX * timeToFall;
    const driftY = windY * timeToFall;

    // Log intermediate values for debugging
    console.log({
      windDirection,
      windDirectionTo,
      windSpeed,
      windSpeedInMetersPerSecond,
      height: strop.height,
      heightInMeters,
      terminalVelocity,
      timeToFall,
      windX,
      windY,
      driftX,
      driftY,
    });

    // Return the distance and drift components
    return {
      distance: strop.distance,
      driftX,
      driftY,
    };
  });
};