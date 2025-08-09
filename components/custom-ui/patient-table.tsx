"use client";
import React, { useState, useMemo } from "react";

interface Patient {
    id: number;
    patientName: string;
    illness: string;
    prescription: string;
    completedPrescription: boolean;
    readyForReview: boolean;
}

const patientsData: Patient[] = [
    {
        id: 1,
        patientName: "Alice Smith",
        illness: "Flu",
        prescription: "Tamiflu",
        completedPrescription: true,
        readyForReview: true,
    },
    {
        id: 2,
        patientName: "Bob Johnson",
        illness: "Asthma",
        prescription: "Inhaler",
        completedPrescription: false,
        readyForReview: false,
    },
    {
        id: 3,
        patientName: "Charlie Lee",
        illness: "Diabetes",
        prescription: "Insulin",
        completedPrescription: true,
        readyForReview: true,
    },
];

export default function PatientTable() {
    const [search, setSearch] = useState("");

    const filteredPatients = useMemo(() => {
        return patientsData.filter((patient) =>
            Object.values(patient).some((value) =>
                String(value).toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search]);

    const handleReviewClick = (id: number) => {
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
                        <th className="border border-gray-300 px-4 py-2">Patient Name</th>
                        <th className="border border-gray-300 px-4 py-2">Illness</th>
                        <th className="border border-gray-300 px-4 py-2">Prescription</th>
                        <th className="border border-gray-300 px-4 py-2">Completed Prescription</th>
                        <th className="border border-gray-300 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPatients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{patient.patientName}</td>
                            <td className="border border-gray-300 px-4 py-2">{patient.illness}</td>
                            <td className="border border-gray-300 px-4 py-2">{patient.prescription}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {patient.completedPrescription ? "Yes" : "No"}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    disabled={!patient.readyForReview}
                                    onClick={() => handleReviewClick(patient.id)}
                                    className={`px-3 py-1 rounded ${patient.readyForReview
                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                        }`}
                                >
                                    Review
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredPatients.length === 0 && (
                        <tr>
                            <td
                                colSpan={6}
                                className="text-center py-4 text-gray-500"
                            >
                                No patients found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
