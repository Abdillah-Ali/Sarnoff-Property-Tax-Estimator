import React, { useState, useCallback, useRef } from "react";
import Header from "@/components/Header";
import PinInputPanel from "@/components/PinInputPanel";
import AnalysisOptions from "@/components/AnalysisOptions";
import ResultsCard from "@/components/ResultsCard";
import ReportPreview from "@/components/ReportPreview";
import ExportPanel from "@/components/ExportPanel";
import TaxRateUploader from "@/components/TaxRateUploader";
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
import { cn } from "@/lib/utils";

const SESSION_REQUEST_ID = generateRequestId();
const SESSION_CREATED_AT = new Date().toISOString();

const Index = () => {
  // Options state
  const [analyzeCurrentTaxes, setAnalyzeCurrentTaxes] = useState(true);
  const [incomeApproach, setIncomeApproach] = useState(false);
  const [assessmentOverride, setAssessmentOverride] =
    useState<AssessmentSource>("auto");
  const [externalTaxRates, setExternalTaxRates] = useState<Record<string, number> | null>(null);

  // Results state
  const [results, setResults] = useState<TaxCalculationResult[]>([]);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
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
          analyzePin(pin, MOCK_PROPERTIES, assessmentOverride, externalTaxRates || undefined)
        );
        setResults(analyzed);

        // Auto-select first found PIN
        const firstFound = analyzed.find(r => r.found);
        if (firstFound) {
          setSelectedPin(firstFound.pin);
        } else if (analyzed.length > 0) {
          setSelectedPin(analyzed[0].pin);
        }

        setHasAnalyzed(true);
        setIsAnalyzing(false);
        // Scroll to results on mobile
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }, 600);
    },
    [assessmentOverride, externalTaxRates]
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
                  onClear={() => {
                    setResults([]);
                    setSelectedPin(null);
                    setHasAnalyzed(false);
                  }}
                  isAnalyzing={isAnalyzing}
                />
              </CardContent>
            </Card>

            {/* Tax Rate PDF Uploader */}
            <TaxRateUploader onDataExtracted={(data) => setExternalTaxRates(data.rates)} />

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
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
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
                  </div>

                  {/* PIN Selector for Multi-results */}
                  {validResults.length > 1 && (
                    <div className="bg-card border border-border rounded-xl p-3 card-shadow">
                      <p className="text-[10px] font-semibold font-sans text-muted-foreground uppercase tracking-wider mb-2 px-1">
                        Select a PIN to view details
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {validResults.map((r) => (
                          <button
                            key={r.pin}
                            onClick={() => setSelectedPin(r.pin)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-mono border transition-all",
                              selectedPin === r.pin
                                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                : "bg-secondary/50 text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
                            )}
                          >
                            {r.pin}
                          </button>
                        ))}
                        {notFoundResults.length > 0 && notFoundResults.map((r) => (
                          <button
                            key={r.pin}
                            onClick={() => setSelectedPin(r.pin)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-mono border transition-all opacity-70",
                              selectedPin === r.pin
                                ? "bg-destructive/10 text-destructive border-destructive/20"
                                : "bg-destructive/5 text-destructive/60 border-destructive/10 hover:bg-destructive/10 hover:text-destructive"
                            )}
                          >
                            {r.pin} (X)
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Single Detailed View */}
                  <div className="grid grid-cols-1 gap-4">
                    {results
                      .filter((r) => r.pin === selectedPin)
                      .map((r) => (
                        <ResultsCard
                          key={r.pin}
                          result={r}
                          analyzeCurrentTaxes={analyzeCurrentTaxes}
                          incomeApproach={incomeApproach}
                        />
                      ))}
                  </div>
                </div>

                {/* Right Action Sidebar */}
                <div className="space-y-5">
                  {validResults.length > 0 && (
                    <Card className="card-shadow border-border overflow-hidden">
                      <CardHeader className="pb-3 border-b border-border bg-muted/30">
                        <CardTitle className="text-sm font-semibold font-sans flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          Reporting
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <Button
                          onClick={() => setShowReport(true)}
                          className="w-full font-sans gap-2 h-10"
                        >
                          <FileText className="w-4 h-4" />
                          Preview Full Report
                        </Button>
                        <p className="text-[11px] text-muted-foreground font-sans mt-3 text-center leading-relaxed">
                          Review and print the formal analysis report for all identified properties.
                        </p>
                      </CardContent>
                    </Card>
                  )}

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
