import { Injectable } from '@nestjs/common';
import { QUICK_PICK_DIAGNOSES } from './constants/quick-pick-diagnoses.constant';

@Injectable()
export class DiagnosesService {
  /** Shared "Quick pick" list — same for every doctor. */
  getQuickPick(): readonly string[] {
    return QUICK_PICK_DIAGNOSES;
  }
}
