import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { SituationsService } from './situations.service';
import { SituationRecommendDto } from './dto/situation-recommend.dto';
import { CreateSituationDto } from './dto/create-situation.dto';
import { AuthUser } from 'src/users/decorator/authUser.decorator';
import { UpdateSituationDto } from './dto/update-situation.dto';
import { CursorPaginationDto } from 'src/common/dto/cursor-pagination.dto';

@Controller('situations')
@UseInterceptors(ClassSerializerInterceptor)
export class SituationsController {
  constructor(private readonly situationsService: SituationsService) {}

  @Post('recommend')
  async recommendationsEndpoint(
    @Body()
    situationRecommendDto: SituationRecommendDto,
  ) {
    return await this.situationsService.recommend(situationRecommendDto);
  }

  @Post()
  async createSituation(
    @Body() createSituationDto: CreateSituationDto,
    @AuthUser('id') userId: string,
  ) {
    return await this.situationsService.create(createSituationDto, userId);
  }

  @Get('my')
  async findByMyId(
    @AuthUser('id') userId: string,
    @Query() cursorPaginationDto: CursorPaginationDto,
  ) {
    return await this.situationsService.findByUserId(
      userId,
      cursorPaginationDto.cursor,
      cursorPaginationDto.limit,
    );
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.situationsService.findById(id);
  }

  @Get()
  async findAll(@Query() cursorPaginationDto: CursorPaginationDto) {
    return await this.situationsService.findAll(
      cursorPaginationDto.cursor,
      cursorPaginationDto.limit,
    );
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSituationDto: UpdateSituationDto,
    @AuthUser('id') userId: string,
  ) {
    return await this.situationsService.update(id, updateSituationDto, userId);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser('id') userId: string,
  ) {
    return await this.situationsService.delete(id, userId);
  }
}
