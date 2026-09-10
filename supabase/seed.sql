-- Seed Data for AI Healthcare Access & Emergency Booking Assistant Demo

-- 1. Insert Seed Users
INSERT INTO public.users (id, email, role, full_name, phone) VALUES
('11111111-1111-1111-1111-111111111111', 'rahul@patient.com', 'PATIENT', 'Rahul Sharma', '+919876543210'),
('22222222-2222-2222-2222-222222222222', 'cityhospital@staff.com', 'HOSPITAL_STAFF', 'Dr. Ananya Rao', '+919876543211'),
('33333333-3333-3333-3333-333333333333', 'driver1@ambulance.com', 'AMBULANCE_DRIVER', 'Suresh Kumar', '+919876543212');

-- 2. Insert Patient Profile
INSERT INTO public.patient_profiles (id, user_id, full_name, age, gender, phone, blood_group, allergies, medical_conditions, regular_medications) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Rahul Sharma', 54, 'Male', '+919876543210', 'O+', ARRAY['Penicillin'], ARRAY['Diabetes Type 2', 'Hypertension'], ARRAY['Metformin 500mg', 'Amlodipine 5mg']);

-- 3. Insert Medical Documents
INSERT INTO public.medical_documents (id, patient_id, document_name, file_path, document_type) VALUES
('d1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Discharge Summary (Heart Care Clinic 2025)', 'docs/discharge_summary_2025.pdf', 'discharge_summary'),
('d2222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'ECG Report Jan 2026', 'docs/ecg_jan_2026.pdf', 'scan');

-- 4. Insert Hospitals (Rajahmundry locations)
INSERT INTO public.hospitals (id, name, address, latitude, longitude, phone, available_icu_beds) VALUES
('c1111111-1111-1111-1111-111111111111', 'City General Emergency Hospital', 'Main Road, Rajahmundry', 17.0005, 81.7800, '+918832441122', 4),
('c2222222-2222-2222-2222-222222222222', 'Apollo Speciality ER', 'Danavaipeta, Rajahmundry', 17.0080, 81.7850, '+918832449988', 2);

-- 5. Insert Hospital Staff
INSERT INTO public.hospital_staff (id, user_id, hospital_id, is_on_duty) VALUES
('e1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', true);

-- 6. Insert Ambulances
INSERT INTO public.ambulances (id, vehicle_number, status, current_latitude, current_longitude) VALUES
('b1111111-1111-1111-1111-111111111111', 'AP 05 AB 1234', 'AVAILABLE', 17.0020, 81.7820),
('b2222222-2222-2222-2222-222222222222', 'AP 05 CD 5678', 'AVAILABLE', 17.0090, 81.7890);

-- 7. Insert Ambulance Drivers
INSERT INTO public.ambulance_drivers (id, user_id, ambulance_id, driver_name, phone) VALUES
('f1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'b1111111-1111-1111-1111-111111111111', 'Suresh Kumar', '+919876543212');
