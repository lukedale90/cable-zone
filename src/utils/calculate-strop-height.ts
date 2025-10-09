import { launchProfile } from "./launch-profile";

export const calculateStropHeights = (
  cableLength: number,
  releaseHeight: number,
  windSpeed: number = 10
): { distance: number; height: number }[] => {
  const heightPercentages = [0.10, 0.30, 0.35, 0.40, 0.50, 0.65, 0.80, 0.90, 0.95, 1.0];

  // Find the closest wind speed profile
  let closestProfile = launchProfile[0];
  for (let i = 1; i < launchProfile.length; i++) {
    if (Math.abs(launchProfile[i].wind - windSpeed) < Math.abs(closestProfile.wind - windSpeed)) {
      closestProfile = launchProfile[i];
    }
  }

  // Use the closest profile's data for height percentages
  if (closestProfile) {
    heightPercentages.splice(0, heightPercentages.length, ...closestProfile.data);
  }
  return heightPercentages.map((percentage, index) => {
    const distance = (cableLength / 10) * (index + 1); // Calculate the distance at each 10%
    const height = releaseHeight * percentage; // Calculate the height based on the release height
    return { distance, height };
  });
};