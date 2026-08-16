import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetProjectDto } from './dto/get-project.dto';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { DataQueryService } from 'src/common/data-query/data-query.service';
import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly fileUploadsService: FileUploadsService,
    private readonly dataQueryService: DataQueryService,
  ) {}

  /**
   * Create a new project
   */
  async create(
    req: Request,
    createProjectDto: CreateProjectDto,
    file?: Express.Multer.File,
  ): Promise<Project> {
    const userId = req?.user?.sub;
    if (!userId) throw new UnauthorizedException('Authentication required.');

    let imageUrl: string | undefined;
    if (file) {
      const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
      imageUrl = uploadedFiles[0];
    }

    const newProject = this.projectRepository.create({
      ...createProjectDto,
      added_by: String(userId),
      image: imageUrl,
    });

    return this.projectRepository.save(newProject);
  }

  /**
   * Get all projects with optional filters/pagination
   */
  async findAll(query: GetProjectDto): Promise<IPagination<Partial<Project>>> {
    return this.dataQueryService.execute<Partial<Project>>({
      repository: this.projectRepository,
      alias: 'project',
      pagination: query,
      searchableFields: ['vehicle', 'work', 'result'],
      filterableFields: ['category', 'position', 'is_active'],
      relations: ['addedBy'],
      select: [
        'id',
        'vehicle',
        'work',
        'result',
        'category',
        'image',
        'position',
        'is_active',
        'created_at',
        'updated_at',
      ],
      selectRelations: ['addedBy.id', 'addedBy.name', 'addedBy.email'],
    });
  }

  /**
   * Get all active projects, ordered for the public homepage
   */
  async findActive(): Promise<Project[]> {
    return this.projectRepository.find({
      where: { is_active: true },
      order: { position: 'ASC' },
    });
  }

  /**
   * Get a single project by UUID
   */
  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['addedBy'],
    });

    if (!project) throw new NotFoundException('Project not found.');

    return project;
  }

  /**
   * Update a project
   */
  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    file?: Express.Multer.File,
  ): Promise<Project> {
    const project = await this.findOne(id);

    if (file) {
      if (project.image) {
        const updatedImage = await this.fileUploadsService.updateFileUploads({
          oldFile: project.image,
          currentFile: file,
        });
        updateProjectDto.image = updatedImage as string;
      } else {
        const uploadedFiles = await this.fileUploadsService.fileUploads([file]);
        updateProjectDto.image = uploadedFiles[0];
      }
    }

    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  /**
   * Soft delete a project
   */
  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);

    if (project.image) {
      try {
        await this.fileUploadsService.deleteFileUploads(project.image);
      } catch (err) {
        if (err instanceof Error) {
          console.warn(`Failed to delete project image: ${err.message}`);
        } else {
          console.warn('Failed to delete project image:', err);
        }
      }
    }

    const result = await this.projectRepository.softDelete(id);
    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: record might already be removed.',
      );
    }
  }
}
