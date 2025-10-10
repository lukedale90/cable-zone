import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { launchProfile } from "../utils/launch-profile";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LaunchProfileGraph = ({ activeWind, maxHeight, maxCableLength }: { activeWind: number; maxHeight: number; maxCableLength: number }) => {
  const labels = Array.from({ length: 10 }, (_, i) => ((i + 1) * maxCableLength) / 10);

    let closestProfile = launchProfile[0];
  for (let i = 1; i < launchProfile.length; i++) {
    if (Math.abs(launchProfile[i].wind - activeWind) < Math.abs(closestProfile.wind - activeWind)) {
      closestProfile = launchProfile[i];
    }
  }

  const datasets = launchProfile.map((profile) => ({
    label: `Wind ${profile.wind} kts`,
    data: profile.data.map((percentage) => percentage * maxHeight),
    borderColor: profile.wind === closestProfile.wind ? "green" : "rgba(128, 128, 128, 0.5)",
    //backgroundColor: profile.wind === activeWind ? "rgba(0, 128, 0, 0.2)" : "rgba(128, 128, 128, 0.1)",
    borderWidth: 2,
    tension: 0.4,
    pointRadius: 0, // Hide points on the graph
  }));

  const data = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Launch Distance (m)",
        },
        ticks: {
          stepSize: maxCableLength / 10,
        },
      },
      y: {
        title: {
          display: true,
          text: "Height (ft)",
        },
        ticks: {
          stepSize: maxHeight / 10,
        },
        min: 0,
        max: maxHeight,
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "top" as const,
      },
    },
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LaunchProfileGraph;
