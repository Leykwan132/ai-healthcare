"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface FollowUpPageProps {
    params: { id: string };
}

export default function FollowUpPage({ params }: FollowUpPageProps) {
    const { id } = params;

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

    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<"positive" | "negative" | null>(null);

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text(`Patient Review - ${patient.patientName}`, 14, 10);

        const tableData = patient.symptoms.map((s) => [s.symptom, s.result]);

        autoTable(doc, {
            head: [["Symptom", "Result"]],
            body: tableData,
            startY: 20,
        });

        doc.save(`patient_${patient.id}_review.pdf`);
    };

    const handleOpenModal = (status: "positive" | "negative") => {
        setSelectedStatus(status);
        setShowModal(true);
    };

    const handleConfirm = async () => {
        if (!selectedStatus) return;

        try {
            // Replace with actual API call
            alert(`Patient marked as ${selectedStatus} successfully!`);
        } catch (error) {
            alert("Failed to mark patient status.");
            console.error(error);
        } finally {
            setShowModal(false);
            setSelectedStatus(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setSelectedStatus(null);
    };

    return (
        <div className="p-6 space-y-6 relative">
            {/* Title and Export button */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    Patient Review - {patient.patientName}
                </h1>
                <button
                    onClick={exportPDF}
                    className="bg-blue-600  hover:bg-blue-700 transition px-4 py-2 rounded-xl text-lg shadow-lg text-white"
                >
                    Export
                </button>
            </div>

            {/* Table */}
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
                            <td className="border border-gray-400 px-4 py-2">{s.symptom}</td>
                            <td className="border border-gray-400 px-4 py-2">{s.result}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Positive / Negative buttons */}
            <div className="flex gap-4 justify-end">
                <button
                    className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-xl text-lg shadow-lg text-white"
                    onClick={() => handleOpenModal("positive")}
                >
                    Positive
                </button>
                <button
                    className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-xl text-lg shadow-lg text-white"
                    onClick={() => handleOpenModal("negative")}
                >
                    Negative
                </button>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
                        <p className="mb-6">
                            Are you sure you want to mark this patient as{" "}
                            <span className="font-bold capitalize">{selectedStatus}</span>?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handleConfirm}
                                className={`px-4 py-2 rounded-xl text-white ${selectedStatus === "positive"
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-red-600 hover:bg-red-700"
                                    }`}
                            >
                                Confirm
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}