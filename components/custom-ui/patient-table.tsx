"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Button } from "../ui/button";

interface Patient {
    id: string;
    phone_number?: string;
    emergency_contact?: string;
    isreviewed?: boolean; // We'll store review status too
}

export default function PatientTable() {
    const [patientsData, setPatientsData] = useState<Patient[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const apiBase = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
                const apiKey =
                    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY || "";

                // 1. Fetch review documents
                const reviewRes = await fetch(
                    `${apiBase}/rest/v1/reviewdocuments?select=*`,
                    {
                        headers: {
                            apikey: apiKey,
                            Authorization: `Bearer ${apiKey}`,
                        },
                    }
                );
                if (!reviewRes.ok) throw new Error("Failed to fetch review docs");
                const reviewData = await reviewRes.json();

                // 2. Extract all patient IDs and keep review status
                const reviewMap = reviewData.reduce((acc: any, doc: any) => {
                    if (doc.patientid) {
                        acc[doc.patientid] = doc.isreviewed;
                    }
                    return acc;
                }, {});

                const allPatientIds = Object.keys(reviewMap);
                if (allPatientIds.length === 0) {
                    setPatientsData([]);
                    return;
                }

                // 3. Fetch patients
                const patientRes = await fetch(
                    `${apiBase}/rest/v1/patients?select=*`,
                    {
                        headers: {
                            apikey: apiKey,
                            Authorization: `Bearer ${apiKey}`,
                        },
                    }
                );
                if (!patientRes.ok) throw new Error("Failed to fetch patients");
                const patientData = await patientRes.json();

                // 4. Merge data
                const mergedPatients = patientData
                    .filter((p: any) => allPatientIds.includes(p.id))
                    .map((p: any) => ({
                        id: p.id,
                        phone_number: p.phone_number || "-",
                        emergency_contact: p.emergency_contact || "-",
                        isreviewed: reviewMap[p.id],
                    }));

                setPatientsData(mergedPatients);
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

    const handleReviewClick = (patient_id: string) => {
        window.open(`/doctors/review/${patient_id}`, "_blank");
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
                        <th className="border border-gray-300 px-4 py-2">Patient ID</th>
                        <th className="border border-gray-300 px-4 py-2">Phone Number</th>
                        <th className="border border-gray-300 px-4 py-2">Emergency Contact</th>
                        <th className="border border-gray-300 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPatients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{patient.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{patient.phone_number}</td>
                            <td className="border border-gray-300 px-4 py-2">{patient.emergency_contact}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <Button
                                    onClick={() => handleReviewClick(patient.id)}
                                    className="bg-blue-600 hover:bg-blue-700 transition text-white"
                                >
                                    Review
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {filteredPatients.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center py-4 text-gray-500">
                                No patients found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
