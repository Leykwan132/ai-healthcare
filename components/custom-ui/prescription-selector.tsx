"use client";

import React, { useState } from "react";

const prescriptionOptions = [
    { value: "Paracetamol", label: "Paracetamol" },
    { value: "Ibuprofen", label: "Ibuprofen" },
    { value: "Amoxicillin", label: "Amoxicillin" },
    { value: "Cough Syrup", label: "Cough Syrup" },
];

interface Prescription {
    medicine: string;
    frequency: number;
}

export default function PrescriptionSelector() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState("");
    const [frequency, setFrequency] = useState<number | "">("");
    const [editIndex, setEditIndex] = useState<number | null>(null); // track editing index

    const handleAddOrUpdate = () => {
        if (!selectedMedicine || !frequency) return;

        if (editIndex !== null) {
            // Update existing prescription
            const updated = [...prescriptions];
            updated[editIndex] = {
                medicine: selectedMedicine,
                frequency: Number(frequency),
            };
            setPrescriptions(updated);
        } else {
            // Add new prescription
            setPrescriptions([
                ...prescriptions,
                { medicine: selectedMedicine, frequency: Number(frequency) },
            ]);
        }

        // Reset
        setSelectedMedicine("");
        setFrequency("");
        setEditIndex(null);
        setIsModalOpen(false);
    };

    const handleDelete = (index: number) => {
        setPrescriptions(prescriptions.filter((_, i) => i !== index));
    };

    const handleEdit = (index: number) => {
        const prescription = prescriptions[index];
        setSelectedMedicine(prescription.medicine);
        setFrequency(prescription.frequency);
        setEditIndex(index);
        setIsModalOpen(true);
    };

    // Filter options to remove already selected medicines (unless editing)
    const availableOptions = prescriptionOptions.filter(
        (opt) =>
            !prescriptions.some(
                (p, i) => p.medicine === opt.value && i !== editIndex
            )
    );

    return (
        <div className="w-96 space-y-4">
            <label className="block text-sm font-medium text-gray-700">
                Prescriptions
            </label>

            {/* Box with list */}
            <div className="border rounded p-3 min-h-[80px] max-h-[200px] overflow-y-auto space-y-2">
                {prescriptions.map((p, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-2 rounded"
                    >
                        <span>
                            {p.medicine} –{" "}
                            <span className="text-gray-500">{p.frequency}x/day</span>
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(index)}
                                className="text-blue-500 hover:text-blue-700"
                                title="Edit"
                            >
                                ✎
                            </button>
                            <button
                                onClick={() => handleDelete(index)}
                                className="text-red-500 hover:text-red-700"
                                title="Delete"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add button inside box */}
                <button
                    onClick={() => {
                        setEditIndex(null);
                        setSelectedMedicine("");
                        setFrequency("");
                        setIsModalOpen(true);
                    }}
                    className="w-full py-2 border border-dashed rounded text-blue-600 hover:bg-blue-50"
                >
                    + Add Meds
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded-lg p-6 w-80 space-y-4 shadow-lg">
                        <h2 className="text-lg font-semibold">
                            {editIndex !== null ? "Edit Prescription" : "Add Prescription"}
                        </h2>

                        {/* Medicine dropdown */}
                        <select
                            value={selectedMedicine}
                            onChange={(e) => setSelectedMedicine(e.target.value)}
                            className="border rounded p-2 w-full"
                        >
                            <option value="">Select medicine...</option>
                            {availableOptions.length > 0 ? (
                                availableOptions.map((med) => (
                                    <option key={med.value} value={med.value}>
                                        {med.label}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No medicines available</option>
                            )}
                        </select>

                        {/* Frequency numeric */}
                        <input
                            type="number"
                            placeholder="Frequency per day"
                            value={frequency}
                            onChange={(e) =>
                                setFrequency(e.target.value ? Number(e.target.value) : "")
                            }
                            min={1}
                            className="border rounded p-2 w-full"
                        />

                        {/* Buttons */}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditIndex(null);
                                    setSelectedMedicine("");
                                    setFrequency("");
                                }}
                                className="px-3 py-1 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddOrUpdate}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                disabled={!selectedMedicine || !frequency}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}