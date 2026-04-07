# Strop Drop Visualiser

A React-based web application designed to assist glider pilots and operation supervisors in calculating and visualising the likely impact areas for cable strop drops during winch launch operations.

## Overview

The Strop Drop Visualiser provides a safety tool for gliding operations by predicting where a cable strop will land if a weak link fails during a winch launch. The application uses physics-based calculations combined with real-time wind data to generate visual drop zones on an interactive map.

## Key Features

### 🎯 Interactive Map Visualization
- Drag-and-drop winch and launch point positioning
- Real-time strop drop zone calculations
- Visual safety margins and impact areas
- Responsive design for desktop and mobile use

### 🌪️ Dynamic Wind Analysis
- Surface and 2000ft wind input controls
- Real-time crosswind component calculations
- Wind gradient modeling throughout launch height
- Visual wind dial with directional indicators

### 📊 Advanced Launch Profiles
- Dynamic S-curve launch profiles based on wind conditions
- Interactive Chart.js visualizations
- Real-time profile adjustments

### ⚙️ Comprehensive Parameter Controls
- Launch height adjustment (100-3000ft)
- Wind speed and direction controls
- Strop characteristics (weight, diameter, length)
- Safety buffer configuration
- Custom launch profile support

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI)
- **Mapping**: Leaflet with OpenStreetMap
- **Charts**: Chart.js with react-chartjs-2
- **Deployment**: GitHub Pages with GitHub Actions

## Physics Model

The application uses simplified physics to simulate strop drop behavior:

- **Drop Speed**: Based on 2FTS and RAFGSA data (≈20m/s average)
- **Wind Gradient**: Linear interpolation between surface and 2000ft conditions
- **Safety Margin**: 25% buffer applied to all calculations
- **Launch Profiles**: Dynamic S-curves influenced by wind conditions

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/lukedale90/cable-zone.git
cd cable-zone

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_APP_ORGANIZATION="" 
VITE_BASE_URL="/cable-zone/"
```

or the 2FTS version

```env
VITE_APP_ORGANIZATION="2fts" 
VITE_BASE_URL="/strop-drop/"
```

## Deployment

The application is configured for automated deployment to GitHub Pages:

1. Push to main branch triggers GitHub Actions workflow
2. Builds the application with production settings
3. Deploys to GitHub Pages automatically

### Manual Deployment

```bash
npm run build
npm run preview
```

## Usage

1. **Set Launch Parameters**: Adjust winch location, launch point, and release height
2. **Configure Wind Conditions**: Input surface and 2000ft wind speed/direction
3. **Analyze Results**: View calculated drop zones and safety areas on the map
4. **Adjust Settings**: Fine-tune strop characteristics and safety margins

## Safety Notice

⚠️ **Important**: This tool provides estimated calculations for planning purposes only. Always follow established safety procedures and local regulations for gliding operations. Actual strop drop locations may vary due to factors not modeled in this simulation.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is available under a dual licensing structure:

### Open Source License (MIT)
For open source projects, educational use, and personal projects, this software is available under the MIT License. See the [LICENSE](LICENSE) file for full details.

### Commercial License
For commercial aviation operations, flight training organizations, or proprietary applications, a commercial license is available. This provides:
- Extended liability coverage for aviation use
- Priority support and custom features
- Compliance with commercial aviation standards
- Rights to modify and distribute without open source obligations

See [COMMERCIAL-LICENSE.md](COMMERCIAL-LICENSE.md) for pricing and terms, or contact LukeDale90@gmail.com for more information.

### Which License Should I Choose?
- **MIT License**: Free for open source projects, educational use, and personal applications
- **Commercial License**: Required for commercial aviation operations or when incorporating into proprietary products

## Contact

For questions or support, please contact: LukeDale90@gmail.com
