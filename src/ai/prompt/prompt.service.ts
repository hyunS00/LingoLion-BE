import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import { join } from 'path';
import { SituationRecommendDto } from 'src/situations/dto/situation-recommend.dto';

@Injectable()
export class PromptService {
  private templates: Record<string, HandlebarsTemplateDelegate> = {};

  constructor() {
    this.loadTemplate('place');
    this.loadTemplate('userRole');
    this.loadTemplate('aiRole');
    this.loadTemplate('goal');
  }

  loadTemplate(name: string) {
    try {
      const filePath = join(
        __dirname,
        'templates',
        'recommendations',
        `${name}.hbs`,
      );
      const templateContent = readFileSync(filePath, 'utf-8');
      this.templates[name] = Handlebars.compile(templateContent);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  buildPrompt(dto: SituationRecommendDto): string {
    const template = this.templates[dto.type];
    return template ? template(dto) : '기본 추천';
  }
}
