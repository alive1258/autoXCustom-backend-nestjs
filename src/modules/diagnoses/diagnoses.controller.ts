import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { DiagnosesService } from './diagnoses.service';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermission } from 'src/auth/decorators/permissions.decorator';

/**
 * Backs the Medical History / Family History tabs of the Add History modal
 * on the prescription form. Gated by the existing `prescriptions` permission
 * resource — same rationale as chief-complaints.
 */
@Controller('diagnoses')
export class DiagnosesController {
  constructor(private readonly diagnosesService: DiagnosesService) {}

  @ApiDoc({
    summary: 'Get quick-pick diagnoses',
    description: 'Staff-only — the shared, curated diagnosis shortcut list.',
    status: HttpStatus.OK,
  })
  @RequirePermission('prescriptions', 'view')
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Get('quick-pick')
  getQuickPick() {
    return this.diagnosesService.getQuickPick();
  }
}
