import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ParseUUIDPipe,
  HttpStatus,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, ProjectResponseDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetProjectDto } from './dto/get-project.dto';
import { ApiDoc } from 'src/auth/decorators/swagger.decorator';
import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermission } from 'src/auth/decorators/permissions.decorator';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiDoc({
    summary: 'Create Project',
    description: 'Creates a new project. Requires proper permission.',
    response: ProjectResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermission('projects', 'create')
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Post()
  create(
    @Req() req: Request,
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.projectsService.create(req, createProjectDto, file);
  }

  @ApiDoc({
    summary: 'Get all Projects',
    description: 'Retrieves all projects. Supports pagination and filters.',
    response: ProjectResponseDto,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() query: GetProjectDto) {
    return this.projectsService.findAll(query);
  }

  @ApiDoc({
    summary: 'Get active Projects',
    description:
      'Retrieves all active projects, ordered by position, for the public homepage.',
    response: ProjectResponseDto,
    status: HttpStatus.OK,
  })
  @Get('active')
  findActive() {
    return this.projectsService.findActive();
  }

  @ApiDoc({
    summary: 'Get single Project',
    description: 'Retrieve a single project by UUID.',
    response: ProjectResponseDto,
    status: HttpStatus.OK,
  })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @ApiDoc({
    summary: 'Update Project',
    description: 'Updates an existing project. Requires proper permission.',
    response: ProjectResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermission('projects', 'edit')
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.projectsService.update(id, updateProjectDto, file);
  }

  @ApiDoc({
    summary: 'Delete Project',
    description: 'Soft deletes a project. Requires proper permission.',
    response: ProjectResponseDto,
    status: HttpStatus.OK,
  })
  @RequirePermission('projects', 'delete')
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @Throttle({ default: { limit: 20, ttl: 180 } })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id);
  }
}
