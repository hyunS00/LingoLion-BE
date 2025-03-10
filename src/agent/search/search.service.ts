import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { tavily, TavilyClient } from '@tavily/core';
import { AiService } from 'src/ai/ai.service';
import { PromptService } from 'src/ai/prompt/prompt.service';
import { Context } from 'vm';

@Injectable()
export class SearchService {
  private client: TavilyClient;
  constructor(
    private readonly configService: ConfigService,
    private readonly aiService: AiService,
    private readonly promptService: PromptService,
  ) {
    this.client = tavily({
      apiKey: configService.get<string>('TAVILY_API_KEY'),
    });
  }

  async search(query: string) {
    return await this.client.search(query, {
      searchDepth: 'advanced',
      maxResults: 5,
    });
  }

  async aggregate(content: string, context: Context) {
    const prompt = this.promptService.buildAgentPrompt('search', {
      content,
      context,
    });
    const response = await this.aiService.ask(prompt);

    let searchResult;
    try {
      const pasedRes = JSON.parse(response.content);
      searchResult = await this.search(pasedRes.query);

      // 결과가 없는 경우 처리
      if (!searchResult.results || searchResult.results.length === 0) {
        return {
          searchResult: '검색 결과가 없습니다.',
        };
      }

      return searchResult.results;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
