"use client";
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";

interface Patient {
    id: string;
    date_of_birth?: string;
    gender?: string;
    phone_number?: string;
    medical_history?: {
        surgeries: string[];
        conditions: string[];
    };
    allergies?: {
        food: string[];
        medications: string[];
    };
    is_active?: boolean;
    // Add other fields as needed
}

export default function PatientTable() {
    const [patientsData, setPatientsData] = useState<Patient[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
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
                
                setPatientsData(patientList);
            } catch (error) {
                console.error("Error fetching patients:", error);
                setPatientsData([]);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = useMemo(() => {
        return patientsData.filter((patient) =>
            Object.values(patient).some((value) =>
                String(value).toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, patientsData]);

    const handleReviewClick = (id: string) => {
        window.open(`/doctors/review/${id}`, "_blank");
    };

    return (
        <div className="p-4 space-y-4">
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search..."
                className="border px-3 py-2 rounded w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Table */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Phone Number</th>
                        <th className="border border-gray-300 px-4 py-2">Gender</th>
                        <th className="border border-gray-300 px-4 py-2">DOB</th>
                        <th className="border border-gray-300 px-4 py-2">Surgeries</th>
                        <th className="border border-gray-300 px-4 py-2">Conditions</th>
                        <th className="border border-gray-300 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPatients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{patient.phone_number || "N/A"}</td>
                            <td className="border border-gray-300 px-4 py-2">{patient.gender || "N/A"}</td>
                            <td className="border border-gray-300 px-4 py-2">{patient.date_of_birth || "N/A"}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {patient.medical_history?.surgeries ? patient.medical_history.surgeries.join(", ") : "N/A"}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {patient.medical_history?.conditions ? patient.medical_history.conditions.join(", ") : "N/A"}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <Button
                                    onClick={() => handleReviewClick(patient.id)}
                                    className="bg-blue-600  hover:bg-blue-700 transition text-white"
                                >
                                    Review
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {filteredPatients.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-4 text-gray-500">
                                No patients found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
