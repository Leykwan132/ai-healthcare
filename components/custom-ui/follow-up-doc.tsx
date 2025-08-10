"use client";

import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "../ui/button";

interface FollowUpPageProps {
    params: { id: string };
}

interface Question {
    question: string;
    answer: string;
}

interface Patient {
    id: string;
    patientName: string;
    illness: string;
    prescription: string;
    completedPrescription: boolean;
    readyForReview: boolean;
    questions: Question[];
    aiSuggestedScore?: number;
}

export default function FollowUpPage({ params }: FollowUpPageProps) {
    const { id } = params;
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<"positive" | "negative" | null>(null);

    // Fetch patient data from API
    useEffect(() => {
        const fetchPatientData = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiBase = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
                const apiKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY || "";
                const response = await fetch(
                    `${apiBase}/rest/v1/reviewdocuments?patientid=eq.${id}`,
                    {
                        headers: {
                            apikey: apiKey,
                            Authorization: `Bearer ${apiKey}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch patient data: ${response.statusText}`);
                }

                const data = await response.json();
                if (!data.length) {
                    setPatient(null);
                    return;
                }

                const record = data[0];

                // Parse JSON inside `content`
                let parsedContent;
                try {
                    parsedContent = JSON.parse(record.content);
                } catch (err) {
                    throw new Error("Invalid content format from API");
                }

                const patientData: Patient = {
                    id: record.patientid,
                    patientName: "Unknown", // Replace if you have real name
                    illness: "",
                    prescription: "",
                    completedPrescription: false,
                    readyForReview: false,
                    aiSuggestedScore: parsedContent.ai_suggested_score,
                    questions: parsedContent.qa_pairs.map((qa: any) => ({
                        question: qa.question,
                        answer: qa.answer,
                    })),
                };

                setPatient(patientData);
            } catch (err: any) {
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [id]);

    const exportPDF = () => {
        if (!patient) return;

        const doc = new jsPDF();
        doc.text(`Patient Review - ${patient.patientName}`, 14, 10);

        const tableData = patient.questions.map((s) => [s.question, s.answer]);

        autoTable(doc, {
            head: [["Question", "Answer"]],
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
        if (!selectedStatus || !patient) return;

        try {
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

    if (loading) return <div className="p-6">Loading patient data...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
    if (!patient) return <div className="p-6">No patient data found.</div>;

    return (
        <div className="p-6 space-y-6 relative">
            {/* Title and Export button */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Patient Review - {patient.patientName}</h1>
                <Button
                    onClick={exportPDF}
                    className="bg-blue-600 hover:bg-blue-700 transition text-white"
                >
                    Export
                </Button>
            </div>

            {/* Table */}
            <table className="table-auto w-full border-collapse border border-gray-400">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-400 px-4 py-2">Question</th>
                        <th className="border border-gray-400 px-4 py-2">Answer</th>
                    </tr>
                </thead>
                <tbody>
                    {patient.questions.map((s, idx) => (
                        <tr key={idx}>
                            <td className="border border-gray-400 px-4 py-2">{s.question}</td>
                            <td className="border border-gray-400 px-4 py-2">{s.answer}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Positive / Negative buttons */}
            <div className="flex gap-4 justify-end">
                <Button
                    onClick={() => handleOpenModal("positive")}
                    className="bg-green-600 hover:bg-green-700 transition text-white"
                >
                    Positive
                </Button>
                <Button
                    onClick={() => handleOpenModal("negative")}
                    className="bg-red-600 hover:bg-red-700 transition text-white"
                >
                    Negative
                </Button>
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
                            <Button
                                onClick={handleConfirm}
                                className="bg-blue-600 hover:bg-blue-700 transition text-white"
                            >
                                Confirm
                            </Button>
                            <Button
                                onClick={handleCancel}
                                className="bg-gray-700 hover:bg-gray-300 transition text-white"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}