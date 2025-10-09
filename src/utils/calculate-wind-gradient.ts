export const calculateWindGradient = (
  surfaceWind: number,
  windAt2000ft: number,
  surfaceDirection: number,
  directionAt2000ft: number,
  launchHeight: number
): { height: number; windSpeed: number; windDirection: number }[] => {
  const normalizeAngle = (angle: number) => (angle + 360) % 360;

  return Array.from({ length: 10 }, (_, index) => {
    const height = (launchHeight / 10) * (index + 1); // Calculate height at each 10%
    const windSpeed =
      surfaceWind + (height / 2000) * (windAt2000ft - surfaceWind); // Interpolate wind speed

    const rawDirection =
      surfaceDirection + (height / 2000) * (directionAt2000ft - surfaceDirection); // Interpolate direction
    const windDirection = normalizeAngle(rawDirection); // Normalize to 0°–360°

    return { height, windSpeed, windDirection };
  });
};