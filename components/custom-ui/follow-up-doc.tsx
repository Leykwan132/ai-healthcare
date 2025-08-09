"use client";

import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface FollowUpPageProps {
    params: { id: string };
}

export default function FollowUpPage({ params }: FollowUpPageProps) {
    const { id } = params;

    // Mock data - replace with your Supabase query
    const patient = {
        id,
        patientName: id === "1" ? "Alice Smith" : "Unknown Patient",
        illness: "Flu",
        prescription: "Tamiflu",
        completedPrescription: true,
        readyForReview: true,
        symptoms: [
            { symptom: "Fever", result: "Yes" },
            { symptom: "Cough", result: "Yes" },
            { symptom: "Fatigue", result: "No" },
        ],
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text(`Patient Review - ${patient.patientName}`, 14, 10);

        // Generate the table from patient symptoms
        const tableData = patient.symptoms.map((s) => [s.symptom, s.result]);

        autoTable(doc, {
            head: [["Symptom", "Result"]],
            body: tableData,
            startY: 20,
        });

        doc.save(`patient_${patient.id}_review.pdf`);
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">
                Patient Review - {patient.patientName}
            </h1>

            <table className="table-auto w-full border-collapse border border-gray-400">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-400 px-4 py-2">Symptom</th>
                        <th className="border border-gray-400 px-4 py-2">Result</th>
                    </tr>
                </thead>
                <tbody>
                    {patient.symptoms.map((s, idx) => (
                        <tr key={idx}>
                            <td className="border border-gray-400 px-4 py-2">
                                {s.symptom}
                            </td>
                            <td className="border border-gray-400 px-4 py-2">
                                {s.result}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Buttons */}
            <div className="flex gap-4">
                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                    onClick={() => alert("Marked Positive")}
                >
                    Positive
                </button>
                <button
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
                    onClick={() => alert("Marked Negative")}
                >
                    Negative
                </button>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded ml-auto"
                    onClick={exportPDF}
                >
                    Export as PDF
                </button>
            </div>
        </div>
    );
}
