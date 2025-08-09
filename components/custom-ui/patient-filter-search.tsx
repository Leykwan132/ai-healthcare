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
    date_of_birth: string;
    gender: string;
    phone_number: string;
    emergency_contact?: string;
    medical_history: MedicalHistory;
    allergies: Allergies;
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
            try {
                const res = await axios.get("/api/patients/?doctorId=e152c25d-db65-40d8-8f25-8bf8ee5fa92b");
                console.log("Patient API response:", res.data);
                // Now check if res.data is an array or object with a property holding the array
                let patientList = [];
                if (Array.isArray(res.data)) {
                    patientList = res.data;
                } else if (res.data && Array.isArray(res.data.patients)) {
                    patientList = res.data.patients;
                } else if (res.data && Array.isArray(res.data.data)) {
                    patientList = res.data.data;
                } else {
                    // You may need to adjust this based on actual API response
                    console.error("Unexpected data format from patient API:", res.data);
                    patientList = [];
                }

                const opts = patientList.map((p: any) => ({
                    value: p.id || p.patient_id || p.phone_number, // choose proper id
                    label: p.id || p.name || "Unknown",
                }));

                setOptions(opts);
            } catch (error) {
                console.error("Error fetching patient list:", error);
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
            const res = await axios.get(`/api/patient_details/${selectedOption.value}`);
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
                    Search by Patient ID
                </label>
                <Select
                    options={options}
                    onChange={handleChange}
                    placeholder={loadingPatients ? "Loading patients..." : "Select patient..."}
                    isClearable
                    isLoading={loadingPatients}
                    className="w-full"
                    instanceId="patient-select"
                />
            </div>

            {loadingDetails && <p>Loading patient details...</p>}

            {patientData && (
                <div className="p-4 border rounded bg-gray-50">
                    <h2 className="text-lg font-bold">Patient ID: {patientData.id}</h2>
                    <p>Date of Birth: {patientData.date_of_birth}</p>
                    <p>Gender: {patientData.gender}</p>
                    <p>Phone: {patientData.phone_number}</p>

                    <div className="mt-3">
                        <h3 className="font-semibold">Medical History</h3>
                        <p>Surgeries: {patientData.medical_history.surgeries.join(", ")}</p>
                        <p>Conditions: {patientData.medical_history.conditions.join(", ")}</p>
                    </div>

                    <div className="mt-3">
                        <h3 className="font-semibold">Allergies</h3>
                        <p>Food: {patientData.allergies.food.join(", ")}</p>
                        <p>Medications: {patientData.allergies.medications.join(", ")}</p>
                    </div>
                </div>
            )}

        </div>
    );
}