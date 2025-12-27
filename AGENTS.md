# AGENTS.md - Treadmill Monitor

This document provides essential information for AI assistants working with the Treadmill Monitor project.

## Project Overview

Treadmill Monitor is a web-based application that:

1. Connects to Bluetooth-enabled treadmills with FTMS (Fitness Machine Service) support
2. Monitors and controls the treadmill based on heart rate data
3. Manages heart rate-based training and workout programs
4. Supports importing/exporting workout data in JSON format

The app is designed as a progressive web application (PWA) that can be installed on mobile devices.

## Project Structure

```
treadmill-monitor/
├── css/                # CSS stylesheets for app appearance
│   ├── monitor.css     # Main app styling
│   └── overlay.css     # Overlay UI components
├── icons/              # App icons for PWA installation (various sizes)
├── js/                 # JavaScript modules
│   ├── HeartRateTraining.js    # Heart rate control algorithms
│   ├── HrMonitor.js            # Heart rate data handling
│   ├── TreadmillCommands.js    # Commands to control treadmill
│   ├── TreadmillControl.js     # Bluetooth connection to treadmill
│   ├── Workout.js              # Workout data structures
│   ├── WorkoutParser.js        # Parsing workout definitions
│   └── hr-training.js          # Main application entry point
├── index.html          # Main HTML page
├── manifest.json       # PWA manifest for installation
├── sw.js               # Service worker for offline functionality
├── example-workout.json  # Example workout definition
└── workout-schema.json   # JSON schema for workout format
```

## Core Concepts

### Treadmill Communication

The application communicates with treadmills using the Web Bluetooth API and Fitness Machine Service (FTMS) standard:

- `TreadmillControl.js` handles the Bluetooth connection and FTMS data parsing
- `TreadmillCommands.js` sends commands to adjust treadmill speed and incline

### Heart Rate Training

Heart rate-based training is the core feature:

- `HeartRateTraining.js` implements the control algorithm that adjusts treadmill speed/incline based on user's heart rate
- System automatically speeds up/slows down to keep the user in their target heart rate zone

### Workout Structure

Workouts are defined as a series of segments, each with their own parameters:

- Heart Rate Segments: Target a specific heart rate zone
- Manual Segments: Fixed speed and incline values
- Each segment has a duration, and parameters for speed/incline control

### User Interface

The app has several screens:
- Welcome screen with options to create, load, or import workouts
- Workout builder screen to create custom workouts
- Running interface showing real-time workout data
- Post-workout summary screen with export options

### Data Storage and Export

- Workouts are stored in browser localStorage
- Completed workouts can be exported as TCX files for Garmin Connect
- Raw workout data can be exported as JSON

## Development Commands

The project is a standard web application without build tools. There's no specific build/test pipeline. To run the app:

1. Serve the files with any HTTP server
2. Open in a browser that supports Web Bluetooth API (Chrome/Edge)

## Key Files and Components

1. **HeartRateTraining.js** - Implements the heart rate control algorithm
   - Monitors heart rate data and adjusts treadmill parameters
   - Controls "ramping" (smooth speed/incline transitions between segments)

2. **TreadmillControl.js** - Handles Bluetooth communication
   - Connects to FTMS-compatible treadmills
   - Parses incoming data (speed, incline, heart rate, etc.)
   - Detects treadmill status (running, stopped, etc.)

3. **hr-training.js** - Main application file
   - Coordinates workout execution
   - Handles UI state management
   - Processes treadmill data updates
   - Manages workout logging and export

4. **workout-schema.json** - Defines the JSON schema for workout definitions
   - Describes the format for creating/importing workouts
   - Enables validation of user-provided workout data

## Code Patterns and Conventions

### Event Handling

The code uses handler registration pattern for events:
- `addDataHandler()` - Register handlers for treadmill data
- `addStatusChangeHandler()` - Register handlers for treadmill status changes

### Class Structure

Most functionality is encapsulated in ES6 classes:
- Classes have a clear responsibility (control, data parsing, etc.)
- Constructor patterns initialize state
- Methods provide functionality for specific operations

### Data Flow

1. Treadmill data flows from Bluetooth → TreadmillControl → data handlers
2. Heart rate data triggers adjustments in HeartRateTraining
3. Commands flow from HeartRateTraining → TreadmillCommands → Bluetooth

### State Management

- App uses the browser's localStorage for persistent data
- PWA features like caching and offline support are implemented in the service worker
- UI state is managed through DOM manipulation and screen toggling

## Gotchas and Important Notes

1. **Web Bluetooth Compatibility**
   - The Web Bluetooth API is not supported in all browsers
   - Requires secure context (HTTPS or localhost)
   - iOS requires the Bluefy browser app

2. **Treadmill Compatibility**
   - Only works with Bluetooth-enabled treadmills that support FTMS
   - The app is specifically tested with Decathlon Domyos T900D treadmills

3. **Wake Lock API**
   - Uses Wake Lock API to prevent device sleep during workouts
   - This is a relatively new API with limited browser support

4. **Heart Rate Detection Logic**
   - The heart rate training algorithm is tuned based on segment duration
   - Algorithm parameters (adjustment sizes, timeouts) differ for short, medium, and long segments

5. **PWA Installation**
   - The app supports installation as a PWA on supported devices
   - Service worker handles offline caching of resources

## Adding New Features

When adding new features, consider these aspects:

1. **Bluetooth Compatibility**
   - Changes to Bluetooth communication must follow FTMS standard
   - Test with multiple treadmill models if possible

2. **Workout Segments**
   - If adding new segment types, update the workout schema and parser
   - Ensure backward compatibility with existing workout files

3. **UI Additions**
   - Follow the existing responsive design patterns
   - Support both dark and light themes

4. **Data Export**
   - Ensure any new data points are included in TCX/JSON exports
   - Maintain compatibility with Garmin Connect and other platforms

## Useful Resources

- [Web Bluetooth API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- [FTMS Specification](https://www.bluetooth.com/specifications/specs/fitness-machine-service-1-0/)
- [TCX File Format](https://developer.garmin.com/fit/protocol/)
- [Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)