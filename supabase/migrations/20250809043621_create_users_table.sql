-- Users table for authentication and basic user info
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Doctors table for doctor-specific information
CREATE TABLE public.doctors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  license_number text UNIQUE NOT NULL,
  specialization text,
  hospital_affiliation text,
  phone_number text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT doctors_pkey PRIMARY KEY (id)
);

-- Patients table for patient-specific information
CREATE TABLE public.patients (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date_of_birth date,
  gender text CHECK (gender IN ('male', 'female', 'other')),
  phone_number text,
  emergency_contact text,
  medical_history jsonb,
  allergies jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT patients_pkey PRIMARY KEY (id)
);

-- Conversations table for doctor-patient conversations
CREATE TABLE public.conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  context jsonb,
  created_by text NOT NULL DEFAULT 'system',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT conversations_pkey PRIMARY KEY (id)
);

-- Conversation messages table for storing conversation history
CREATE TABLE public.conversation_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('doctor', 'patient', 'system')),
  content text NOT NULL,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT conversation_messages_pkey PRIMARY KEY (id)
);

-- Notifications table for patient notifications
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('prescription', 'schedule', 'reminder', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

-- Prescription table based on Prescription Model
CREATE TABLE public.prescriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  patientId uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctorId uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  conversationId uuid REFERENCES public.conversations(id) ON DELETE SET NULL,
  originalInstructions text NOT NULL,
  language text NOT NULL CHECK (language IN ('en', 'ms')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'active', 'completed')),
  createdAt timestamp with time zone NOT NULL DEFAULT now(),
  updatedAt timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT prescriptions_pkey PRIMARY KEY (id)
);

-- Schedule table based on Schedule Model
CREATE TABLE public.schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  prescriptionId uuid NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('medication', 'activity')),
  title text NOT NULL,
  description text,
  dosage text,
  frequency text NOT NULL,
  startDate timestamp with time zone NOT NULL,
  endDate timestamp with time zone NOT NULL,
  times text[] NOT NULL DEFAULT '{}',
  followUpDate timestamp with time zone,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  createdAt timestamp with time zone NOT NULL DEFAULT now(),
  updatedAt timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT schedules_pkey PRIMARY KEY (id)
);

-- ParsedInstruction table to store AI-parsed instruction data
CREATE TABLE public.parsedInstructions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  prescriptionId uuid NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
  medications jsonb,
  activities jsonb,
  followUpDate timestamp with time zone,
  notes text,
  createdAt timestamp with time zone NOT NULL DEFAULT now(),
  updatedAt timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT parsedInstructions_pkey PRIMARY KEY (id)
);

-- ReviewDocuments table (moved to end since it depends on doctors)
CREATE TABLE public.reviewDocuments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  content json,
  doctorId uuid REFERENCES public.doctors(id) ON DELETE CASCADE,
  isReviewed boolean,
  CONSTRAINT reviewDocuments_pkey PRIMARY KEY (id)
);

-- Tasks table (moved to end since it depends on patients)
CREATE TABLE public.tasks (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  frequency smallint,
  patientId uuid REFERENCES public.patients(id) ON DELETE CASCADE,
  medication text,
  isCompleted boolean,
  CONSTRAINT tasks_pkey PRIMARY KEY (id)
);

-- Indexes for better query performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_doctors_user_id ON public.doctors(user_id);
CREATE INDEX idx_doctors_license_number ON public.doctors(license_number);
CREATE INDEX idx_doctors_is_active ON public.doctors(is_active);
CREATE INDEX idx_patients_user_id ON public.patients(user_id);
CREATE INDEX idx_patients_is_active ON public.patients(is_active);
CREATE INDEX idx_conversations_patient_id ON public.conversations(patient_id);
CREATE INDEX idx_conversations_doctor_id ON public.conversations(doctor_id);
CREATE INDEX idx_conversations_status ON public.conversations(status);
CREATE INDEX idx_conversation_messages_conversation_id ON public.conversation_messages(conversation_id);
CREATE INDEX idx_conversation_messages_sender_id ON public.conversation_messages(sender_id);
CREATE INDEX idx_conversation_messages_created_at ON public.conversation_messages(created_at);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX idx_prescriptions_patientId ON public.prescriptions(patientId);
CREATE INDEX idx_prescriptions_doctorId ON public.prescriptions(doctorId);
CREATE INDEX idx_prescriptions_status ON public.prescriptions(status);
CREATE INDEX idx_schedules_prescriptionId ON public.schedules(prescriptionId);
CREATE INDEX idx_schedules_type ON public.schedules(type);
CREATE INDEX idx_schedules_status ON public.schedules(status);
CREATE INDEX idx_parsedInstructions_prescriptionId ON public.parsedInstructions(prescriptionId);
CREATE INDEX idx_reviewDocuments_doctorId ON public.reviewDocuments(doctorId);
CREATE INDEX idx_reviewDocuments_isReviewed ON public.reviewDocuments(isReviewed);
CREATE INDEX idx_tasks_patientId ON public.tasks(patientId);
CREATE INDEX idx_tasks_isCompleted ON public.tasks(isCompleted);
