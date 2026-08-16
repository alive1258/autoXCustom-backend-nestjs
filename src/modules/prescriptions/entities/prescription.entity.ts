import { Appointment } from 'src/modules/appointments/entities/appointment.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PatientGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export interface PrescriptionMedicineItem {
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

export interface PrescriptionTestItem {
  name: string;
  instructions?: string;
}

export enum ComplaintDurationUnit {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export interface PrescriptionChiefComplaintItem {
  name: string;
  duration_value?: number;
  duration_unit?: ComplaintDurationUnit;
  note?: string;
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

/**
 * One "On Examination" panel — vitals recorded at a single point in the
 * visit. `bp_readings` / `temperature_readings` / `pulse_readings` are
 * arrays because the UI lets staff press Enter to log repeat readings
 * (e.g. BP taken twice). `bmi` / `bsa` / `ibw` are computed server-side by
 * the vitals module at add-time and stored as a snapshot so the printed
 * prescription doesn't silently change if the calculation formula changes
 * later. `z_score` is manual-entry only for now — pending a dedicated
 * pediatric growth-chart module.
 */
export interface PrescriptionExaminationItem {
  blood_group?: BloodGroup;
  height_cm?: number;
  weight_kg?: number;
  bp_readings?: number[];
  bmi_category?: string;
  temperature_readings?: number[];
  pulse_readings?: number[];
  bmi?: number;
  bsa?: number;
  ibw?: number;
  z_score?: number;
  note?: string;
}

// ---------------------------------------------------------------------------
// "Add History" — 10 categories, each its own jsonb array on the
// prescription (same pattern as chief_complaints/examination_findings).
// ---------------------------------------------------------------------------

export interface MedicalHistoryItem {
  diagnosis: string;
  comment?: string;
}

export interface DrugHistoryItem {
  medicine_name: string;
  duration_value?: number;
  duration_unit?: ComplaintDurationUnit;
}

export enum FamilyMember {
  FATHER = 'father',
  MOTHER = 'mother',
  BROTHER = 'brother',
  SISTER = 'sister',
  GRANDFATHER = 'grandfather',
  GRANDMOTHER = 'grandmother',
}

export interface FamilyHistoryItem {
  diagnosis: string;
  family_members?: FamilyMember[];
}

/**
 * Shared shape for the four free-text history categories that only need a
 * title + optional description + optional comment (Allergy, Social, Sexual,
 * Travel) — identical fields, different section headings in the UI.
 */
export interface TitledHistoryItem {
  title: string;
  description?: string;
  comment?: string;
}

export interface SurgicalHistoryItem extends TitledHistoryItem {
  therapy_date?: string;
}

export enum OncologicTherapyCategory {
  CHEMOTHERAPY = 'chemotherapy',
  RADIOTHERAPY = 'radiotherapy',
  IMMUNOTHERAPY = 'immunotherapy',
  HORMONAL_THERAPY = 'hormonal_therapy',
  TARGETED_THERAPY = 'targeted_therapy',
  SURGERY = 'surgery',
  OTHER = 'other',
}

export interface OncologicHistoryItem {
  category: OncologicTherapyCategory;
  description?: string;
  therapy_date?: string;
  comment?: string;
}

/** Operation Theater note — a distinct shape (no title/description/comment
 * pattern), so it isn't folded into TitledHistoryItem. */
export interface OtNoteItem {
  date: string;
  time: string;
  operation_name: string;
  indication_name: string;
  anesthesia_type?: string;
  anaesthesiologist_name?: string;
  surgeon_name?: string;
  assistant_surgeon_name?: string;
}

@Entity('prescriptions')
@Index(['prescription_date'])
@Index(['share_token'], { unique: true })
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  patient_name: string;

  @Column({ type: 'int', nullable: true })
  patient_age?: number;

  @Column({ type: 'enum', enum: PatientGender, nullable: true })
  patient_gender?: PatientGender;

  @Column({ type: 'varchar', length: 30, nullable: true })
  patient_phone?: string;

  @Column({ type: 'text', nullable: true })
  patient_address?: string;

  /** Optional link to the appointment this prescription was written for */
  @Column({ type: 'uuid', nullable: true })
  appointment_id?: string;

  @ManyToOne(() => Appointment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'appointment_id' })
  appointment?: Appointment;

  /** Diagnosis notes — distinct from the structured `chief_complaints` below */
  @Column({ type: 'text', nullable: true })
  diagnosis?: string;

  @Column({ type: 'jsonb', nullable: true })
  chief_complaints?: PrescriptionChiefComplaintItem[];

  @Column({ type: 'jsonb', nullable: true })
  examination_findings?: PrescriptionExaminationItem[];

  @Column({ type: 'jsonb', nullable: true })
  medical_history?: MedicalHistoryItem[];

  @Column({ type: 'jsonb', nullable: true })
  drug_history?: DrugHistoryItem[];

  @Column({ type: 'jsonb', nullable: true })
  family_history?: FamilyHistoryItem[];

  @Column({ type: 'jsonb', nullable: true })
  allergy_history?: TitledHistoryItem[];

  @Column({ type: 'jsonb', nullable: true })
  social_history?: TitledHistoryItem[];

  @Column({ type: 'jsonb', nullable: true })
  surgical_history?: SurgicalHistoryItem[];

  @Column({ type: 'jsonb', nullable: true })
  sexual_history?: TitledHistoryItem[];

  @Column({ type: 'jsonb', nullable: true })
  travel_history?: TitledHistoryItem[];

  @Column({ type: 'jsonb', nullable: true })
  oncologic_history?: OncologicHistoryItem[];

  @Column({ type: 'jsonb', nullable: true })
  ot_notes?: OtNoteItem[];

  @Column({ type: 'jsonb', nullable: true })
  medicines?: PrescriptionMedicineItem[];

  @Column({ type: 'jsonb', nullable: true })
  tests?: PrescriptionTestItem[];

  /** General advice / notes */
  @Column({ type: 'text', nullable: true })
  advice?: string;

  @Column({ type: 'date', nullable: true })
  follow_up_date?: string;

  @Column({ type: 'date' })
  prescription_date: string;

  /**
   * Random unguessable token (not the row's UUID) used for the public
   * print/share link — keeps that link stable and shareable without
   * exposing sequential/enumerable prescription IDs.
   */
  @Column({ type: 'varchar', length: 64, unique: true })
  share_token: string;

  @Column({ type: 'uuid' })
  added_by: string;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;
}
