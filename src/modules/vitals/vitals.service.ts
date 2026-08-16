import { Injectable } from '@nestjs/common';
import { PatientGender } from 'src/modules/prescriptions/entities/prescription.entity';
import { CalculateVitalsDto, VitalsResultDto } from './dto/calculate-vitals.dto';

const CM_PER_INCH = 2.54;
const INCHES_IN_FIVE_FEET = 60;

/**
 * Pure, stateless anthropometric calculations — no DB/IO, so this is a
 * synchronous CPU-bound service. Kept server-side (rather than duplicated
 * in the frontend) so the formulas have one source of truth shared by the
 * prescription form today and any future consumer (e.g. Pedz Calculator).
 */
@Injectable()
export class VitalsService {
  calculate(dto: CalculateVitalsDto): VitalsResultDto {
    const { height_cm, weight_kg, patient_gender } = dto;

    const ibw = this.calculateIbw(height_cm, patient_gender);

    if (weight_kg === undefined) {
      // IBW-only call (no weight collected) — BMI/BSA need weight, so
      // they're simply omitted rather than computed against a guess.
      return { ...(ibw !== undefined ? { ibw } : {}) };
    }

    const bmi = this.calculateBmi(height_cm, weight_kg);
    const bsa = this.calculateBsa(height_cm, weight_kg);

    return {
      bmi,
      bmi_category: this.categorizeBmi(bmi),
      bsa,
      ...(ibw !== undefined ? { ibw } : {}),
    };
  }

  private calculateBmi(heightCm: number, weightKg: number): number {
    const heightM = heightCm / 100;
    return this.round(weightKg / (heightM * heightM), 1);
  }

  private categorizeBmi(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  /** Mosteller formula: BSA (m²) = sqrt((height_cm * weight_kg) / 3600) */
  private calculateBsa(heightCm: number, weightKg: number): number {
    return this.round(Math.sqrt((heightCm * weightKg) / 3600), 2);
  }

  /**
   * Devine formula. Requires gender (undefined for non-binary/unspecified
   * patients, in which case IBW is omitted rather than guessed).
   * Male:   50.0 kg + 2.3 kg per inch over 5 feet
   * Female: 45.5 kg + 2.3 kg per inch over 5 feet
   */
  private calculateIbw(
    heightCm: number,
    gender?: PatientGender,
  ): number | undefined {
    if (gender !== PatientGender.MALE && gender !== PatientGender.FEMALE) {
      return undefined;
    }

    const baseKg = gender === PatientGender.MALE ? 50 : 45.5;
    const heightInInches = heightCm / CM_PER_INCH;
    const inchesOverFiveFeet = heightInInches - INCHES_IN_FIVE_FEET;

    return this.round(baseKg + 2.3 * inchesOverFiveFeet, 1);
  }

  private round(value: number, decimals: number): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
  }
}
