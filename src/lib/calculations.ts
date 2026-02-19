import type { PropertyRecord } from "@/data/mockData";
import { getMostRecentTaxRate } from "@/data/taxRates";

export type AssessmentSource = "board" | "certified" | "mailed" | "auto";

export interface AssessmentResult {
  value: number | null;
  type: "Board" | "Certified" | "Mailed" | "None";
  source: "board" | "certified" | "mailed" | "none";
}

export interface TaxCalculationResult {
  pin: string;
  property: PropertyRecord | null;
  found: boolean;
  assessment: AssessmentResult;
  taxRateYear: number | null;
  taxRateValue: number | null;
  estimatedTax: number | null;
  warnings: string[];
  draftInvoiceLineItem: string;
}

export function selectAssessment(
  property: PropertyRecord,
  override: AssessmentSource = "auto"
): AssessmentResult {
  if (override === "board") {
    return {
      value: property.board_tot,
      type: "Board",
      source: "board",
    };
  }
  if (override === "certified") {
    return {
      value: property.certified_tot,
      type: "Certified",
      source: "certified",
    };
  }
  if (override === "mailed") {
    return {
      value: property.mailed_tot,
      type: "Mailed",
      source: "mailed",
    };
  }

  // Requirement 1.2: Hierarchy: Board → Certified → Mailed
  if (property.board_tot !== null) {
    return { value: property.board_tot, type: "Board", source: "board" };
  }
  if (property.certified_tot !== null) {
    return {
      value: property.certified_tot,
      type: "Certified",
      source: "certified",
    };
  }
  if (property.mailed_tot !== null) {
    return { value: property.mailed_tot, type: "Mailed", source: "mailed" };
  }

  return { value: null, type: "None", source: "none" };
}

export function calculateEstimatedTax(
  taxRateValue: number,
  equalizationFactor: number,
  assessmentValue: number
): number {
  // Requirement 1.4: Formula: (tax_rate_value / 100) × equalization_factor × selected_assessment
  return (taxRateValue / 100) * equalizationFactor * assessmentValue;
}

export function analyzePin(
  pin: string,
  properties: Record<string, PropertyRecord>,
  assessmentOverride: AssessmentSource = "auto"
): TaxCalculationResult {
  const property = properties[pin] ?? null;
  const warnings: string[] = [];

  if (!property) {
    return {
      pin,
      property: null,
      found: false,
      assessment: { value: null, type: "None", source: "none" },
      taxRateYear: null,
      taxRateValue: null,
      estimatedTax: null,
      warnings: ["No data found for this PIN in the current dataset."],
      draftInvoiceLineItem: `Fee $___`,
    };
  }

  const assessment = selectAssessment(property, assessmentOverride);

  // Requirement 1.3: Tax rate lookup from neighborhood_code
  const taxRateInfo = getMostRecentTaxRate(property.neighborhood_code);
  const taxRateYear = taxRateInfo?.year ?? property.tax_rate_year;
  const taxRateValue = taxRateInfo?.rate ?? property.tax_rate_value;

  if (!taxRateInfo) {
    warnings.push(`No tax rate found for neighborhood ${property.neighborhood_code} in central lookup. Fell back to mock default.`);
  }

  if (assessment.value === null) {
    warnings.push(
      "No assessment value available (board, certified, and mailed assessments all missing)."
    );
  }
  if (property.board_tot === null) {
    warnings.push("Board of Review assessment not available.");
  }
  if (property.certified_tot === null && property.board_tot === null) {
    warnings.push("Certified assessment not available.");
  }

  const estimatedTax =
    assessment.value !== null
      ? calculateEstimatedTax(
        taxRateValue,
        property.equalization_factor,
        assessment.value
      )
      : null;

  // Requirement 1.5: Draft invoice line-item field
  const draftInvoiceLineItem = `Property Tax Estimate – PIN(s) ${pin} – Fee $___`;

  return {
    pin,
    property,
    found: true,
    assessment,
    taxRateYear,
    taxRateValue,
    estimatedTax,
    warnings,
    draftInvoiceLineItem,
  };
}

export function formatCurrency(value: number | null): string {
  if (value === null) return "N/A";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPercent(value: number | null): string {
  if (value === null) return "N/A";
  return `${value.toFixed(4)}%`;
}

export function generateRequestId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
