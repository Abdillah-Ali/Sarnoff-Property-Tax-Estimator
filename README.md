# Sarnoff Property Tax Estimator

Since 1986, the law firm of Sarnoff Property Tax has secured substantial real estate tax savings for a wide variety of properties throughout Illinois. "Increasing Income by Reducing Property Tax."

## Quick start (≤ 10 minutes)

Requirements: Node.js (v18+) and npm

```sh
# Install dependencies
npm install

# Run the development server
npm run dev
```

The app will be available at [http://localhost:8080](http://localhost:8080).

## Verification Pack

Run the automated verification suite to prove correctness for 5 real PINs as per Requirement 1.7:

```sh
node src/test/verify.js
```

This will output a summary to the console and generate `verification_results.csv` with detailed inputs, chosen assessments, and computed taxes.

## Technologies

- React + Vite + TypeScript
- Tailwind CSS (UI/UX)
- Vitest (Unit Testing)
- Lucide React (Icons)
# Sarnoff-Property-Tax-Estimator
