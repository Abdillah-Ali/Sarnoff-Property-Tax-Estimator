import React, { useState, useCallback } from "react";
import { X, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ValidatedPin {
  raw: string;
  normalized: string;
  valid: boolean;
  error?: string;
}

interface PinInputPanelProps {
  onAnalyze: (pins: string[]) => void;
  isAnalyzing: boolean;
}

function normalizePin(raw: string): string {
  return raw.replace(/[\s\-]/g, "");
}

function validatePin(raw: string): ValidatedPin {
  const normalized = normalizePin(raw);
  if (normalized.length === 0) {
    return { raw, normalized, valid: false, error: "Empty PIN" };
  }
  if (!/^\d+$/.test(normalized)) {
    return {
      raw,
      normalized,
      valid: false,
      error: "PIN must contain digits only",
    };
  }
  if (normalized.length !== 14) {
    return {
      raw,
      normalized,
      valid: false,
      error: `Must be 14 digits (got ${normalized.length})`,
    };
  }
  return { raw, normalized, valid: true };
}

const PinInputPanel: React.FC<PinInputPanelProps> = ({
  onAnalyze,
  isAnalyzing,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [confirmedPins, setConfirmedPins] = useState<ValidatedPin[]>([]);
  const [parseErrors, setParseErrors] = useState<ValidatedPin[]>([]);

  const parseInput = useCallback((value: string) => {
    if (!value.trim()) {
      setConfirmedPins([]);
      setParseErrors([]);
      return;
    }
    const parts = value
      .split(/[\n,]+/)
      .map((p) => p.trim())
      .filter(Boolean);
    const validated = parts.map(validatePin);
    setConfirmedPins(validated.filter((p) => p.valid));
    setParseErrors(validated.filter((p) => !p.valid));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    parseInput(value);
  };

  const removePin = (normalized: string) => {
    const remaining = confirmedPins.filter((p) => p.normalized !== normalized);
    setConfirmedPins(remaining);
    // Rebuild textarea value from remaining
    const newValue = remaining.map((p) => p.raw).join("\n");
    setInputValue(newValue);
    parseInput(newValue);
  };

  const handleClearAll = () => {
    setInputValue("");
    setConfirmedPins([]);
    setParseErrors([]);
  };

  const handleAnalyze = () => {
    if (confirmedPins.length > 0) {
      onAnalyze(confirmedPins.map((p) => p.normalized));
    }
  };

  const hasValidPins = confirmedPins.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5 font-sans">
          Enter Cook County PIN(s)
        </label>
        <p className="text-xs text-muted-foreground font-sans mb-2">
          Enter one or more 14-digit PINs — comma-separated or one per line.
          Dashes and spaces are automatically removed.
        </p>
        <Textarea
          value={inputValue}
          onChange={handleInputChange}
          placeholder={
            "12-34-567-890-1234\n98765432109876\n55-66-778-899-0011"
          }
          className="min-h-[120px] font-mono text-sm resize-none bg-card border-border focus-visible:ring-ring"
        />
      </div>

      {/* Sample PINs hint */}
      {!hasValidPins && !inputValue && (
        <div className="rounded-md border border-dashed border-border bg-muted/40 p-3">
          <p className="text-xs text-muted-foreground font-sans mb-1.5 font-medium">
            Sample PINs to try:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              "12-34-567-890-1234",
              "98765432109876",
              "11-22-334-455-6677",
              "55-66-778-899-0011",
            ].map((pin) => (
              <button
                key={pin}
                onClick={() => {
                  const newVal = inputValue
                    ? `${inputValue}\n${pin}`
                    : pin;
                  setInputValue(newVal);
                  parseInput(newVal);
                }}
                className="font-mono text-xs px-2 py-0.5 rounded border border-border bg-card text-foreground hover:bg-secondary hover:border-ring transition-colors"
              >
                {pin}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Validated PIN chips */}
      {hasValidPins && (
        <div>
          <p className="text-xs font-semibold font-sans text-foreground mb-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            Valid PINs ({confirmedPins.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {confirmedPins.map((pin) => (
              <span
                key={pin.normalized}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-secondary text-secondary-foreground border border-border"
              >
                {pin.normalized}
                <button
                  onClick={() => removePin(pin.normalized)}
                  className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Remove PIN ${pin.normalized}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Validation errors */}
      {parseErrors.length > 0 && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
          <p className="text-xs font-semibold font-sans text-destructive mb-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Invalid entries — will be skipped
          </p>
          <ul className="space-y-0.5">
            {parseErrors.map((err, i) => (
              <li key={i} className="text-xs font-sans text-destructive/80">
                <span className="font-mono">"{err.raw}"</span> — {err.error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          onClick={handleAnalyze}
          disabled={!hasValidPins || isAnalyzing}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-sans font-semibold"
        >
          {isAnalyzing ? "Analyzing…" : "Analyze"}
          {!isAnalyzing && <ChevronRight className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          onClick={handleClearAll}
          disabled={!inputValue && !hasValidPins}
          className="font-sans"
        >
          Clear All
        </Button>
      </div>
    </div>
  );
};

export default PinInputPanel;
