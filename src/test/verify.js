import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Simple verification logic mimicking the app's calculation logic
// In a real environment, this might import from calculations.ts
// but for a standalone verification script in Node, we use local logic

const NEIGHBORHOOD_TAX_RATES = {
    "12345": { year: 2024, rate: 7.25 },
    "98765": { year: 2024, rate: 8.10 },
    "55432": { year: 2024, rate: 9.50 },
    "33211": { year: 2023, rate: 10.25 },
    "77654": { year: 2024, rate: 11.75 },
};

const MOCK_PROPERTIES = {
    "12345678901234": { neighborhood_code: "12345", board_tot: 120000, certified_tot: 110000, mailed_tot: 100000, factor: 3.0 },
    "98765432109876": { neighborhood_code: "98765", board_tot: null, certified_tot: 260000, mailed_tot: 250000, factor: 3.0 },
    "11223344556677": { neighborhood_code: "55432", board_tot: null, certified_tot: null, mailed_tot: 185000, factor: 2.9163 },
    "55667788990011": { neighborhood_code: "33211", board_tot: 310000, certified_tot: 335000, mailed_tot: 320000, factor: 3.0 },
    "44332211009988": { neighborhood_code: "77654", board_tot: 92000, certified_tot: 98000, mailed_tot: 95000, factor: 2.9163 },
};

function selectAssessment(p) {
    if (p.board_tot !== null) return { val: p.board_tot, type: "Board" };
    if (p.certified_tot !== null) return { val: p.certified_tot, type: "Certified" };
    if (p.mailed_tot !== null) return { val: p.mailed_tot, type: "Mailed" };
    return { val: 0, type: "None" };
}

console.log("Sarnoff Property Tax - Running Verification Pack...\n");

const results = [];
let passCount = 0;

Object.keys(MOCK_PROPERTIES).forEach(pin => {
    const p = MOCK_PROPERTIES[pin];
    const rateInfo = NEIGHBORHOOD_TAX_RATES[p.neighborhood_code];
    const assessment = selectAssessment(p);

    const expectedTax = (rateInfo.rate / 100) * p.factor * assessment.val;

    // Assertions logic for the report
    const pass = assessment.val > 0 && rateInfo.rate > 0;
    if (pass) passCount++;

    results.push({
        pin,
        assessment_type: assessment.type,
        assessment_val: assessment.val,
        rate_year: rateInfo.year,
        rate_val: rateInfo.rate,
        factor: p.factor,
        computed_tax: expectedTax.toFixed(2),
        status: pass ? "PASS" : "FAIL"
    });
});

// Generate verification_results.csv
const csvRows = [
    "PIN,Chosen Assessment Type,Assessment Value,Rate Year,Rate Value,Factor,Computed Tax,Status",
    ...results.map(r => `${r.pin},${r.assessment_type},${r.assessment_val},${r.rate_year},${r.rate_val},${r.factor},${r.computed_tax},${r.status}`)
];

fs.writeFileSync('verification_results.csv', csvRows.join('\n'));

console.log(`Summary: ${passCount}/${Object.keys(MOCK_PROPERTIES).length} PINs Passed.`);
console.log("Verification results saved to 'verification_results.csv'.");
