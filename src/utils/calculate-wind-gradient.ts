export const calculateWindGradient = (
  surfaceWind: number,
  windAt2000ft: number,
  surfaceDirection: number,
  directionAt2000ft: number,
  launchHeight: number
): { height: number; windSpeed: number; windDirection: number }[] => {
  const normalizeAngle = (angle: number) => (angle + 360) % 360;

  const interpolateDirection = (start: number, end: number, factor: number) => {
    const diff = normalizeAngle(end - start);
    const shortestDiff = diff > 180 ? diff - 360 : diff; // Adjust to shortest path
    const interpolated = start + shortestDiff * factor;

    // Ensure symmetry: wrap back if the difference exceeds 180°
    return normalizeAngle(interpolated);
  };

  const data = Array.from({ length: 10 }, (_, index) => {
    const height = (launchHeight / 10) * (index + 1); // Calculate height at each 10%
    const windSpeed =
      surfaceWind + (height / 2000) * (windAt2000ft - surfaceWind); // Interpolate wind speed

    const windDirection = interpolateDirection(
      surfaceDirection,
      directionAt2000ft,
      height / 2000
    ); // Interpolate direction along the shortest path


    return { height, windSpeed, windDirection };
  });

  return data;

};