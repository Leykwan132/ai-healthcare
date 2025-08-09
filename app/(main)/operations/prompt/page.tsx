"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: string;
  instructions: string;
}

interface Activity {
  name: string;
  duration: string;
  frequency: string;
  timing: string;
  instructions: string;
}

interface ParsedInstruction {
  medications: Medication[];
  activities: Activity[];
  followUpDate?: string;
  notes?: string;
}

interface ParseResponse {
  success: boolean;
  data?: ParsedInstruction;
  error?: string;
  provider?: string;
  processingTime?: number;
}

export default function PromptTestPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParseResponse | null>(null);
  const [provider, setProvider] = useState<'openai' | 'groq'>('openai');

  const samplePrescriptions = [
    "Take 1 tablet of Amlodipine 5mg once daily in the morning. Light exercise 30 minutes daily.",
    "Ventolin inhaler 2 puffs as needed for asthma. Flixotide 250mcg inhaler twice daily morning and evening. Avoid dust and smoke.",
    "Simvastatin 20mg once daily in the evening with food. Walking exercise 45 minutes daily. Follow up in 2 weeks.",
    "Novorapid insulin 10 units before breakfast and dinner. Metformin 1000mg twice daily with meals. Check blood sugar daily.",
    "Take Paracetamol 500mg three times daily for 5 days. Rest and drink plenty of fluids."
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);

    const startTime = Date.now();

    try {
      const response = await fetch('/api/ai/prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instruction: input,
          provider: provider
        }),
      });

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      if (response.ok) {
        setResult({
          success: true,
          data: data.parsedInstruction,
          provider: provider,
          processingTime
        });
      } else {
        setResult({
          success: false,
          error: data.error || 'Failed to parse instruction',
          provider: provider,
          processingTime
        });
      }
    } catch (error) {
      const processingTime = Date.now() - startTime;
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        provider: provider,
        processingTime
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sample: string) => {
    setInput(sample);
    setResult(null);
  };

  const clearAll = () => {
    setInput("");
    setResult(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Prompt Testing</h1>
          <p className="text-muted-foreground mt-2">
            Test the AI prompt for parsing prescription instructions into structured data
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Provider: {provider.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Prescription Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="provider">AI Provider</Label>
                <select
                  id="provider"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as 'openai' | 'groq')}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="openai">OpenAI (GPT-4o-mini)</option>
                  <option value="groq">Groq (Llama3-8b-8192)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="instruction">Prescription Instruction</Label>
                <textarea
                  id="instruction"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter prescription instructions here..."
                  rows={4}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={!input.trim() || loading}
                  className="flex-1"
                >
                  {loading ? "Parsing..." : "Parse Instruction"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={clearAll}
                  disabled={loading}
                >
                  Clear
                </Button>
              </div>
            </form>

            {/* Sample Prescriptions */}
            <div className="mt-6">
              <Label className="text-sm font-medium">Sample Prescriptions</Label>
              <div className="space-y-2 mt-2">
                {samplePrescriptions.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => loadSample(sample)}
                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
                    disabled={loading}
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Parsed Results</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-muted-foreground">Processing with {provider.toUpperCase()}...</span>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                {result.success ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        ✓ Success
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {result.processingTime}ms via {result.provider?.toUpperCase()}
                      </span>
                    </div>
                    
                    {result.data && (
                      <div className="space-y-6">
                        {/* Medications Section */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Medications ({result.data.medications.length})</h3>
                          {result.data.medications.length > 0 ? (
                            <div className="space-y-3">
                              {result.data.medications.map((med, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-blue-50">
                                  <h4 className="font-medium text-blue-900 mb-2">{med.name}</h4>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-gray-600">Dosage:</div>
                                    <div className="font-mono">{med.dosage}</div>
                                    <div className="text-gray-600">Frequency:</div>
                                    <div className="font-mono">{med.frequency}</div>
                                    <div className="text-gray-600">Duration:</div>
                                    <div className="font-mono">{med.duration}</div>
                                    <div className="text-gray-600">Timing:</div>
                                    <div className="font-mono">{med.timing}</div>
                                  </div>
                                  {med.instructions && (
                                    <div className="mt-2">
                                      <div className="text-xs text-gray-600">Instructions:</div>
                                      <div className="text-xs font-mono bg-white p-1 rounded border">{med.instructions}</div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm italic">No medications found</div>
                          )}
                        </div>

                        {/* Activities Section */}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Activities ({result.data.activities.length})</h3>
                          {result.data.activities.length > 0 ? (
                            <div className="space-y-3">
                              {result.data.activities.map((activity, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-green-50">
                                  <h4 className="font-medium text-green-900 mb-2">{activity.name}</h4>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-gray-600">Duration:</div>
                                    <div className="font-mono">{activity.duration}</div>
                                    <div className="text-gray-600">Frequency:</div>
                                    <div className="font-mono">{activity.frequency}</div>
                                    <div className="text-gray-600">Timing:</div>
                                    <div className="font-mono">{activity.timing}</div>
                                  </div>
                                  {activity.instructions && (
                                    <div className="mt-2">
                                      <div className="text-xs text-gray-600">Instructions:</div>
                                      <div className="text-xs font-mono bg-white p-1 rounded border">{activity.instructions}</div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm italic">No activities found</div>
                          )}
                        </div>

                        {/* Follow-up and Notes */}
                        {(result.data.followUpDate || result.data.notes) && (
                          <div className="border-t pt-4">
                            {result.data.followUpDate && (
                              <div className="mb-2">
                                <span className="font-medium text-gray-600 text-sm">Follow-up Date:</span>
                                <div className="font-mono bg-gray-50 p-1 rounded text-sm mt-1">{result.data.followUpDate}</div>
                              </div>
                            )}
                            {result.data.notes && (
                              <div>
                                <span className="font-medium text-gray-600 text-sm">Notes:</span>
                                <div className="font-mono bg-gray-50 p-2 rounded text-sm mt-1">{result.data.notes}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <Badge variant="destructive">
                        ✗ Error
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {result.processingTime}ms via {result.provider?.toUpperCase()}
                      </span>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-red-800 text-sm font-medium">Error:</p>
                      <p className="text-red-700 text-sm mt-1">{result.error}</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {!result && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Enter a prescription instruction and click "Parse Instruction" to see the AI parsing results.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use This Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Testing Steps:</h4>
              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                <li>Select an AI provider (OpenAI or Groq)</li>
                <li>Enter or select a prescription instruction</li>
                <li>Click "Parse Instruction" to test</li>
                <li>Review the structured output</li>
                <li>Try different instruction formats</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Database Schema Output:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li><strong>Medications Array:</strong> Name, dosage, frequency, duration, timing, instructions</li>
                <li><strong>Activities Array:</strong> Name, duration, frequency, timing, instructions</li>
                <li><strong>Follow-up Date:</strong> Next appointment/check-up</li>
                <li><strong>Notes:</strong> Additional instructions or warnings</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2 italic">
                Output matches parsedInstructions table schema in database
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
