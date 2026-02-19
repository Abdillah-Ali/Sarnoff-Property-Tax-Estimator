import React, { useState, useCallback, useRef } from "react";
import Header from "@/components/Header";
import PinInputPanel from "@/components/PinInputPanel";
import AnalysisOptions from "@/components/AnalysisOptions";
import ResultsCard from "@/components/ResultsCard";
import ReportPreview from "@/components/ReportPreview";
import ExportPanel from "@/components/ExportPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  BarChart3,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import {
  analyzePin,
  generateRequestId,
  type AssessmentSource,
  type TaxCalculationResult,
} from "@/lib/calculations";
import { MOCK_PROPERTIES } from "@/data/mockData";

const SESSION_REQUEST_ID = generateRequestId();
const SESSION_CREATED_AT = new Date().toISOString();

const Index = () => {
  // Options state
  const [analyzeCurrentTaxes, setAnalyzeCurrentTaxes] = useState(true);
  const [incomeApproach, setIncomeApproach] = useState(false);
  const [assessmentOverride, setAssessmentOverride] =
    useState<AssessmentSource>("auto");

  // Results state
  const [results, setResults] = useState<TaxCalculationResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = useCallback(
    (pins: string[]) => {
      setIsAnalyzing(true);
      // Simulate a brief async analysis
      setTimeout(() => {
        const analyzed = pins.map((pin) =>
          analyzePin(pin, MOCK_PROPERTIES, assessmentOverride)
        );
        setResults(analyzed);
        setHasAnalyzed(true);
        setIsAnalyzing(false);
        // Scroll to results on mobile
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }, 600);
    },
    [assessmentOverride]
  );

  const validResults = results.filter((r) => r.found);
  const notFoundResults = results.filter((r) => !r.found);
  const taxRateYear = validResults[0]?.property?.tax_rate_year;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Main content */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 lg:gap-8 items-start">
          {/* ===== LEFT COLUMN: Inputs ===== */}
          <aside className="space-y-5">
            {/* PIN Input */}
            <Card className="card-shadow border-border">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-sm font-semibold font-sans flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  PIN Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <PinInputPanel
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                />
              </CardContent>
            </Card>

            {/* Analysis Options */}
            <Card className="card-shadow border-border">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-sm font-semibold font-sans flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Analysis Options
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <AnalysisOptions
                  analyzeCurrentTaxes={analyzeCurrentTaxes}
                  setAnalyzeCurrentTaxes={setAnalyzeCurrentTaxes}
                  incomeApproach={incomeApproach}
                  setIncomeApproach={setIncomeApproach}
                  assessmentOverride={assessmentOverride}
                  setAssessmentOverride={setAssessmentOverride}
                  taxRateYear={taxRateYear}
                />
              </CardContent>
            </Card>
          </aside>

          {/* ===== RIGHT COLUMN: Results ===== */}
          <section ref={resultsRef} className="min-h-[400px]">
            {/* Empty / landing state */}
            {!hasAnalyzed && !isAnalyzing && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  No Analysis Yet
                </h3>
                <p className="text-sm text-muted-foreground font-sans max-w-sm leading-relaxed">
                  Enter one or more Cook County 14-digit PINs on the left, configure your analysis options, and click{" "}
                  <strong>Analyze</strong> to generate results.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-xs">
                  {["Enter PINs", "Set Options", "View Results"].map(
                    (step, i) => (
                      <div key={step} className="flex flex-col items-center gap-1">
                        <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-foreground font-sans">
                          {i + 1}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-sans text-center">
                          {step}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Analyzing state */}
            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center min-h-[400px] rounded-xl border border-border bg-card p-8 text-center">
                <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
                <p className="text-sm font-sans text-muted-foreground">
                  Analyzing PINs…
                </p>
              </div>
            )}

            {/* Results */}
            {hasAnalyzed && !isAnalyzing && (
              <div className="space-y-5">
                {/* Summary bar */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-semibold font-sans text-foreground">
                      {results.length} PIN{results.length !== 1 ? "s" : ""}{" "}
                      analyzed
                    </span>
                    <span
                      className="text-xs font-sans px-2 py-0.5 rounded-full border"
                      style={{ background: "#f0fdf4", color: "#15803d", borderColor: "#bbf7d0" }}
                    >
                      {validResults.length} found
                    </span>
                    {notFoundResults.length > 0 && (
                      <span
                        className="text-xs font-sans px-2 py-0.5 rounded-full border"
                        style={{ background: "#fef2f2", color: "#b91c1c", borderColor: "#fecaca" }}
                      >
                        {notFoundResults.length} not found
                      </span>
                    )}
                  </div>
                  {validResults.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-sans gap-1.5 h-8 text-xs"
                        onClick={() => setShowReport(true)}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Preview Report
                      </Button>
                    </div>
                  )}
                </div>

                {/* Results Cards Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {results.map((r) => (
                    <ResultsCard
                      key={r.pin}
                      result={r}
                      analyzeCurrentTaxes={analyzeCurrentTaxes}
                      incomeApproach={incomeApproach}
                    />
                  ))}
                </div>

                {/* Export Panel */}
                {validResults.length > 0 && (
                  <ExportPanel
                    results={results}
                    analyzeCurrentTaxes={analyzeCurrentTaxes}
                    incomeApproach={incomeApproach}
                    assessmentOverride={assessmentOverride}
                    requestId={SESSION_REQUEST_ID}
                    createdAt={SESSION_CREATED_AT}
                  />
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Report Preview Modal */}
      {showReport && (
        <ReportPreview
          results={results}
          analyzeCurrentTaxes={analyzeCurrentTaxes}
          incomeApproach={incomeApproach}
          requestId={SESSION_REQUEST_ID}
          createdAt={SESSION_CREATED_AT}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
};

export default Index;
