export const staticLaunchProfiles = [
  { wind: 0, title: 'Nil Wind', data: [0.0, 0.08, 0.17, 0.3, 0.49, 0.7, 0.85, 0.92, 0.96, 1.0] },
  { wind: 5, title: 'Calm Wind', data: [0.03, 0.11, 0.21, 0.34, 0.52, 0.72, 0.87, 0.94, 0.97, 1.0] },
  { wind: 10, title: 'Light Wind', data: [0.05, 0.14, 0.25, 0.38, 0.55, 0.75, 0.9, 0.96, 0.98, 1.0] },
  { wind: 15, title: 'Moderate Wind', data: [0.08, 0.18, 0.30, 0.42, 0.59, 0.78, 0.92, 0.97, 0.99, 1.0] },
  { wind: 20, title: 'Strong Wind', data: [0.1, 0.23, 0.35, 0.47, 0.64, 0.82, 0.95, 0.985, 0.995, 1.0] },
];

/**
 * Generates a dynamic S-curve launch profile based on surface and upper wind conditions
 * @param surfaceWind - Wind speed at surface level (knots)
 * @param upperWind - Wind speed at 2000ft (knots) 
 * @returns Array of height fractions representing the launch profile
 */
export function generateDynamicLaunchProfile(surfaceWind: number, upperWind: number): number[] {
  const steps = 10; // Number of data points (0% to 100% in 10% increments)
  const profile: number[] = [];
  
  // Normalize wind speeds (0-50 knots range)
  const normalizedSurface = Math.max(0, Math.min(surfaceWind / 50, 1));
  const normalizedUpper = Math.max(0, Math.min(upperWind / 50, 1));
  
  // S-curve parameters
  // Surface wind affects early climb steepness (bottom of S-curve)
  const earlyClimbFactor = 1 + (normalizedSurface * 2); // 1-3 range
  
  // Upper wind affects when peak altitude is reached (top of S-curve) 
  const lateClimbFactor = 1 + (normalizedUpper * 2); // 1-3 range
  
  // Inflection point - where the curve transitions from accelerating to decelerating
  const inflectionPoint = 0.5 - (normalizedUpper * 0.2) + (normalizedSurface * 0.1);
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 to 1
    
    // Create S-curve using modified sigmoid function
    // Split into two phases: before and after inflection point
    let height: number;
    
    if (t <= inflectionPoint) {
      // Early phase - influenced by surface wind
      const adjustedT = t / inflectionPoint;
      height = Math.pow(adjustedT, 2 / earlyClimbFactor) * inflectionPoint;
    } else {
      // Late phase - influenced by upper wind  
      const adjustedT = (t - inflectionPoint) / (1 - inflectionPoint);
      const remainingHeight = 1 - inflectionPoint;
      
      // Use inverse power function for deceleration
      height = inflectionPoint + remainingHeight * (1 - Math.pow(1 - adjustedT, lateClimbFactor));
    }
    
    // Ensure we start at 0 and end at 1
    if (i === 0) height = 0;
    if (i === steps) height = 1;
    
    // Apply some smoothing to avoid sharp transitions
    profile.push(Math.max(0, Math.min(1, height)));
  }

  //remove first as we don't care for zero;
  profile.shift();

  return profile;
}

/**
 * Generates multiple launch profiles for comparison, including the dynamic one
 * @param surfaceWind - Current surface wind speed
 * @param upperWind - Current upper wind speed  
 * @returns Array of launch profiles including static references and dynamic profile
 */
export function generateLaunchProfiles(surfaceWind: number, upperWind: number) {
  const profiles = [
    // Static reference profiles
    ...staticLaunchProfiles,
    // Dynamic profile based on current conditions
    {
      wind: surfaceWind,
      title: `Dynamic (Surface: ${surfaceWind}kts, Upper: ${upperWind}kts)`,
      data: generateDynamicLaunchProfile(surfaceWind, upperWind),
      isDynamic: true,
    }
  ];
  
  return profiles;
}

// Backward compatibility - default export for existing code
export const launchProfile = staticLaunchProfiles;
