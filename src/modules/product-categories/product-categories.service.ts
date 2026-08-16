import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Request } from 'express';
import { ProductCategory } from './entities/product-category.entity';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { GetProductCategoriesDto } from './dto/get-product-categories.dto';
import { ReorderProductCategoryDto } from './dto/reorder-product-category.dto';
import { IPagination } from 'src/common/data-query/pagination.interface';
import { FileUploadsService } from 'src/common/file-uploads/file-uploads.service';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
    private readonly fileUploadsService: FileUploadsService,
  ) {}

  private async assertSlugAvailable(
    slug: string,
    excludeId?: string,
  ): Promise<void> {
    const exists = await this.categoryRepository.exists({
      where: excludeId ? { slug, id: Not(excludeId) } : { slug },
    });
    if (exists) {
      throw new BadRequestException(
        `Category slug "${slug}" is already in use.`,
      );
    }
  }

  async create(
    req: Request,
    dto: CreateProductCategoryDto,
    file?: Express.Multer.File,
  ): Promise<ProductCategory> {
    const userId = req?.user?.sub;
    if (!userId) throw new UnauthorizedException('Authentication required.');

    await this.assertSlugAvailable(dto.slug);

    let image: string | undefined;
    if (file) {
      const uploaded = (await this.fileUploadsService.fileUploads([
        file,
      ])) as string[];
      image = uploaded[0];
    }

    let position = dto.position;
    if (position === undefined) {
      const max = await this.categoryRepository
        .createQueryBuilder('c')
        .select('MAX(c.position)', 'max')
        .getRawOne();
      position = (Number(max?.max) || 0) + 1;
    }

    const category = this.categoryRepository.create({
      ...dto,
      position,
      image,
      added_by: String(userId),
    });

    return this.categoryRepository.save(category);
  }

  async findAll(
    query: GetProductCategoriesDto,
  ): Promise<IPagination<ProductCategory>> {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 10, 100);
    const sortBy = ['name', 'position', 'created_at'].includes(
      query.sortBy as string,
    )
      ? query.sortBy
      : 'position';
    const sortOrder = query.sortOrder === 'desc' ? 'DESC' : 'ASC';

    const qb = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.addedBy', 'addedBy');

    if (query.search) {
      qb.andWhere('category.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    qb.orderBy(`category.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      meta: { total, page, limit, totalPages },
      links: {
        first: `?page=1&limit=${limit}`,
        last: `?page=${totalPages}&limit=${limit}`,
        current: `?page=${page}&limit=${limit}`,
        next: page < totalPages ? `?page=${page + 1}&limit=${limit}` : '',
        previous: page > 1 ? `?page=${page - 1}&limit=${limit}` : '',
      },
      data,
    };
  }

  async findOne(id: string): Promise<ProductCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['addedBy'],
    });
    if (!category) throw new NotFoundException('Product category not found.');
    return category;
  }

  async update(
    id: string,
    dto: UpdateProductCategoryDto,
    file?: Express.Multer.File,
  ): Promise<ProductCategory> {
    const category = await this.findOne(id);

    if (dto.slug && dto.slug !== category.slug) {
      await this.assertSlugAvailable(dto.slug, id);
    }

    let image: string | undefined;
    if (file && category.image) {
      image = (await this.fileUploadsService.updateFileUploads({
        currentFile: file,
        oldFile: category.image,
      })) as string;
    } else if (file) {
      const uploaded = (await this.fileUploadsService.fileUploads([
        file,
      ])) as string[];
      image = uploaded[0];
    }

    Object.assign(category, dto, image ? { image } : {});
    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);

    if (category.image) {
      try {
        await this.fileUploadsService.deleteFileUploads(category.image);
      } catch (err) {
        console.warn(
          'Failed to delete product category image:',
          err instanceof Error ? err.message : err,
        );
      }
    }

    const result = await this.categoryRepository.softDelete(id);
    if (!result.affected) {
      throw new BadRequestException(
        'Delete failed: record might already be removed.',
      );
    }
  }

  async reorder(dto: ReorderProductCategoryDto): Promise<{ success: boolean }> {
    await Promise.all(
      dto.items.map((item) =>
        this.categoryRepository.update(item.id, { position: item.position }),
      ),
    );
    return { success: true };
  }
}
