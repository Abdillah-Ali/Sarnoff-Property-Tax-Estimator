import React, { useRef } from "react";
import { FileText, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TaxCalculationResult } from "@/lib/calculations";
import { formatCurrency } from "@/lib/calculations";

interface ReportPreviewProps {
  results: TaxCalculationResult[];
  analyzeCurrentTaxes: boolean;
  incomeApproach: boolean;
  requestId: string;
  createdAt: string;
  onClose: () => void;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  results,
  analyzeCurrentTaxes,
  incomeApproach,
  requestId,
  createdAt,
  onClose,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const validResults = results.filter((r) => r.found && r.property);

  const handleDownloadPdf = () => {
    if (!reportRef.current) return;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Sarnoff Property Tax Analysis Report</title>
  <style>
    body { font-family: Georgia, serif; color: #1a2340; margin: 0; padding: 32px; font-size: 13px; }
    h1 { font-size: 20px; color: #0f1f40; margin-bottom: 4px; }
    h2 { font-size: 15px; color: #0f1f40; margin-top: 24px; margin-bottom: 8px; border-bottom: 1px solid #d1d9e6; padding-bottom: 4px; }
    .meta { font-family: monospace; font-size: 10px; color: #6b7280; margin-bottom: 24px; }
    .narrative { background: #f0f4fb; border-left: 3px solid #1a3a6b; padding: 14px 16px; margin: 16px 0; font-style: italic; font-size: 13px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-family: Arial, sans-serif; font-size: 11px; }
    th { background: #1a3a6b; color: #fff; padding: 6px 10px; text-align: left; font-weight: 600; }
    td { padding: 5px 10px; border-bottom: 1px solid #e5e9f0; }
    tr:nth-child(even) td { background: #f7f9fc; }
    .highlight { font-weight: 700; font-size: 14px; color: #0f1f40; }
    .footer { margin-top: 40px; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e9f0; padding-top: 12px; }
    .section { page-break-inside: avoid; margin-bottom: 28px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; }
    .badge-board { background: #dbeafe; color: #1d4ed8; }
    .badge-certified { background: #f3e8ff; color: #7e22ce; }
    .badge-mailed { background: #ffedd5; color: #c2410c; }
  </style>
</head>
<body>
  <h1>Sarnoff Property Tax Analysis Report</h1>
  <p class="meta">
    Request ID: ${requestId} &nbsp;|&nbsp; Generated: ${new Date(createdAt).toLocaleString()} &nbsp;|&nbsp; Cook County, Illinois
  </p>

  ${validResults
        .map(
          (r) => `
  <div class="section">
    <h2>${r.property!.address}</h2>
    <div class="narrative">
      The property located at ${r.property!.address} (PINs: ${r.pin}) is located in 
      ${r.property!.township} township and is currently assessed at 
      ${formatCurrency(r.assessment.value)}, 
      which equates to estimated taxes of <strong>${r.estimatedTax !== null ? formatCurrency(r.estimatedTax) : "N/A"}</strong>.
      ${incomeApproach ? " An income approach analysis has been flagged for this property." : ""}
    </div>
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>PIN</td><td><code>${r.pin}</code></td></tr>
        <tr><td>Address</td><td>${r.property!.address}</td></tr>
        <tr><td>Township</td><td>${r.property!.township}</td></tr>
        <tr><td>Neighborhood Code</td><td>${r.property!.neighborhood_code}</td></tr>
        <tr><td>Board Assessment</td><td>${r.property!.board_tot !== null ? formatCurrency(r.property!.board_tot) : "N/A"}</td></tr>
        <tr><td>Certified Assessment</td><td>${r.property!.certified_tot !== null ? formatCurrency(r.property!.certified_tot) : "N/A"}</td></tr>
        <tr><td>Mailed Assessment</td><td>${r.property!.mailed_tot !== null ? formatCurrency(r.property!.mailed_tot) : "N/A"}</td></tr>
        <tr><td>Selected Assessment</td><td><strong>${formatCurrency(r.assessment.value)}</strong> (${r.assessment.type})</td></tr>
        <tr><td>Tax Rate Year</td><td>${r.property!.tax_rate_year}</td></tr>
        <tr><td>Tax Rate</td><td>${r.property!.tax_rate_value}%</td></tr>
        <tr><td>Equalization Factor</td><td>${r.property!.equalization_factor.toFixed(4)}</td></tr>
        <tr><td>Estimated Annual Taxes</td><td class="highlight">${r.estimatedTax !== null ? formatCurrency(r.estimatedTax) : "N/A"}</td></tr>
        ${r.warnings.length > 0 ? `<tr><td>Warnings</td><td style="color:#b45309">${r.warnings.join("; ")}</td></tr>` : ""}
      </tbody>
    </table>
  </div>
  `
        )
        .join("")}

  <div class="footer">
    <p><strong>Sarnoff Property Tax</strong> &bull; Since 1986, the law firm of Sarnoff Property Tax has secured substantial real estate tax savings for a wide variety of properties throughout Illinois. "Increasing Income by Reducing Property Tax."</p>
    <p>Request ID: ${requestId} &nbsp;|&nbsp; Analyze Current Taxes: ${analyzeCurrentTaxes ? "Yes" : "No"} &nbsp;|&nbsp; Income Approach: ${incomeApproach ? "Yes" : "No"}</p>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `property_tax_report_${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4 sm:p-8 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <h2 className="text-base font-semibold font-sans text-foreground">
              Report Preview
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDownloadPdf}
              size="sm"
              className="font-sans gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Download HTML/PDF
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Report Content */}
        <div className="overflow-y-auto flex-1 p-6" ref={reportRef}>
          {/* Document Header */}
          <div className="mb-6 pb-4 border-b-2 border-primary/20">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Sarnoff Property Tax Analysis Report
                </h1>
                <p className="text-xs text-muted-foreground font-sans mt-1">
                  Cook County, Illinois
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground font-sans space-y-0.5">
                <p>
                  <span className="font-semibold text-foreground">
                    Request ID:
                  </span>{" "}
                  <span className="font-mono">{requestId}</span>
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Generated:
                  </span>{" "}
                  {new Date(createdAt).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Properties:
                  </span>{" "}
                  {validResults.length}
                </p>
              </div>
            </div>
          </div>

          {/* Per-property sections */}
          <div className="space-y-8">
            {validResults.map((r) => (
              <div key={r.pin} className="space-y-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    {r.property!.address}
                  </h2>
                  <p className="text-xs text-muted-foreground font-sans">
                    {r.property!.township} Township &bull; Neighborhood Code:{" "}
                    {r.property!.neighborhood_code}
                  </p>
                </div>

                {/* Narrative */}
                <div className="result-highlight rounded-r-md p-4">
                  <p className="text-sm font-sans text-foreground leading-relaxed italic">
                    The property located at{" "}
                    <strong>{r.property!.address}</strong> (PINs: {r.pin}) is
                    located in{" "}
                    <strong>{r.property!.township}</strong> township and is
                    currently assessed at{" "}
                    <strong>{formatCurrency(r.assessment.value)}</strong>,
                    which equates to estimated taxes of{" "}
                    <strong>
                      {r.estimatedTax !== null
                        ? formatCurrency(r.estimatedTax)
                        : "N/A"}
                    </strong>
                    .
                    {incomeApproach &&
                      " An income approach analysis has been flagged for this property."}
                  </p>
                </div>

                {/* Data Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-sans text-xs w-48">
                        Field
                      </TableHead>
                      <TableHead className="font-sans text-xs">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { label: "PIN", value: <span className="font-mono text-xs">{r.pin}</span> },
                      { label: "Address", value: r.property!.address },
                      { label: "Township", value: r.property!.township },
                      { label: "Neighborhood Code", value: r.property!.neighborhood_code },
                      { label: "Board Assessment", value: formatCurrency(r.property!.board_tot) },
                      { label: "Certified Assessment", value: formatCurrency(r.property!.certified_tot) },
                      { label: "Mailed Assessment", value: formatCurrency(r.property!.mailed_tot) },
                      {
                        label: "Selected Assessment",
                        value: (
                          <span className="font-semibold">
                            {formatCurrency(r.assessment.value)}{" "}
                            <span className="font-normal text-muted-foreground text-xs">
                              ({r.assessment.type})
                            </span>
                          </span>
                        ),
                      },
                      { label: "Tax Rate Year", value: r.property!.tax_rate_year },
                      { label: "Tax Rate", value: `${r.property!.tax_rate_value}%` },
                      { label: "Equalization Factor", value: r.property!.equalization_factor.toFixed(4) },
                      {
                        label: "Estimated Annual Taxes",
                        value: (
                          <span className="font-bold text-base text-foreground">
                            {r.estimatedTax !== null
                              ? formatCurrency(r.estimatedTax)
                              : "N/A"}
                          </span>
                        ),
                      },
                    ].map(({ label, value }) => (
                      <TableRow key={label}>
                        <TableCell className="font-sans text-xs text-muted-foreground py-2">
                          {label}
                        </TableCell>
                        <TableCell className="font-sans text-sm text-foreground py-2">
                          {value}
                        </TableCell>
                      </TableRow>
                    ))}
                    {r.warnings.length > 0 && (
                      <TableRow>
                        <TableCell className="font-sans text-xs text-muted-foreground py-2">
                          Warnings
                        </TableCell>
                        <TableCell className="font-sans text-xs py-2" style={{ color: "#b45309" }}>
                          {r.warnings.join("; ")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>

          {/* Footer Disclaimer */}
          <div className="mt-8 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground font-sans">
              <strong>Sarnoff Property Tax</strong> &bull; Since 1986, the law firm of Sarnoff Property Tax has secured substantial real estate tax savings for a wide variety of properties throughout Illinois. "Increasing Income by Reducing Property Tax."
              <br />
              Analyze Current Taxes:{" "}
              {analyzeCurrentTaxes ? "Yes" : "No"} | Income Approach:{" "}
              {incomeApproach ? "Yes" : "No"}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
