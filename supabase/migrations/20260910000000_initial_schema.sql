-- PostgreSQL Schema Migration for AI Healthcare Access & Emergency Booking Assistant

-- 1. Create Enums
CREATE TYPE user_role_type AS ENUM ('PATIENT', 'HOSPITAL_STAFF', 'AMBULANCE_DRIVER', 'ADMIN');
CREATE TYPE input_type_enum AS ENUM ('voice', 'text');
CREATE TYPE ambulance_status_type AS ENUM ('OFFLINE', 'AVAILABLE', 'ON_EMERGENCY', 'RETURNING');

CREATE TYPE emergency_status_type AS ENUM (
  'REQUESTED',
  'HOSPITAL_NOTIFIED',
  'HOSPITAL_ACCEPTED',
  'HOSPITAL_DECLINED',
  'AMBULANCE_SEARCHING',
  'AMBULANCE_ASSIGNED',
  'DRIVER_DECLINED',
  'DRIVER_NAVIGATING',
  'ARRIVED_AT_PATIENT',
  'PATIENT_PICKED_UP',
  'NAVIGATING_TO_HOSPITAL',
  'ARRIVED_AT_HOSPITAL',
  'COMPLETED'
);

-- 2. Create Users Table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  email TEXT UNIQUE,
  role user_role_type NOT NULL DEFAULT 'PATIENT',
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Patient Profiles Table
CREATE TABLE public.patient_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INT CHECK (age >= 0),
  gender TEXT,
  phone TEXT NOT NULL,
  blood_group TEXT,
  allergies TEXT[] DEFAULT '{}',
  medical_conditions TEXT[] DEFAULT '{}',
  regular_medications TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Emergency Contacts Table
CREATE TABLE public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Medical Documents Table
CREATE TABLE public.medical_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  document_type TEXT NOT NULL, -- 'blood_report', 'prescription', 'discharge_summary', 'scan'
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Hospitals Table
CREATE TABLE public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  phone TEXT NOT NULL,
  available_icu_beds INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Hospital Staff Table
CREATE TABLE public.hospital_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  is_on_duty BOOLEAN DEFAULT TRUE,
  fcm_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Ambulances Table
CREATE TABLE public.ambulances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_number TEXT UNIQUE NOT NULL,
  status ambulance_status_type DEFAULT 'AVAILABLE',
  current_latitude DOUBLE PRECISION,
  current_longitude DOUBLE PRECISION,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Ambulance Drivers Table
CREATE TABLE public.ambulance_drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  ambulance_id UUID NOT NULL REFERENCES public.ambulances(id) ON DELETE CASCADE,
  driver_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  fcm_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Emergency Requests Table
CREATE TABLE public.emergency_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patient_profiles(id),
  chief_complaint TEXT NOT NULL,
  input_type input_type_enum DEFAULT 'text',
  status emergency_status_type DEFAULT 'REQUESTED',
  patient_latitude DOUBLE PRECISION NOT NULL,
  patient_longitude DOUBLE PRECISION NOT NULL,
  patient_address TEXT,
  hospital_id UUID REFERENCES public.hospitals(id),
  ambulance_id UUID REFERENCES public.ambulances(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Emergency Status History Table
CREATE TABLE public.emergency_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emergency_id UUID NOT NULL REFERENCES public.emergency_requests(id) ON DELETE CASCADE,
  previous_status emergency_status_type,
  new_status emergency_status_type NOT NULL,
  notes TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Hospital Assignments Table
CREATE TABLE public.hospital_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emergency_id UUID NOT NULL REFERENCES public.emergency_requests(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id),
  action TEXT NOT NULL, -- 'NOTIFIED', 'ACCEPTED', 'DECLINED'
  response_time TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Ambulance Assignments Table
CREATE TABLE public.ambulance_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emergency_id UUID NOT NULL REFERENCES public.emergency_requests(id) ON DELETE CASCADE,
  ambulance_id UUID NOT NULL REFERENCES public.ambulances(id),
  driver_id UUID REFERENCES public.ambulance_drivers(id),
  action TEXT NOT NULL, -- 'NOTIFIED', 'ACCEPTED', 'DECLINED'
  response_time TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Ambulance Locations Table (Realtime Tracking)
CREATE TABLE public.ambulance_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ambulance_id UUID NOT NULL REFERENCES public.ambulances(id),
  emergency_id UUID NOT NULL REFERENCES public.emergency_requests(id),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  heading DOUBLE PRECISION,
  speed DOUBLE PRECISION,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. AI Conversations & Messages
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emergency_id UUID NOT NULL REFERENCES public.emergency_requests(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  sender TEXT NOT NULL, -- 'ai' | 'patient'
  content TEXT NOT NULL,
  suggested_answers TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Notifications Table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  emergency_id UUID REFERENCES public.emergency_requests(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  payload JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast geospatial and state querying
CREATE INDEX idx_emergency_status ON public.emergency_requests(status);
CREATE INDEX idx_emergency_patient ON public.emergency_requests(patient_id);
CREATE INDEX idx_ambulance_locations_emergency ON public.ambulance_locations(emergency_id);

-- Enable Supabase Realtime for live tracking & emergency state updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ambulance_locations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_status_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_messages;

-- Row Level Security (RLS) Configuration
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_requests ENABLE ROW LEVEL SECURITY;

-- Allow public access for hackathon dev simplicity
CREATE POLICY "Allow public read emergency_requests" ON public.emergency_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert emergency_requests" ON public.emergency_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update emergency_requests" ON public.emergency_requests FOR UPDATE USING (true);

CREATE POLICY "Allow public read patient_profiles" ON public.patient_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert patient_profiles" ON public.patient_profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read medical_documents" ON public.medical_documents FOR SELECT USING (true);
