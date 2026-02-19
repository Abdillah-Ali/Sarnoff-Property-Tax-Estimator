import React from "react";
import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TaxCalculationResult } from "@/lib/calculations";
import { formatCurrency } from "@/lib/calculations";

interface ExportPanelProps {
  results: TaxCalculationResult[];
  analyzeCurrentTaxes: boolean;
  incomeApproach: boolean;
  assessmentOverride: string;
  requestId: string;
  createdAt: string;
}

function buildExportRows(
  results: TaxCalculationResult[],
  analyzeCurrentTaxes: boolean,
  incomeApproach: boolean,
  assessmentOverride: string,
  requestId: string,
  createdAt: string
) {
  return results.map((r) => ({
    request_id: requestId,
    created_at: createdAt,
    pin: r.pin,
    analyze_current_taxes: analyzeCurrentTaxes,
    income_approach: incomeApproach,
    assessment_source_override: assessmentOverride,
    address: r.property?.address ?? "N/A",
    township: r.property?.township ?? "N/A",
    neighborhood_code: r.property?.neighborhood_code ?? "N/A",
    assessment_selected: r.assessment.value ?? "N/A",
    assessment_type_selected: r.assessment.type,
    board_tot: r.property?.board_tot ?? "N/A",
    certified_tot: r.property?.certified_tot ?? "N/A",
    mailed_tot: r.property?.mailed_tot ?? "N/A",
    tax_rate_year: r.property?.tax_rate_year ?? "N/A",
    tax_rate_value: r.property?.tax_rate_value ?? "N/A",
    equalization_factor: r.property?.equalization_factor ?? "N/A",
    estimated_taxes: r.estimatedTax ?? "N/A",
    warnings: r.warnings.join("; "),
    draft_invoice_line_item: r.draftInvoiceLineItem,
    data_found: r.found,
  }));
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  results,
  analyzeCurrentTaxes,
  incomeApproach,
  assessmentOverride,
  requestId,
  createdAt,
}) => {
  const rows = buildExportRows(
    results,
    analyzeCurrentTaxes,
    incomeApproach,
    assessmentOverride,
    requestId,
    createdAt
  );

  const handleDownloadCsv = () => {
    const headers = Object.keys(rows[0]);
    const csvLines = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((h) => {
            const val = (row as Record<string, unknown>)[h];
            const str = val === undefined || val === null ? "" : String(val);
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];
    const csv = csvLines.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `job_packet_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const json = JSON.stringify(
      {
        request_id: requestId,
        created_at: createdAt,
        export_version: "1.0",
        analyze_current_taxes: analyzeCurrentTaxes,
        income_approach: incomeApproach,
        assessment_source_override: assessmentOverride,
        results: rows,
      },
      null,
      2
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `job_packet_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="card-shadow border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold font-sans flex items-center gap-2">
          <Download className="w-4 h-4 text-primary" />
          Export Job Packet
        </CardTitle>
        <p className="text-xs text-muted-foreground font-sans">
          Download all analysis data as CSV or JSON. Filename:{" "}
          <span className="font-mono">job_packet_&lt;timestamp&gt;</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={handleDownloadCsv}
          variant="outline"
          className="w-full font-sans justify-start gap-2 h-9 text-sm"
        >
          <FileSpreadsheet className="w-4 h-4 text-green-700" />
          Download CSV
          <span className="ml-auto text-[10px] text-muted-foreground font-mono">
            .csv
          </span>
        </Button>
        <Button
          onClick={handleDownloadJson}
          variant="outline"
          className="w-full font-sans justify-start gap-2 h-9 text-sm"
        >
          <FileJson className="w-4 h-4 text-blue-600" />
          Download JSON
          <span className="ml-auto text-[10px] text-muted-foreground font-mono">
            .json
          </span>
        </Button>
        <div className="rounded-md bg-muted/40 border border-border p-2.5 mt-1">
          <p className="text-[10px] text-muted-foreground font-sans font-semibold uppercase tracking-wide mb-1">
            Includes fields
          </p>
          <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">
            request_id · created_at · pin · analyze_current_taxes ·
            income_approach · address · township · neighborhood_code ·
            assessment_selected · assessment_type_selected · tax_rate_year ·
            tax_rate_value · equalization_factor · estimated_taxes · warnings ·
            draft_invoice_line_item
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportPanel;
