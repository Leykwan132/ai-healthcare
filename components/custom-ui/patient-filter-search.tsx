"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

interface PatientOption {
    value: string; // patient id or phone number
    label: string; // display text (phone number or name)
}

interface MedicalHistory {
    surgeries: string[];
    conditions: string[];
}

interface Allergies {
    food: string[];
    medications: string[];
}

interface PatientDetails {
    id: string;
    date_of_birth?: string;
    gender?: string;
    phone_number?: string;
    emergency_contact?: string;
    medical_history?: MedicalHistory;
    allergies?: Allergies;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    doctorId?: string;
    name?: string;
}


export default function PatientFilterSearch() {
    const [options, setOptions] = useState<PatientOption[]>([]);
    const [patientData, setPatientData] = useState<PatientDetails | null>(null);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            setLoadingPatients(true);
            try {
                // First try to fetch from external Supabase API
                let res;
                try {
                    res = await axios.get("/api/external-patients");
                    console.log("External patient API response:", res.data);
                } catch (externalError) {
                    console.warn("External API failed, falling back to local API:", externalError);
                    // Fallback to local API
                    res = await axios.get("/api/patients/?doctorId=660e8400-e29b-41d4-a716-446655440001");
                    console.log("Local patient API response:", res.data);
                }

                // Parse the response data
                let patientList = [];
                if (Array.isArray(res.data)) {
                    patientList = res.data;
                } else if (res.data && Array.isArray(res.data.patients)) {
                    patientList = res.data.patients;
                } else if (res.data && Array.isArray(res.data.data)) {
                    patientList = res.data.data;
                } else {
                    console.error("Unexpected data format from patient API:", res.data);
                    patientList = [];
                }

                const opts = patientList.map((p: any) => ({
                    value: p.id || p.patient_id || p.phone_number,
                    label: p.phone_number || "No phone number"
                }));

                setOptions(opts);
            } catch (error) {
                console.error("Error fetching patient list:", error);
                setOptions([]);
            } finally {
                setLoadingPatients(false);
            }
        };
        fetchPatients();
    }, []);

    const handleChange = async (selectedOption: PatientOption | null) => {
        if (!selectedOption) {
            setPatientData(null);
            return;
        }
        setLoadingDetails(true);
        try {
            // First try to fetch from external API
            let res;
            try {
                res = await axios.get(`/api/external-patient/${selectedOption.value}`);
                console.log("External patient details response:", res.data);
            } catch (externalError) {
                console.warn("External patient details API failed, falling back to local API:", externalError);
                // Fallback to local API
                res = await axios.get(`/api/patient_details/${selectedOption.value}`);
                console.log("Local patient details response:", res.data);
            }
            setPatientData(res.data);
        } catch (error) {
            console.error("Error fetching patient details:", error);
            setPatientData(null);
        } finally {
            setLoadingDetails(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="w-full max-w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search by Patient Phone Number
                </label>
                <Select
                    options={options}
                    onChange={handleChange}
                    placeholder={loadingPatients ? "Loading patients..." : "Search or select phone number..."}
                    isClearable
                    isSearchable
                    isLoading={loadingPatients}
                    className="w-full"
                    instanceId="patient-select"
                    noOptionsMessage={() => "No patients found"}
                    filterOption={(option, inputValue) => {
                        return option.label.toLowerCase().includes(inputValue.toLowerCase())
                    }}
                />
            </div>

            {loadingDetails && <p>Loading patient details...</p>}

            {patientData && (
                <div className="p-4 border rounded bg-gray-50">
                    <h2 className="text-lg font-bold">Patient: {patientData.phone_number}</h2>
                    <p className="text-sm text-gray-600 mb-2">ID: {patientData.id}</p>
                    <p>Date of Birth: {patientData.date_of_birth}</p>
                    <p>Gender: {patientData.gender}</p>

                    <div className="mt-3">
                        <h3 className="font-semibold">Medical History</h3>
                        <p>Surgeries: {patientData.medical_history?.surgeries ? patientData.medical_history.surgeries.join(", ") : "N/A"}</p>
                        <p>Conditions: {patientData.medical_history?.conditions ? patientData.medical_history.conditions.join(", ") : "N/A"}</p>
                    </div>

                    <div className="mt-3">
                        <h3 className="font-semibold">Allergies</h3>
                        <p>Food: {patientData.allergies?.food ? patientData.allergies.food.join(", ") : "N/A"}</p>
                        <p>Medications: {patientData.allergies?.medications ? patientData.allergies.medications.join(", ") : "N/A"}</p>
                    </div>
                </div>
            )}

        </div>
    );
}