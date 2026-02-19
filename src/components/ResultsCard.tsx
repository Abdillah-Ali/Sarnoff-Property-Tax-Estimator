import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MapPin,
  Hash,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TaxCalculationResult } from "@/lib/calculations";
import { formatCurrency } from "@/lib/calculations";
import { cn } from "@/lib/utils";

interface ResultsCardProps {
  result: TaxCalculationResult;
  analyzeCurrentTaxes: boolean;
  incomeApproach: boolean;
}

const assessmentSourceStyle: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  board: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  certified: { bg: "#faf5ff", text: "#7e22ce", border: "#e9d5ff" },
  mailed: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  none: { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
};

const assessmentValueStyle: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  board: { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
  certified: { bg: "#faf5ff", text: "#6b21a8", border: "#e9d5ff" },
  mailed: { bg: "#fff7ed", text: "#9a3412", border: "#fed7aa" },
};

const ResultsCard: React.FC<ResultsCardProps> = ({
  result,
  analyzeCurrentTaxes,
  incomeApproach,
}) => {
  const { pin, property, found, assessment, estimatedTax, warnings } = result;

  if (!found) {
    return (
      <Card className="card-shadow border-destructive/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-sans font-semibold text-foreground">
              <span className="font-mono">{pin}</span>
            </CardTitle>
            <Badge variant="destructive" className="shrink-0 text-xs font-sans">
              <XCircle className="w-3 h-3 mr-1" />
              Not Found
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground font-sans">
            No data found for this PIN in the current dataset. Please verify the
            PIN and try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  const hasWarnings = warnings.length > 0;
  const srcStyle = assessmentSourceStyle[assessment.source] ?? assessmentSourceStyle.none;

  return (
    <Card className="card-shadow border-border overflow-hidden">
      {/* PIN Header */}
      <CardHeader className="pb-3 border-b border-border bg-secondary/30">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <p className="text-xs text-muted-foreground font-sans uppercase tracking-wide mb-0.5">
              PIN
            </p>
            <CardTitle className="text-base font-mono font-bold text-foreground">
              {pin}
            </CardTitle>
          </div>
          {hasWarnings ? (
            <span
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold font-sans border"
              style={{ background: "#fffbeb", color: "#b45309", borderColor: "#fde68a" }}
            >
              <AlertTriangle className="w-3 h-3" />
              Warning
            </span>
          ) : (
            <span
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold font-sans border"
              style={{ background: "#f0fdf4", color: "#15803d", borderColor: "#bbf7d0" }}
            >
              <CheckCircle2 className="w-3 h-3" />
              Valid
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Property Info */}
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-sans uppercase tracking-wide">
                Address
              </p>
              <p className="text-sm font-sans font-medium text-foreground">
                {property!.address}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground font-sans uppercase tracking-wide">
                Township
              </p>
              <p className="text-sm font-sans text-foreground">
                {property!.township}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-sans uppercase tracking-wide flex items-center gap-1">
                <Hash className="w-3 h-3" /> Nbhd Code
              </p>
              <p className="text-sm font-mono text-foreground">
                {property!.neighborhood_code}
              </p>
            </div>
          </div>
        </div>

        {/* Assessment & Tax Data */}
        {analyzeCurrentTaxes && (
          <>
            <div className="border-t border-border pt-3">
              <p className="text-xs font-semibold font-sans uppercase tracking-wide text-muted-foreground mb-2">
                Assessment Data
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-sans">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Selected Value
                  </p>
                  <p className="font-semibold text-foreground">
                    {formatCurrency(assessment.value)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Source
                  </p>
                  <span
                    className="inline-block text-xs font-medium px-2 py-0.5 rounded border font-sans"
                    style={{
                      background: srcStyle.bg,
                      color: srcStyle.text,
                      borderColor: srcStyle.border,
                    }}
                  >
                    {assessment.type}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Tax Rate Year
                  </p>
                  <p className="font-medium text-foreground">
                    {property!.tax_rate_year}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Tax Rate
                  </p>
                  <p className="font-medium text-foreground">
                    {property!.tax_rate_value}%
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    Equalization Factor
                  </p>
                  <p className="font-medium text-foreground">
                    {property!.equalization_factor.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>

            {/* Calculation Formula */}
            {assessment.value !== null && (
              <div className="rounded-md bg-muted/40 border border-border px-3 py-2">
                <p className="text-[10px] font-sans text-muted-foreground uppercase tracking-wider mb-1">
                  Calculation
                </p>
                <p className="text-xs font-mono text-foreground">
                  ({property!.tax_rate_value}% ÷ 100) ×{" "}
                  {property!.equalization_factor.toFixed(4)} ×{" "}
                  {formatCurrency(assessment.value)}
                </p>
              </div>
            )}

            {/* Estimated Tax Highlight */}
            <div className="estimated-tax-display rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-primary-foreground/70" />
                <p className="text-xs font-sans text-primary-foreground/70 uppercase tracking-widest">
                  Estimated Annual Taxes
                </p>
              </div>
              <p className="text-2xl font-bold text-primary-foreground tracking-tight">
                {estimatedTax !== null ? formatCurrency(estimatedTax) : "N/A"}
              </p>
            </div>
          </>
        )}

        {/* Income Approach Note */}
        {incomeApproach && (
          <div className="rounded-md border border-dashed border-accent/40 bg-accent/5 p-3">
            <p className="text-xs font-sans font-semibold text-foreground mb-0.5">
              Income Approach: Noted
            </p>
            <p className="text-xs text-muted-foreground font-sans">
              Income approach analysis flagged for this property. Full
              capitalization analysis available in extended report.
            </p>
          </div>
        )}

        {/* Warnings */}
        {hasWarnings && (
          <div className="rounded-md border p-3 space-y-1" style={{ borderColor: "#fde68a", background: "#fffbeb" }}>
            <p className="text-xs font-semibold font-sans flex items-center gap-1" style={{ color: "#b45309" }}>
              <AlertTriangle className="w-3.5 h-3.5" />
              Warnings
            </p>
            {warnings.map((w, i) => (
              <p key={i} className="text-xs font-sans" style={{ color: "#78716c" }}>
                • {w}
              </p>
            ))}
          </div>
        )}

        {/* Available Assessments Summary */}
        <div className="border-t border-border pt-3">
          <p className="text-xs text-muted-foreground font-sans uppercase tracking-wide mb-2">
            Available Assessments
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-xs font-sans">
            {(
              [
                { label: "Board", value: property!.board_tot, key: "board" },
                { label: "Certified", value: property!.certified_tot, key: "certified" },
                { label: "Mailed", value: property!.mailed_tot, key: "mailed" },
              ] as const
            ).map(({ label, value, key }) => {
              const style = value !== null
                ? assessmentValueStyle[key]
                : { bg: "hsl(var(--muted)/0.4)", text: "hsl(var(--muted-foreground))", border: "hsl(var(--border))" };
              return (
                <div
                  key={label}
                  className="rounded border p-1.5 text-center"
                  style={{
                    background: value !== null ? style.bg : undefined,
                    color: value !== null ? style.text : undefined,
                    borderColor: value !== null ? style.border : undefined,
                  }}
                >
                  <p className="font-medium text-[10px] uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="font-mono text-[11px] mt-0.5">
                    {value !== null ? `$${value.toLocaleString()}` : "N/A"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsCard;
