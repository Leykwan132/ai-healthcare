// External Supabase API service for fetching patients
const EXTERNAL_SUPABASE_URL = 'https://tmfkvxofwewpjtpafjkq.supabase.co/rest/v1';

// Note: Replace YOUR_ANON_KEY with the actual API key when available
const EXTERNAL_SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

export interface ExternalPatient {
    id: string;
    date_of_birth?: string;
    gender?: string;
    phone_number?: string;
    emergency_contact?: string;
    medical_history?: {
        surgeries: string[];
        conditions: string[];
    };
    allergies?: {
        food: string[];
        medications: string[];
    };
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    // Add other fields as needed from the external API
}

export async function fetchExternalPatients(): Promise<ExternalPatient[]> {
    try {
        const response = await fetch(`${EXTERNAL_SUPABASE_URL}/patients`, {
            headers: {
                'apikey': EXTERNAL_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${EXTERNAL_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const patients = await response.json();
        return patients || [];
    } catch (error) {
        console.error('Error fetching patients from external Supabase:', error);
        throw error;
    }
}

export async function fetchExternalPatientById(patientId: string): Promise<ExternalPatient | null> {
    try {
        const response = await fetch(`${EXTERNAL_SUPABASE_URL}/patients?id=eq.${patientId}`, {
            headers: {
                'apikey': EXTERNAL_SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${EXTERNAL_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const patients = await response.json();
        return patients && patients.length > 0 ? patients[0] : null;
    } catch (error) {
        console.error('Error fetching patient by ID from external Supabase:', error);
        throw error;
    }
}
