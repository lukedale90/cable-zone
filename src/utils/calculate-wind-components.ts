export const calculateWindComponents = (
  windSpeed: number,
  windDirection: number,
  runwayHeading: number
): { headwind: number; crosswind: number } => {
  const windDirectionTo = (windDirection - runwayHeading + 360) % 360;
  const windDirectionToRad = (windDirectionTo * Math.PI) / 180;
  const headwind = windSpeed * Math.cos(windDirectionToRad); // Headwind/Tailwind component (North-South)
  const crosswind = windSpeed * Math.sin(windDirectionToRad); // Crosswind component (East-West)

  return { headwind: headwind, crosswind: crosswind };
};
