"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

export default function PatientFilterSearch() {
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
    const [patientData, setPatientData] = useState<any>(null);

    // Fetch patient phone list
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axios.get("/api/patient_list");
                setOptions(res.data);
            } catch (error) {
                console.error("Error fetching patient list:", error);
            }
        };
        fetchPatients();
    }, []);

    // Handle selection by phone number
    const handleChange = async (selectedOption: any) => {
        if (!selectedOption) {
            setPatientData(null);
            return;
        }
        try {
            const res = await axios.get(`/api/patient_details/${selectedOption.value}`);
            setPatientData(res.data);
        } catch (error) {
            console.error("Error fetching patient details:", error);
        }
    };

    return (
        <div className="space-y-4">
            {/* Dropdown */}
            <div className="w-full max-w-xs"> {/* max-w-xs = ~20rem (320px) */}
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search by Phone Number
                </label>
                <Select
                    options={options}
                    onChange={handleChange}
                    placeholder="Select patient..."
                    isClearable
                    className="w-full"
                />
            </div>


            {/* Patient details */}
            {patientData && (
                <div className="p-4 border rounded bg-gray-50">
                    <h2 className="text-lg font-bold">{patientData.name}</h2>
                    <p className="text-sm text-gray-600">
                        Phone: {patientData.phone_number}
                    </p>
                    <p className="text-sm text-gray-600">
                        Illness: {patientData.illness}
                    </p>

                    <table className="mt-3 table-auto w-full border-collapse border border-gray-400">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2">Symptom</th>
                                <th className="border border-gray-400 px-4 py-2">Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientData.symptoms.map((s: any, idx: number) => (
                                <tr key={idx}>
                                    <td className="border border-gray-400 px-4 py-2">{s.symptom}</td>
                                    <td className="border border-gray-400 px-4 py-2">{s.result}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
