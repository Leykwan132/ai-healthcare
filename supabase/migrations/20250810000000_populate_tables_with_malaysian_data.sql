-- Migration: Populate tables with synthetic Malaysian data
-- This migration adds realistic Malaysian data for testing and development

-- Insert Users (Malaysian names and emails)
INSERT INTO public.users (id, email, full_name, avatar_url, created_at, updated_at) VALUES
-- Doctors
('550e8400-e29b-41d4-a716-446655440001', 'dr.ahmad@healthcare.my', 'Dr. Ahmad bin Ismail', 'https://avatars.githubusercontent.com/u/1?v=4', '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('550e8400-e29b-41d4-a716-446655440002', 'dr.siti@healthcare.my', 'Dr. Siti binti Mohamed', 'https://avatars.githubusercontent.com/u/2?v=4', '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('550e8400-e29b-41d4-a716-446655440003', 'dr.raj@healthcare.my', 'Dr. Rajesh a/l Kumar', 'https://avatars.githubusercontent.com/u/3?v=4', '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('550e8400-e29b-41d4-a716-446655440004', 'dr.lim@healthcare.my', 'Dr. Lim Mei Ling', 'https://avatars.githubusercontent.com/u/4?v=4', '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('550e8400-e29b-41d4-a716-446655440005', 'dr.wong@healthcare.my', 'Dr. Wong Chee Keong', 'https://avatars.githubusercontent.com/u/5?v=4', '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),

-- Patients
('550e8400-e29b-41d4-a716-446655440006', 'ali.rahman@email.com', 'Ali bin Rahman', 'https://avatars.githubusercontent.com/u/6?v=4', '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('550e8400-e29b-41d4-a716-446655440007', 'fatimah.ahmad@email.com', 'Fatimah binti Ahmad', 'https://avatars.githubusercontent.com/u/7?v=4', '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('550e8400-e29b-41d4-a716-446655440008', 'kumar.selvam@email.com', 'Kumar a/l Selvam', 'https://avatars.githubusercontent.com/u/8?v=4', '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('550e8400-e29b-41d4-a716-446655440009', 'tan.siew.lin@email.com', 'Tan Siew Lin', 'https://avatars.githubusercontent.com/u/9?v=4', '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('550e8400-e29b-41d4-a716-446655440010', 'mohamed.ibrahim@email.com', 'Mohamed bin Ibrahim', 'https://avatars.githubusercontent.com/u/10?v=4', '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('550e8400-e29b-41d4-a716-446655440011', 'nurul.ain@email.com', 'Nurul Ain binti Zainal', 'https://avatars.githubusercontent.com/u/11?v=4', '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('550e8400-e29b-41d4-a716-446655440012', 'lee.chong.wei@email.com', 'Lee Chong Wei', 'https://avatars.githubusercontent.com/u/12?v=4', '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('550e8400-e29b-41d4-a716-446655440013', 'priya.devi@email.com', 'Priya Devi a/p Rajan', 'https://avatars.githubusercontent.com/u/13?v=4', '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('550e8400-e29b-41d4-a716-446655440014', 'ahmad.faiz@email.com', 'Ahmad Faiz bin Osman', 'https://avatars.githubusercontent.com/u/14?v=4', '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('550e8400-e29b-41d4-a716-446655440015', 'chen.wei.lin@email.com', 'Chen Wei Lin', 'https://avatars.githubusercontent.com/u/15?v=4', '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08');

-- Insert Doctors
INSERT INTO public.doctors (id, user_id, license_number, specialization, hospital_affiliation, phone_number, is_active, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'MD001234', 'Cardiology', 'Hospital Kuala Lumpur', '+60123456789', true, '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'MD001235', 'Pediatrics', 'Hospital Putrajaya', '+60123456790', true, '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'MD001236', 'Orthopedics', 'Hospital Selayang', '+60123456791', true, '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'MD001237', 'Neurology', 'Hospital Sungai Buloh', '+60123456792', true, '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'MD001238', 'General Medicine', 'Hospital Ampang', '+60123456793', true, '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08');

-- Insert Patients
INSERT INTO public.patients (id, user_id, date_of_birth, gender, phone_number, emergency_contact, medical_history, allergies, is_active, created_at, updated_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', '1985-03-15', 'male', '+60123456794', '+60123456795', '{"conditions": ["Hypertension", "Diabetes Type 2"], "surgeries": ["Appendectomy 2010"]}', '{"medications": ["Penicillin"], "food": ["Shellfish"]}', true, '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007', '1990-07-22', 'female', '+60123456796', '+60123456797', '{"conditions": ["Asthma"], "surgeries": []}', '{"medications": [], "food": ["Nuts"]}', true, '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', '1978-11-08', 'male', '+60123456798', '+60123456799', '{"conditions": ["High Cholesterol"], "surgeries": ["Knee Surgery 2015"]}', '{"medications": [], "food": []}', true, '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440009', '1992-04-12', 'female', '+60123456800', '+60123456801', '{"conditions": [], "surgeries": []}', '{"medications": [], "food": []}', true, '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440010', '1982-09-30', 'male', '+60123456802', '+60123456803', '{"conditions": ["Diabetes Type 1"], "surgeries": ["Gallbladder Removal 2018"]}', '{"medications": ["Sulfa drugs"], "food": []}', true, '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440011', '1988-12-05', 'female', '+60123456804', '+60123456805', '{"conditions": ["Migraine"], "surgeries": []}', '{"medications": [], "food": ["Dairy"]}', true, '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440012', '1995-01-18', 'male', '+60123456806', '+60123456807', '{"conditions": [], "surgeries": []}', '{"medications": [], "food": []}', true, '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('770e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440013', '1987-06-25', 'female', '+60123456808', '+60123456809', '{"conditions": ["Thyroid Disorder"], "surgeries": ["Thyroidectomy 2020"]}', '{"medications": [], "food": []}', true, '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('770e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440014', '1993-08-14', 'male', '+60123456810', '+60123456811', '{"conditions": ["Hypertension"], "surgeries": []}', '{"medications": [], "food": []}', true, '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08'),
('770e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440015', '1989-02-28', 'female', '+60123456812', '+60123456813', '{"conditions": ["Anxiety"], "surgeries": []}', '{"medications": [], "food": ["Gluten"]}', true, '2024-01-15 08:00:00+08', '2024-01-15 08:00:00+08');

-- Insert Conversations
INSERT INTO public.conversations (id, patient_id, doctor_id, status, context, created_by, created_at, updated_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'active', '{"purpose": "consultation", "appointmentId": "APT001"}', 'system', '2024-01-15 09:00:00+08', '2024-01-15 09:00:00+08'),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'active', '{"purpose": "follow_up", "appointmentId": "APT002"}', 'system', '2024-01-15 10:00:00+08', '2024-01-15 10:00:00+08'),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'active', '{"purpose": "treatment", "appointmentId": "APT003"}', 'system', '2024-01-15 11:00:00+08', '2024-01-15 11:00:00+08'),
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'active', '{"purpose": "consultation", "appointmentId": "APT004"}', 'system', '2024-01-15 12:00:00+08', '2024-01-15 12:00:00+08'),
('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', 'active', '{"purpose": "follow_up", "appointmentId": "APT005"}', 'system', '2024-01-15 13:00:00+08', '2024-01-15 13:00:00+08');

-- Insert Conversation Messages
INSERT INTO public.conversation_messages (id, conversation_id, sender_id, sender_type, content, metadata, created_at) VALUES
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'doctor', 'Selamat pagi, Encik Ali. Bagaimana keadaan anda hari ini?', '{"messageType": "greeting"}', '2024-01-15 09:00:00+08'),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', 'patient', 'Selamat pagi doktor. Saya rasa sedikit pening dan tekanan darah tinggi.', '{"messageType": "symptom_report"}', '2024-01-15 09:05:00+08'),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'doctor', 'Saya faham. Mari kita periksa tekanan darah anda dan lihat bacaan terkini.', '{"messageType": "examination"}', '2024-01-15 09:10:00+08'),
('990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'doctor', 'Good morning, Puan Fatimah. How is your asthma condition today?', '{"messageType": "greeting"}', '2024-01-15 10:00:00+08'),
('990e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', 'patient', 'Alhamdulillah doktor, asma saya sudah lebih baik sejak mengambil ubat yang doktor berikan.', '{"messageType": "progress_report"}', '2024-01-15 10:05:00+08');

-- Insert Prescriptions
INSERT INTO public.prescriptions (id, patientId, doctorId, conversationId, originalInstructions, language, status, createdAt, updatedAt) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Pesakit perlu mengambil ubat tekanan darah Amlodipine 5mg sekali sehari pada waktu pagi. Juga perlu mengambil ubat diabetes Metformin 500mg dua kali sehari selepas makan. Pesakit perlu melakukan senaman ringan selama 30 minit setiap hari dan mengawal pemakanan.', 'ms', 'confirmed', '2024-01-15 09:30:00+08', '2024-01-15 09:30:00+08'),
('aa0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'Patient to continue using Ventolin inhaler 2 puffs as needed for asthma symptoms. Start on Flixotide 250mcg inhaler 2 puffs twice daily for maintenance. Avoid triggers like dust and smoke. Follow up in 2 weeks.', 'en', 'confirmed', '2024-01-15 10:30:00+08', '2024-01-15 10:30:00+08'),
('aa0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'Pesakit perlu mengambil ubat kolesterol Simvastatin 20mg sekali sehari pada waktu malam. Juga perlu melakukan senaman berjalan kaki selama 45 minit setiap hari dan mengurangkan pengambilan makanan berlemak.', 'ms', 'confirmed', '2024-01-15 11:30:00+08', '2024-01-15 11:30:00+08'),
('aa0e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 'Patient requires regular check-up for general health monitoring. No specific medication needed at this time. Continue healthy lifestyle with balanced diet and regular exercise.', 'en', 'confirmed', '2024-01-15 12:30:00+08', '2024-01-15 12:30:00+08'),
('aa0e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440005', 'Pesakit perlu mengambil insulin Novorapid 10 units sebelum sarapan dan makan malam. Juga perlu mengambil Metformin 1000mg dua kali sehari. Perlu memeriksa gula darah setiap hari dan mengawal pemakanan dengan teliti.', 'ms', 'confirmed', '2024-01-15 13:30:00+08', '2024-01-15 13:30:00+08');

-- Insert ParsedInstructions
INSERT INTO public.parsedInstructions (id, prescriptionId, medications, activities, followUpDate, notes, createdAt, updatedAt) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', 
'[{"name": "Amlodipine", "dosage": "5mg", "frequency": "once daily", "duration": "ongoing", "timing": "morning", "instructions": "Take with water"}]', 
'[{"name": "Light Exercise", "duration": "30 minutes", "frequency": "daily", "timing": "anytime", "instructions": "Walking or light stretching"}]', 
'2024-02-15 09:00:00+08', 'Monitor blood pressure weekly', '2024-01-15 09:30:00+08', '2024-01-15 09:30:00+08'),

('bb0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440002', 
'[{"name": "Ventolin Inhaler", "dosage": "2 puffs", "frequency": "as needed", "duration": "ongoing", "timing": "when symptoms occur", "instructions": "Shake well before use"}, {"name": "Flixotide Inhaler", "dosage": "250mcg", "frequency": "twice daily", "duration": "ongoing", "timing": "morning and evening", "instructions": "Rinse mouth after use"}]', 
'[]', 
'2024-01-29 10:00:00+08', 'Avoid dust and smoke triggers', '2024-01-15 10:30:00+08', '2024-01-15 10:30:00+08'),

('bb0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440003', 
'[{"name": "Simvastatin", "dosage": "20mg", "frequency": "once daily", "duration": "ongoing", "timing": "evening", "instructions": "Take with food"}]', 
'[{"name": "Walking Exercise", "duration": "45 minutes", "frequency": "daily", "timing": "morning or evening", "instructions": "Brisk walking"}]', 
'2024-02-15 11:00:00+08', 'Reduce fatty food intake', '2024-01-15 11:30:00+08', '2024-01-15 11:30:00+08'),

('bb0e8400-e29b-41d4-a716-446655440004', 'aa0e8400-e29b-41d4-a716-446655440004', 
'[]', 
'[{"name": "Regular Exercise", "duration": "30 minutes", "frequency": "3-4 times weekly", "timing": "anytime", "instructions": "Moderate intensity exercise"}]', 
'2024-02-15 12:00:00+08', 'Maintain healthy lifestyle', '2024-01-15 12:30:00+08', '2024-01-15 12:30:00+08'),

('bb0e8400-e29b-41d4-a716-446655440005', 'aa0e8400-e29b-41d4-a716-446655440005', 
'[{"name": "Novorapid Insulin", "dosage": "10 units", "frequency": "twice daily", "duration": "ongoing", "timing": "before breakfast and dinner", "instructions": "Inject subcutaneously"}, {"name": "Metformin", "dosage": "1000mg", "frequency": "twice daily", "duration": "ongoing", "timing": "with meals", "instructions": "Take with food"}]', 
'[{"name": "Blood Sugar Monitoring", "duration": "5 minutes", "frequency": "daily", "timing": "morning", "instructions": "Check fasting blood sugar"}]', 
'2024-02-15 13:00:00+08', 'Monitor blood sugar daily', '2024-01-15 13:30:00+08', '2024-01-15 13:30:00+08');

-- Insert Schedules
INSERT INTO public.schedules (id, prescriptionId, type, title, description, dosage, frequency, startDate, endDate, times, followUpDate, status, createdAt, updatedAt) VALUES
-- Medication schedules
('cc0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', 'medication', 'Amlodipine 5mg', 'Blood pressure medication', '5mg', 'once daily', '2024-01-15 00:00:00+08', '2024-12-31 23:59:59+08', ARRAY['08:00'], '2024-02-15 09:00:00+08', 'active', '2024-01-15 09:30:00+08', '2024-01-15 09:30:00+08'),
('cc0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440001', 'medication', 'Metformin 500mg', 'Diabetes medication', '500mg', 'twice daily', '2024-01-15 00:00:00+08', '2024-12-31 23:59:59+08', ARRAY['08:00', '20:00'], '2024-02-15 09:00:00+08', 'active', '2024-01-15 09:30:00+08', '2024-01-15 09:30:00+08'),
('cc0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440001', 'activity', 'Light Exercise', 'Daily light exercise for health', '', 'daily', '2024-01-15 00:00:00+08', '2024-12-31 23:59:59+08', ARRAY['07:00'], '2024-02-15 09:00:00+08', 'active', '2024-01-15 09:30:00+08', '2024-01-15 09:30:00+08'),

('cc0e8400-e29b-41d4-a716-446655440004', 'aa0e8400-e29b-41d4-a716-446655440002', 'medication', 'Ventolin Inhaler', 'Asthma rescue medication', '2 puffs', 'as needed', '2024-01-15 00:00:00+08', '2024-12-31 23:59:59+08', ARRAY[]::text[], '2024-01-29 10:00:00+08', 'active', '2024-01-15 10:30:00+08', '2024-01-15 10:30:00+08'),
('cc0e8400-e29b-41d4-a716-446655440005', 'aa0e8400-e29b-41d4-a716-446655440002', 'medication', 'Flixotide Inhaler', 'Asthma maintenance medication', '250mcg', 'twice daily', '2024-01-15 00:00:00+08', '2024-12-31 23:59:59+08', ARRAY['08:00', '20:00'], '2024-01-29 10:00:00+08', 'active', '2024-01-15 10:30:00+08', '2024-01-15 10:30:00+08'),

('cc0e8400-e29b-41d4-a716-446655440006', 'aa0e8400-e29b-41d4-a716-446655440003', 'medication', 'Simvastatin 20mg', 'Cholesterol medication', '20mg', 'once daily', '2024-01-15 00:00:00+08', '2024-12-31 23:59:59+08', ARRAY['20:00'], '2024-02-15 11:00:00+08', 'active', '2024-01-15 11:30:00+08', '2024-01-15 11:30:00+08'),
('cc0e8400-e29b-41d4-a716-446655440007', 'aa0e8400-e29b-41d4-a716-446655440003', 'activity', 'Walking Exercise', 'Daily walking for health', '', 'daily', '2024-01-15 00:00:00+08', '2024-12-31 23:59:59+08', ARRAY['07:00'], '2024-02-15 11:00:00+08', 'active', '2024-01-15 11:30:00+08', '2024-01-15 11:30:00+08'),

('cc0e8400-e29b-41d4-a716-446655440008', 'aa0e8400-e29b-41d4-a716-446655440004', 'activity', 'Regular Exercise', 'Moderate intensity exercise', '', '3-4 times weekly', '2024-01-15 00:00:00+08', '2024-12-31 23:59:59+08', ARRAY['18:00'], '2024-02-15 12:00:00+08', 'active', '2024-01-15 12:30:00+08', '2024-01-15 12:30:00+08'),

('cc0e8400-e29b-41d4-a716-446655440009', 'aa0e8400-e29b-41d4-a716-446655440005', 'medication', 'Novorapid Insulin', 'Fast-acting insulin', '10 units', 'twice daily', '2024-01-15 00:00:00+08', '2024-12-31 23:59:59+08', ARRAY['08:00', '19:00'], '2024-02-15 13:00:00+08', 'active', '2024-01-15 13:30:00+08', '2024-01-15 13:30:00+08'),
('cc0e8400-e29b-41d4-a716-446655440010', 'aa0e8400-e29b-41d4-a716-446655440005', 'medication', 'Metformin 1000mg', 'Diabetes medication', '1000mg', 'twice daily', '2024-01-15 00:00:00+08', '2024-12-31 23:59:59+08', ARRAY['08:00', '20:00'], '2024-02-15 13:00:00+08', 'active', '2024-01-15 13:30:00+08', '2024-01-15 13:30:00+08'),
('cc0e8400-e29b-41d4-a716-446655440011', 'aa0e8400-e29b-41d4-a716-446655440005', 'activity', 'Blood Sugar Monitoring', 'Daily blood sugar check', '', 'daily', '2024-01-15 00:00:00+08', '2024-12-31 23:59:59+08', ARRAY['07:00'], '2024-02-15 13:00:00+08', 'active', '2024-01-15 13:30:00+08', '2024-01-15 13:30:00+08');

-- Insert Tasks
INSERT INTO public.tasks (created_at, frequency, patientId, medication, isCompleted) VALUES
('2024-01-15 08:00:00+08', 1, '770e8400-e29b-41d4-a716-446655440001', 'Amlodipine 5mg', false),
('2024-01-15 08:00:00+08', 2, '770e8400-e29b-41d4-a716-446655440001', 'Metformin 500mg', false),
('2024-01-15 08:00:00+08', 1, '770e8400-e29b-41d4-a716-446655440002', 'Ventolin Inhaler', false),
('2024-01-15 08:00:00+08', 2, '770e8400-e29b-41d4-a716-446655440002', 'Flixotide Inhaler', false),
('2024-01-15 08:00:00+08', 1, '770e8400-e29b-41d4-a716-446655440003', 'Simvastatin 20mg', false);

-- Insert ReviewDocuments
INSERT INTO public.reviewDocuments (id, created_at, content, doctorId, isReviewed) VALUES
('dd0e8400-e29b-41d4-a716-446655440001', '2024-01-15 08:00:00+08', '{"documentType": "lab_report", "patientId": "770e8400-e29b-41d4-a716-446655440001", "results": {"bloodPressure": "140/90", "bloodSugar": "7.2", "cholesterol": "5.8"}, "recommendations": "Continue current medication and lifestyle modifications"}', '660e8400-e29b-41d4-a716-446655440001', true),
('dd0e8400-e29b-41d4-a716-446655440002', '2024-01-15 08:00:00+08', '{"documentType": "xray_report", "patientId": "770e8400-e29b-41d4-a716-446655440003", "results": {"finding": "Normal chest X-ray", "impression": "No significant abnormality detected"}, "recommendations": "Continue current treatment plan"}', '660e8400-e29b-41d4-a716-446655440003', true),
('dd0e8400-e29b-41d4-a716-446655440003', '2024-01-15 08:00:00+08', '{"documentType": "ecg_report", "patientId": "770e8400-e29b-41d4-a716-446655440005", "results": {"rhythm": "Normal sinus rhythm", "rate": "72 bpm"}, "recommendations": "Continue diabetes management"}', '660e8400-e29b-41d4-a716-446655440005', false);

-- Insert Notifications
INSERT INTO public.notifications (id, user_id, type, title, message, is_read, metadata, created_at) VALUES
('ee0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'prescription', 'Prescription Ready', 'Prescription baru telah disediakan oleh Dr. Ahmad. Sila semak butiran ubat-ubatan anda.', false, '{"prescriptionId": "aa0e8400-e29b-41d4-a716-446655440001"}', '2024-01-15 09:30:00+08'),
('ee0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007', 'schedule', 'Schedule Reminder', 'Jangan lupa untuk mengambil ubat Flixotide pada pukul 8:00 pagi dan 8:00 malam.', false, '{"scheduleId": "cc0e8400-e29b-41d4-a716-446655440005"}', '2024-01-15 10:30:00+08'),
('ee0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440008', 'reminder', 'Exercise Reminder', 'Masa untuk senaman berjalan kaki selama 45 minit.', false, '{"scheduleId": "cc0e8400-e29b-41d4-a716-446655440007"}', '2024-01-15 11:30:00+08'),
('ee0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440009', 'system', 'Welcome Message', 'Selamat datang ke sistem penjagaan kesihatan kami. Sila lengkapkan profil anda.', false, '{}', '2024-01-15 12:00:00+08'),
('ee0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440010', 'prescription', 'Prescription Updated', 'Prescription anda telah dikemas kini oleh Dr. Wong. Sila semak perubahan terkini.', false, '{"prescriptionId": "aa0e8400-e29b-41d4-a716-446655440005"}', '2024-01-15 13:30:00+08');
