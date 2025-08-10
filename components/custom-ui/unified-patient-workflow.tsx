"use client";

import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FiUser, FiPackage, FiCalendar, FiCheck, FiChevronRight, FiAlertCircle, FiInfo } from "react-icons/fi";

// Types
interface PatientOption {
  value: string;
  label: string;
}

interface PatientDetails {
  id: string;
  date_of_birth?: string;
  gender?: string;
  phone_number?: string;
  emergency_contact?: string;
  medical_history?: {
    surgeries: string[];
    conditions: string[];
  };
  allergies?: {
    food: string[];
    medications: string[];
  };
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  doctorId?: string;
  name?: string;
}

interface Prescription {
  medicine: string;
  frequency: number;
}

// Step indicator component
const StepIndicator = ({ currentStep, completedSteps }: { currentStep: number; completedSteps: boolean[] }) => {
  const steps = [
    { number: 1, title: "Select Patient", icon: FiUser },
    { number: 2, title: "Add Prescriptions", icon: FiPackage },
    { number: 3, title: "Generate Schedule", icon: FiCalendar },
  ];

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const isCompleted = completedSteps[index];
        const isCurrent = currentStep === step.number;
        const IconComponent = step.icon;
        
        return (
          <React.Fragment key={step.number}>
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isCurrent
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <FiCheck className="w-5 h-5" />
                ) : (
                  <IconComponent className="w-5 h-5" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${isCurrent ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"}`}>
                  Step {step.number}
                </p>
                <p className={`text-xs ${isCurrent ? "text-blue-500" : isCompleted ? "text-green-500" : "text-gray-400"}`}>
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export function UnifiedPatientWorkflow() {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([false, false, false]);
  
  // Patient search state
  const [patientOptions, setPatientOptions] = useState<PatientOption[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientDetails | null>(null);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Prescription state
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [frequency, setFrequency] = useState<number | "">("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Schedule input state
  const [scheduleInput, setScheduleInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // AI parsing state
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiSchedule, setAiSchedule] = useState<any>(null);
  const [processingAI, setProcessingAI] = useState(false);
  const [startDate] = useState(new Date().toISOString().split('T')[0]);

  // Saving state
  const [savingPlan, setSavingPlan] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const prescriptionOptions = [
    { value: "Novorapid", label: "Novorapid" },
    { value: "Metformin", label: "Metformin" },
    { value: "Paracetamol", label: "Paracetamol" },
    { value: "Ibuprofen", label: "Ibuprofen" },
    { value: "Amoxicillin", label: "Amoxicillin" },
    { value: "Cough Syrup", label: "Cough Syrup" },
    { value: "Lisinopril", label: "Lisinopril" },
    { value: "Ventolin", label: "Ventolin" },
    { value: "Simvastatin", label: "Simvastatin" },
  ];

  const samplePrescriptions = [
    "Take 1 tablet of Amlodipine 5mg once daily in the morning. Light exercise 30 minutes daily.",
    "Ventolin inhaler 2 puffs as needed for asthma. Flixotide 250mcg inhaler twice daily morning and evening. Avoid dust and smoke.",
    "Simvastatin 20mg once daily in the evening with food. Walking exercise 45 minutes daily. Follow up in 2 weeks.",
    "Novorapid insulin 10 units before breakfast and dinner. Metformin 1000mg twice daily with meals. Check blood sugar daily.",
    "Take Paracetamol 500mg three times daily for 5 days. Rest and drink plenty of fluids."
  ];

  // Load patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      setLoadingPatients(true);
      try {
        let res;
        try {
          res = await axios.get("/api/external-patients");
        } catch (externalError) {
          res = await axios.get("/api/patients/?doctorId=660e8400-e29b-41d4-a716-446655440001");
        }

        let patientList = [];
        if (Array.isArray(res.data)) {
          patientList = res.data;
        } else if (res.data?.patients) {
          patientList = res.data.patients;
        } else if (res.data?.data) {
          patientList = res.data.data;
        }

        const opts = patientList.map((p: any) => ({
          value: p.id || p.patient_id || p.phone_number,
          label: p.phone_number || "No phone number"
        }));

        setPatientOptions(opts);
      } catch (error) {
        console.error("Error fetching patient list:", error);
        setPatientOptions([]);
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
  }, []);

  // Handle patient selection
  const handlePatientSelect = async (selectedOption: PatientOption | null) => {
    if (!selectedOption) {
      setSelectedPatient(null);
      setCompletedSteps([false, false, false]);
      setCurrentStep(1);
      return;
    }

    setLoadingDetails(true);
    try {
      let res;
      try {
        res = await axios.get(`/api/external-patient/${selectedOption.value}`);
      } catch (externalError) {
        res = await axios.get(`/api/patient_details/${selectedOption.value}`);
      }
      
      setSelectedPatient(res.data);
      setCompletedSteps([true, false, false]);
      setCurrentStep(2);
    } catch (error) {
      console.error("Error fetching patient details:", error);
      setSelectedPatient(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Prescription management
  const handleAddOrUpdatePrescription = () => {
    if (!selectedMedicine || !frequency) return;

    if (editIndex !== null) {
      const updated = [...prescriptions];
      updated[editIndex] = {
        medicine: selectedMedicine,
        frequency: Number(frequency),
      };
      setPrescriptions(updated);
    } else {
      setPrescriptions([
        ...prescriptions,
        { medicine: selectedMedicine, frequency: Number(frequency) },
      ]);
    }

    setSelectedMedicine("");
    setFrequency("");
    setEditIndex(null);
    setIsModalOpen(false);
    
    // Update step completion
    if (prescriptions.length >= 0) {
      setCompletedSteps([true, true, false]);
      setCurrentStep(3);
    }
  };

  const handleDeletePrescription = (index: number) => {
    const newPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(newPrescriptions);
    
    if (newPrescriptions.length === 0) {
      setCompletedSteps([true, false, false]);
      setCurrentStep(2);
    }
  };

  const handleEditPrescription = (index: number) => {
    const prescription = prescriptions[index];
    setSelectedMedicine(prescription.medicine);
    setFrequency(prescription.frequency);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  // Schedule input handling
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [scheduleInput]);

  // Suggestions handling
  useEffect(() => {
    if (!scheduleInput.trim()) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);

    const debounce = setTimeout(() => {
      axios
        .get(`/api/suggestions?query=${encodeURIComponent(scheduleInput)}`)
        .then((res) => {
          const apiSugs = res.data.suggestions || [];
          setSuggestions(apiSugs.filter((s: string) => 
            s.toLowerCase() !== scheduleInput.trim().toLowerCase()
          ));
        })
        .catch(() => {
          setSuggestions([]);
        })
        .finally(() => {
          setLoadingSuggestions(false);
        });
    }, 300);

    return () => clearTimeout(debounce);
  }, [scheduleInput]);

  const handleScheduleSubmit = async () => {
    if (!scheduleInput.trim()) return;
    
    setProcessingAI(true);
    setAiResult(null);
    setAiSchedule(null);

    try {
      // Step 1: Parse the instruction with AI
      const parseResponse = await fetch('/api/ai/prescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instruction: scheduleInput,
          provider: 'groq' // Use Groq as default
        }),
      });

      const parseData = await parseResponse.json();
      
      if (!parseResponse.ok) {
        throw new Error(parseData.error || 'Failed to parse instruction');
      }

      setAiResult({
        success: true,
        data: parseData.parsedInstruction
      });

      // Step 2: Generate schedule from parsed data
      const scheduleResponse = await fetch('/api/ai/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parsedInstruction: parseData.parsedInstruction,
          startDate: startDate
        }),
      });

      const scheduleData = await scheduleResponse.json();
      
      if (scheduleResponse.ok) {
        setAiSchedule(scheduleData);
        setCompletedSteps([true, true, true]);
      } else {
        throw new Error(scheduleData.error || 'Failed to generate schedule');
      }

    } catch (error) {
      setAiResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      });
    } finally {
      setProcessingAI(false);
    }
  };

  const handleSaveTreatmentPlan = async () => {
    if (!aiResult?.success || !aiSchedule || !selectedPatient) {
      setSaveError('Missing required data to save treatment plan');
      return;
    }

    setSavingPlan(true);
    setSaveError(null);
    setPlanSaved(false);

    try {
      // Ensure parsedInstruction has the correct structure with default empty arrays
      const parsedInstruction = {
        medications: aiResult.data.medications || [],
        activities: aiResult.data.activities || [],
        followUpDate: aiResult.data.followUpDate || undefined,
        notes: aiResult.data.notes || undefined
      };

      // Ensure each medication has all required fields
      const validatedMedications = parsedInstruction.medications.map((med: any) => ({
        name: med.name || 'Unknown medication',
        dosage: med.dosage || 'Unknown dosage',
        frequency: med.frequency || 'As prescribed',
        duration: med.duration || 'Unknown duration',
        timing: med.timing || 'Unknown timing',
        instructions: med.instructions || 'No specific instructions'
      }));

      // Ensure each activity has all required fields
      const validatedActivities = parsedInstruction.activities.map((act: any) => ({
        name: act.name || 'Unknown activity',
        duration: act.duration || 'Unknown duration',
        frequency: act.frequency || 'As needed',
        timing: act.timing || 'Unknown timing',
        instructions: act.instructions || 'No specific instructions'
      }));

      // Ensure each schedule event has all required fields
      const validatedScheduleEvents = (aiSchedule.events || []).map((event: any) => ({
        id: event.id || `event-${Date.now()}-${Math.random()}`,
        title: event.title || 'Untitled event',
        date: event.date || startDate,
        time: event.time || '08:00',
        type: event.type || 'medication',
        description: event.description || 'No description',
        metadata: {
          dosage: event.metadata?.dosage,
          frequency: event.metadata?.frequency,
          duration: event.metadata?.duration,
          instructions: event.metadata?.instructions
        }
      }));

      const requestPayload = {
        parsedInstruction: {
          medications: validatedMedications,
          activities: validatedActivities,
          followUpDate: parsedInstruction.followUpDate,
          notes: parsedInstruction.notes
        },
        scheduleEvents: validatedScheduleEvents,
        originalInstruction: scheduleInput,
        startDate: startDate,
        provider: 'groq' as const,
        patientId: selectedPatient.id
        // Omit doctorId - let the API use its default UUID
      };

      console.log('Sending payload to store-parsed-results:', requestPayload);

      const saveResponse = await fetch('/api/store-parsed-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      const saveData = await saveResponse.json();
      
      if (!saveResponse.ok) {
        console.error('Save failed:', saveData);
        throw new Error(saveData.error || 'Failed to save treatment plan');
      }

      setPlanSaved(true);
      
      // Trigger calendar refresh by dispatching a custom event
      window.dispatchEvent(new CustomEvent('treatmentPlanSaved', {
        detail: {
          prescriptionId: saveData.prescriptionId,
          patientId: selectedPatient.id,
          eventsCount: validatedScheduleEvents.length
        }
      }));

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setPlanSaved(false);
      }, 3000);

    } catch (error) {
      console.error('Save error:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save treatment plan');
    } finally {
      setSavingPlan(false);
    }
  };

  const filteredLocalSuggestions = scheduleInput.trim()
    ? samplePrescriptions.filter(p =>
        p.toLowerCase().includes(scheduleInput.toLowerCase()) &&
        p.toLowerCase() !== scheduleInput.trim().toLowerCase()
      )
    : samplePrescriptions.filter(p => 
        p.toLowerCase() !== scheduleInput.trim().toLowerCase()
      );

  const showSuggestions = isFocused
    ? (loadingSuggestions
        ? filteredLocalSuggestions
        : (suggestions.length > 0 ? suggestions : filteredLocalSuggestions))
    : [];

  // Available prescription options (filter out selected ones unless editing)
  const availableOptions = prescriptionOptions.filter(
    (opt) => !prescriptions.some((p, i) => p.medicine === opt.value && i !== editIndex)
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">Patient Care Workflow</CardTitle>
        <p className="text-gray-600">Follow these steps to create a prescription schedule for your patient.</p>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />

        {/* Step 1: Patient Selection */}
        <div className={`space-y-4 p-6 rounded-lg border-2 transition-colors ${
          currentStep === 1 ? "border-blue-500 bg-blue-50" : completedSteps[0] ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              completedSteps[0] ? "bg-green-500 text-white" : currentStep === 1 ? "bg-blue-500 text-white" : "bg-gray-400 text-white"
            }`}>
              {completedSteps[0] ? <FiCheck className="w-4 h-4" /> : <FiUser className="w-4 h-4" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Select Patient</h3>
            {completedSteps[0] && selectedPatient && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                {selectedPatient.phone_number}
              </Badge>
            )}
          </div>

          <div className="ml-11">
            <Select
              options={patientOptions}
              onChange={handlePatientSelect}
              placeholder={loadingPatients ? "Loading patients..." : "Search by phone number..."}
              isClearable
              isSearchable
              isLoading={loadingPatients || loadingDetails}
              className="w-full"
              instanceId="unified-patient-select"
              noOptionsMessage={() => "No patients found"}
              filterOption={(option, inputValue) => {
                return option.label.toLowerCase().includes(inputValue.toLowerCase());
              }}
            />

            {selectedPatient && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Patient Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Phone:</span> {selectedPatient.phone_number}</p>
                      <p><span className="text-gray-600">DOB:</span> {selectedPatient.date_of_birth}</p>
                      <p><span className="text-gray-600">Gender:</span> {selectedPatient.gender}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Medical History</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Surgeries:</span> {selectedPatient.medical_history?.surgeries?.join(", ") || "None"}</p>
                      <p><span className="text-gray-600">Conditions:</span> {selectedPatient.medical_history?.conditions?.join(", ") || "None"}</p>
                    </div>
                  </div>
                </div>

                {selectedPatient.allergies && (selectedPatient.allergies.food?.length > 0 || selectedPatient.allergies.medications?.length > 0) && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FiAlertCircle className="w-4 h-4 text-red-600" />
                      <h4 className="font-semibold text-red-900">Allergies</h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      {selectedPatient.allergies.food && selectedPatient.allergies.food.length > 0 && (
                        <p><span className="text-red-700">Food:</span> {selectedPatient.allergies.food.join(", ")}</p>
                      )}
                      {selectedPatient.allergies.medications && selectedPatient.allergies.medications.length > 0 && (
                        <p><span className="text-red-700">Medications:</span> {selectedPatient.allergies.medications.join(", ")}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Prescription Selection */}
        <div className={`space-y-4 p-6 rounded-lg border-2 transition-colors ${
          currentStep === 2 ? "border-blue-500 bg-blue-50" : completedSteps[1] ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              completedSteps[1] ? "bg-green-500 text-white" : currentStep === 2 ? "bg-blue-500 text-white" : "bg-gray-400 text-white"
            }`}>
              {completedSteps[1] ? <FiCheck className="w-4 h-4" /> : <FiPackage className="w-4 h-4" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Add Prescriptions</h3>
            {prescriptions.length > 0 && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                {prescriptions.length} medication{prescriptions.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          <div className="ml-11">
            {!selectedPatient && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <FiInfo className="w-4 h-4 text-yellow-600" />
                <p className="text-yellow-700 text-sm">Please select a patient first</p>
              </div>
            )}

            {selectedPatient && (
              <>
                <div className="border rounded-lg p-4 min-h-[120px] max-h-[200px] overflow-y-auto space-y-2 bg-white">
                  {prescriptions.map((p, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border"
                    >
                      <span className="font-medium">
                        {p.medicine} –{" "}
                        <span className="text-gray-600">{p.frequency}x/day</span>
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPrescription(index)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDeletePrescription(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setEditIndex(null);
                      setSelectedMedicine("");
                      setFrequency("");
                      setIsModalOpen(true);
                    }}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    + Add Medication
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Step 3: Schedule Generation */}
        <div className={`space-y-4 p-6 rounded-lg border-2 transition-colors ${
          currentStep === 3 ? "border-blue-500 bg-blue-50" : completedSteps[2] ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              completedSteps[2] ? "bg-green-500 text-white" : currentStep === 3 ? "bg-blue-500 text-white" : "bg-gray-400 text-white"
            }`}>
              {completedSteps[2] ? <FiCheck className="w-4 h-4" /> : <FiCalendar className="w-4 h-4" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Generate Schedule</h3>
          </div>

          <div className="ml-11">
            {(!selectedPatient || prescriptions.length === 0) && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <FiInfo className="w-4 h-4 text-yellow-600" />
                <p className="text-yellow-700 text-sm">
                  Please complete the previous steps first
                </p>
              </div>
            )}

            {selectedPatient && prescriptions.length > 0 && (
              <>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={scheduleInput}
                    onChange={(e) => setScheduleInput(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                      setTimeout(() => setIsFocused(false), 150);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleScheduleSubmit();
                      }
                    }}
                    placeholder="Describe the complete treatment plan in natural language..."
                    rows={1}
                    className="resize-none w-full rounded-lg border border-gray-300 p-3 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden bg-white"
                    style={{ maxHeight: "200px" }}
                  />
                  <button
                    type="button"
                    onClick={handleScheduleSubmit}
                    disabled={!scheduleInput.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {showSuggestions.length > 0 && (
                  <div className="mt-2 p-2 border rounded-lg bg-white text-sm max-h-48 overflow-y-auto shadow-md">
                    <ul className="list-none space-y-1">
                      {showSuggestions.map((s, i) => (
                        <li
                          key={i}
                          className="cursor-pointer rounded px-2 py-1 hover:bg-blue-100 transition-colors"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setScheduleInput(s);
                          }}
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedPatient && prescriptions.length > 0 && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Treatment Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Patient: {selectedPatient.phone_number}</p>
                        <p className="text-sm text-gray-600">Medications: {prescriptions.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Prescribed:</p>
                        <ul className="text-sm text-gray-700">
                          {prescriptions.map((p, i) => (
                            <li key={i}>• {p.medicine} ({p.frequency}x/day)</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Processing Display */}
                {processingAI && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <p className="text-blue-800 font-medium">AI is processing your request...</p>
                    </div>
                  </div>
                )}

                {/* AI Results Display */}
                {aiResult && (
                  <div className="mt-4 space-y-4">
                    {aiResult.success ? (
                      <>
                        {/* Parsed Instruction Results */}
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-900 mb-3">✓ AI Parsing Results</h4>
                          <div className="space-y-2">
                            {aiResult.data.medications && aiResult.data.medications.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-green-800">Medications:</p>
                                <ul className="text-sm text-green-700 ml-4">
                                  {aiResult.data.medications.map((med: any, i: number) => (
                                    <li key={i}>• {med.name} - {med.dosage} ({med.frequency})</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {aiResult.data.instructions && aiResult.data.instructions.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-green-800">Instructions:</p>
                                <ul className="text-sm text-green-700 ml-4">
                                  {aiResult.data.instructions.map((inst: string, i: number) => (
                                    <li key={i}>• {inst}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {aiResult.data.duration && (
                              <p className="text-sm text-green-700">
                                <span className="font-medium">Duration:</span> {aiResult.data.duration}
                              </p>
                            )}
                            {aiResult.data.specialInstructions && (
                              <p className="text-sm text-green-700">
                                <span className="font-medium">Special Instructions:</span> {aiResult.data.specialInstructions}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Generated Schedule Display */}
                        {aiSchedule && (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-900 mb-3">📅 Generated Schedule</h4>
                            {aiSchedule.events && aiSchedule.events.length > 0 ? (
                              <div className="space-y-2">
                                <p className="text-sm text-blue-800 mb-2">
                                  <span className="font-medium">Schedule Period:</span> {aiSchedule.startDate} to {aiSchedule.endDate}
                                </p>
                                <div className="max-h-32 overflow-y-auto">
                                  <div className="space-y-1">
                                    {aiSchedule.events.slice(0, 5).map((event: any, i: number) => (
                                      <div key={i} className="text-xs bg-white p-2 rounded border">
                                        <span className="font-medium">{event.title}</span>
                                        {event.time && <span className="text-blue-600 ml-2">at {event.time}</span>}
                                        {event.date && <span className="text-gray-600 ml-2">({event.date})</span>}
                                      </div>
                                    ))}
                                    {aiSchedule.events.length > 5 && (
                                      <p className="text-xs text-blue-600 italic">+ {aiSchedule.events.length - 5} more events...</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-blue-700">Schedule generated successfully</p>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <h4 className="font-semibold text-red-900 mb-2">❌ AI Processing Error</h4>
                        <p className="text-sm text-red-700">{aiResult.error}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Save Status Messages */}
        {savingPlan && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <p className="text-blue-800 font-medium">Saving treatment plan...</p>
            </div>
          </div>
        )}

        {planSaved && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <div className="text-green-600">✓</div>
              <p className="text-green-800 font-medium">Treatment plan saved successfully! The calendar will refresh momentarily.</p>
            </div>
          </div>
        )}

        {saveError && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2">
              <div className="text-red-600">✕</div>
              <p className="text-red-800 font-medium">Error: {saveError}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            onClick={() => {
              // Reset workflow
              setSelectedPatient(null);
              setPrescriptions([]);
              setScheduleInput("");
              setAiResult(null);
              setAiSchedule(null);
              setPlanSaved(false);
              setSaveError(null);
              setCompletedSteps([false, false, false]);
              setCurrentStep(1);
            }}
          >
            Reset Workflow
          </Button>
          
          {completedSteps[2] && (
            <Button 
              className="bg-green-600 hover:bg-green-700" 
              onClick={handleSaveTreatmentPlan}
              disabled={savingPlan || !aiResult?.success || !aiSchedule}
            >
              {savingPlan ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Complete & Save Treatment Plan'
              )}
            </Button>
          )}
        </div>

        {/* Prescription Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg p-6 w-96 space-y-4 shadow-xl">
              <h2 className="text-lg font-semibold">
                {editIndex !== null ? "Edit Prescription" : "Add Prescription"}
              </h2>

              <Select
                options={availableOptions}
                value={
                  selectedMedicine
                    ? availableOptions.find((opt) => opt.value === selectedMedicine)
                    : null
                }
                onChange={(option) => setSelectedMedicine(option ? option.value : "")}
                placeholder="Select medicine..."
                isClearable
                classNamePrefix="react-select"
              />

              <input
                type="number"
                placeholder="Frequency per day"
                value={frequency}
                onChange={(e) =>
                  setFrequency(e.target.value ? Number(e.target.value) : "")
                }
                min={1}
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-end gap-2">
                <Button
                  onClick={handleAddOrUpdatePrescription}
                  disabled={!selectedMedicine || !frequency}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditIndex(null);
                    setSelectedMedicine("");
                    setFrequency("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
