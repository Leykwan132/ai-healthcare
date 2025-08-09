import PatientTable from "@/components/custom-ui/patient-table";

export default function PatientsInfo() {
  return (
    <main className="p-8 pt-24">
      <h1 className="text-3xl font-bold mb-6">Patients who completed prescription</h1>
      <p className="text-gray-600 mb-6">
        Review patients.
      </p>
      <PatientTable />
    </main>
  );
}