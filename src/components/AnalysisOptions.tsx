import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AssessmentSource } from "@/lib/calculations";
import { Info } from "lucide-react";

interface AnalysisOptionsProps {
  analyzeCurrentTaxes: boolean;
  setAnalyzeCurrentTaxes: (v: boolean) => void;
  incomeApproach: boolean;
  setIncomeApproach: (v: boolean) => void;
  assessmentOverride: AssessmentSource;
  setAssessmentOverride: (v: AssessmentSource) => void;
  taxRateYear?: number;
}

const AnalysisOptions: React.FC<AnalysisOptionsProps> = ({
  analyzeCurrentTaxes,
  setAnalyzeCurrentTaxes,
  incomeApproach,
  setIncomeApproach,
  assessmentOverride,
  setAssessmentOverride,
  taxRateYear,
}) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Toggle: Analyze Current Taxes */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <Label
            htmlFor="analyze-taxes"
            className="text-sm font-semibold font-sans text-foreground cursor-pointer"
          >
            Analyze Current Taxes
          </Label>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            Calculate estimated property tax based on assessed value and current
            tax rate.
          </p>
        </div>
        <Switch
          id="analyze-taxes"
          checked={analyzeCurrentTaxes}
          onCheckedChange={setAnalyzeCurrentTaxes}
          className="mt-0.5 shrink-0"
        />
      </div>

      {/* Toggle: Income Approach */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <Label
            htmlFor="income-approach"
            className="text-sm font-semibold font-sans text-foreground cursor-pointer"
          >
            Perform Income Approach Analysis
          </Label>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            Apply income capitalization methodology alongside the assessment
            analysis.
          </p>
        </div>
        <Switch
          id="income-approach"
          checked={incomeApproach}
          onCheckedChange={setIncomeApproach}
          className="mt-0.5 shrink-0"
        />
      </div>

      <div className="border-t border-border" />

      {/* Assessment Source Override */}
      <div>
        <Label className="text-sm font-semibold font-sans text-foreground block mb-1.5">
          Assessment Source
        </Label>
        <p className="text-xs text-muted-foreground font-sans mb-2">
          Auto-selects Board → Certified → Mailed by hierarchy. Override if
          needed.
        </p>
        <Select
          value={assessmentOverride}
          onValueChange={(v) => setAssessmentOverride(v as AssessmentSource)}
        >
          <SelectTrigger className="w-full font-sans text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto" className="font-sans text-sm">
              Auto (Board → Certified → Mailed)
            </SelectItem>
            <SelectItem value="board" className="font-sans text-sm">
              Board of Review
            </SelectItem>
            <SelectItem value="certified" className="font-sans text-sm">
              Certified Assessment
            </SelectItem>
            <SelectItem value="mailed" className="font-sans text-sm">
              Mailed Assessment
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tax Rate Year Info */}
      {taxRateYear && (
        <div className="flex items-start gap-2 rounded-md bg-secondary/60 border border-border p-3">
          <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-sans font-semibold text-foreground">
              Tax Rate Year: {taxRateYear}
            </p>
            <p className="text-xs text-muted-foreground font-sans">
              Tax rate year is determined per-property from the dataset.
            </p>
          </div>
        </div>
      )}

      {incomeApproach && (
        <div className="rounded-md border border-dashed border-accent/50 bg-accent/5 p-3">
          <p className="text-xs font-sans font-semibold text-foreground mb-0.5">
            Income Approach: Enabled
          </p>
          <p className="text-xs text-muted-foreground font-sans">
            Income capitalization analysis will be noted in the report. Full
            income approach inputs (NOI, cap rate) are available in the
            extended analysis module.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalysisOptions;
