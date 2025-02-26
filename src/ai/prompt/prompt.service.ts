import { Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';

@Injectable()
export class PromptService {
  private template: Record<string, HandlebarsTemplateDelegate>;
}
