import PatientTable from "@/components/custom-ui/patient-table";

export default function PatientsInfo() {
  return (
    <main className="p-8 pt-24">
      <h1 className="text-3xl font-bold mb-6">Patient Follow Up</h1>
      <p className="text-gray-600 mb-6">
        Review patients who had completed the prescription
      </p>
      <PatientTable />
    </main>
  );
}