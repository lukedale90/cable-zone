export const calculateAverageDirection = (surfaceDirection: number, twoThousandFtDirection: number) => {
  const surfaceDirectionRad = (surfaceDirection * Math.PI) / 180;
  const twoThousandFtDirectionRad = (twoThousandFtDirection * Math.PI) / 180;

  const x = Math.cos(surfaceDirectionRad) + Math.cos(twoThousandFtDirectionRad);
  const y = Math.sin(surfaceDirectionRad) + Math.sin(twoThousandFtDirectionRad);

  const avgDirectionRad = Math.atan2(y, x);
  return (avgDirectionRad * 180) / Math.PI >= 0
    ? (avgDirectionRad * 180) / Math.PI
    : (avgDirectionRad * 180) / Math.PI + 360;
};