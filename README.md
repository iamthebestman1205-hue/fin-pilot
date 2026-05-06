# FinPilot

FinPilot is an Expo React Native frontend demo for an AI investing explanation app.

## Pages

- Market
- Watchlist search
- Stock tracked list
- Portfolio

## Components

- `Card`
- `SectionTitle`
- `MarketWeatherCard`
- `ImpactBreakdownCard`
- `RiskTemperatureCard`
- `StockStatusCard`
- `PortfolioHealthCard`
- `TimelineCard`
- `StockSearchResultCard`
- `DailyAiNewsCard`
- `StockForecastCard`

## Current demo features

- Use Watchlist as the Taiwan stock search page
- Use Stock as the tracked stock dashboard
- Tap any tracked stock to open its own detail page
- Each tracked stock has a weather-forecast style risk outlook
- Add or remove tracked stocks locally
- Show simulated daily AI news for each tracked stock
- Simulated daily news, stock status, and risk temperature change by date
- Includes demo entries for `00646` and `009810`
- Mock search list now includes dozens of common Taiwan stocks and ETFs
- Prepare the UI shape for future API, news, and scheduled AI updates

## Run with Expo SDK 54

```bash
npm install
npx expo install expo@~54.0.0 --fix
npx expo start --tunnel -c
```

If you do not need tunnel mode:

```bash
npm run start
```

## Web demo

FinPilot can be deployed as a hosted web demo first, then packaged as a mobile app later.

Local web preview:

```bash
npm install
npm run web
```

Static web build:

```bash
npm run build:web
```

The web build outputs to `dist/`.

## Deploy to Vercel

1. Push this project to GitHub.
2. Import the GitHub repo in Vercel.
3. Vercel will use `vercel.json`:
   - Build command: `npm run build:web`
   - Output directory: `dist`
   - Quote proxy: `/api/twse-quotes`

The quote proxy is needed because browsers may block direct TWSE requests with CORS.

## Later mobile app

The same Expo project can later become an iOS/Android app with EAS Build:

```bash
npx eas build --platform ios
npx eas build --platform android
```
