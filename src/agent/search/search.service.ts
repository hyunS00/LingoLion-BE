import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { tavily, TavilyClient } from '@tavily/core';

@Injectable()
export class SearchService {
  private client: TavilyClient;
  constructor(private readonly configService: ConfigService) {
    this.client = tavily({
      apiKey: configService.get<string>('TAVILY_API_KEY'),
    });
  }

  async search(query: string) {
    return await this.client.search(query, {
      searchDepth: 'basic',
      maxResults: 5,
    });
  }

  async aggregate(query: string) {
    // 검색 수행
    const searchResult = await this.search(query);

    // 결과가 없는 경우 처리
    if (!searchResult.results || searchResult.results.length === 0) {
      return {
        query,
        summary: '검색 결과가 없습니다.',
        keyInsights: [],
        sources: [],
        results: [],
      };
    }

    // 결과 정렬 및 필터링 (관련성 점수 기준)
    const relevantResults = searchResult.results
      .filter((result) => result.score > 0.5) // 관련성 임계값 설정
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // 상위 5개만 사용

    // 모든 결과의 내용 추출
    const contents = relevantResults
      .map((result) => result.content || '')
      .filter(Boolean);

    // 결과 종합
    const combinedContent = contents.join(' ');

    // 주요 정보 추출
    const keyInsights = relevantResults
      .filter((result) => result.content && result.content.length > 100)
      .map((result) => ({
        title: result.title || '제목 없음',
        snippet: result.content.substring(0, 200) + '...',
        score: result.score,
      }));

    // 결과 소스 정보
    const sources = relevantResults.map((result) => ({
      title: result.title || '제목 없음',
      url: result.url,
      score: result.score,
    }));

    // 프롬프트에 포함할 형식으로 결과 처리
    const formattedResults = relevantResults.map((result, index) => ({
      index: index + 1,
      title: result.title || '제목 없음',
      content: result.content || '',
      url: result.url,
      score: result.score,
    }));

    // 검색 결과 요약
    const summary = `"${query}" 검색에 대해 ${relevantResults.length}개의 관련 결과를 찾았습니다. 
  가장 관련성 높은 정보는 "${relevantResults[0]?.title || '제목 없음'}"에서 확인할 수 있습니다.`;

    return {
      query,
      summary,
      keyInsights,
      sources,
      results: formattedResults, // 프롬프트에 사용할 형식의 결과
      rawContentLength: combinedContent.length,
      resultCount: relevantResults.length,
    };
  }
}
