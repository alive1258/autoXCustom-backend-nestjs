import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { VitalsService } from './vitals.service';
import { CalculateVitalsDto, VitalsResultDto } from './dto/calculate-vitals.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermission } from 'src/auth/decorators/permissions.decorator';

/**
 * Backs the "Calculate" button in the On Examination modal on the
 * prescription form. Gated by the existing `prescriptions` permission
 * resource rather than a new menu entry — same rationale as chief-complaints.
 */
@Controller('vitals')
export class VitalsController {
  constructor(private readonly vitalsService: VitalsService) {}

  @ApiDoc({
    summary: 'Calculate BMI, BSA and IBW from height/weight',
    description:
      'Staff-only — stateless calculation, no DB access. IBW is omitted when patient_gender is not male/female.',
    response: VitalsResultDto,
    status: HttpStatus.OK,
  })
  @RequirePermission('prescriptions', 'view')
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 60, ttl: 60 } })
  @Post('calculate')
  calculate(@Body() dto: CalculateVitalsDto): VitalsResultDto {
    return this.vitalsService.calculate(dto);
  }
}
