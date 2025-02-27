import { Injectable } from '@nestjs/common';
import { readdirSync, readFileSync, statSync } from 'fs';
import * as Handlebars from 'handlebars';
import { basename, extname, join } from 'path';
import { SituationDto } from 'src/conversations/dto/situation.dto';
import { SituationRecommendDto } from 'src/situations/dto/situation-recommend.dto';

@Injectable()
export class PromptService {
  private recommendTemplates: Record<string, HandlebarsTemplateDelegate>;
  private conversationContextTemplate: HandlebarsTemplateDelegate;

  constructor() {
    const recommendTemplateDir = join(
      __dirname,
      'templates',
      'recommendations',
    );
    this.recommendTemplates = this.loadTemplatesFromDir(recommendTemplateDir);

    const conversationContextTemplatePath = join(
      __dirname,
      'templates',
      'conversations',
    );
    const conversationContextTemplateName = 'default';
    this.conversationContextTemplate = this.loadTemplateFromPath(
      conversationContextTemplatePath,
      conversationContextTemplateName,
    );
  }

  private loadTemplatesFromDir(
    dir: string,
  ): Record<string, Handlebars.TemplateDelegate> {
    const templates: Record<string, Handlebars.TemplateDelegate> = {};
    try {
      const files = readdirSync(dir);
      files.forEach((file) => {
        const filePath = join(dir, file);
        if (statSync(filePath).isDirectory()) {
          Object.assign(templates, this.loadTemplatesFromDir(filePath));
        } else if (extname(file) === '.hbs') {
          const content = readFileSync(filePath, 'utf-8');
          const key = basename(file, '.hbs');
          templates[key] = Handlebars.compile(content);
        }
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
    return templates;
  }

  private loadTemplateFromPath(
    filePath: string,
    filename: string,
  ): Handlebars.TemplateDelegate {
    try {
      const content = readFileSync(join(filePath, `${filename}.hbs`), 'utf-8');
      return Handlebars.compile(content);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  buildRecommendationPrompt(dto: SituationRecommendDto): string {
    const template = this.recommendTemplates[dto.type];
    return template ? template(dto) : '기본 추천';
  }

  buildSituationPrompt(dto: SituationDto): string {
    const template = this.conversationContextTemplate;
    return template ? template(dto) : '기본 상황';
  }
}
