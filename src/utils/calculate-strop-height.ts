import { launchProfile } from "./launch-profile";

export const calculateStropHeights = (
  cableLength: number,
  releaseHeight: number,
  windSpeed: number = 10,
  customLaunchProfile?: number[]
): { distance: number; height: number }[] => {
  const heightPercentages = [
    0.1, 0.3, 0.35, 0.4, 0.5, 0.65, 0.8, 0.9, 0.95, 1.0,
  ];

  let closestProfile;
  if (customLaunchProfile && customLaunchProfile.length === 10) {
    closestProfile = { wind: "custom", data: customLaunchProfile };
    
  } else {
    // Find the closest wind speed profile
    closestProfile = launchProfile[0];
    for (let i = 1; i < launchProfile.length; i++) {
      if (
        Math.abs(launchProfile[i].wind - windSpeed) <
        Math.abs(closestProfile.wind - windSpeed)
      ) {
        closestProfile = launchProfile[i];
      }
    }
  }

  // Use the closest profile's data for height percentages
  if (closestProfile) {
    heightPercentages.splice(
      0,
      heightPercentages.length,
      ...closestProfile.data
    );
  }


  const data = heightPercentages.map((percentage, index) => {
    const distance = (cableLength / 10) * (index + 1); // Calculate the distance at each 10%
    const height = releaseHeight * percentage; // Calculate the height based on the release height
    return { distance, height };
  });

  // Add distance 0 and height 0 to the start of the heightPercentages
  return [{ distance: 0, height: 0 }, ...data];
};
