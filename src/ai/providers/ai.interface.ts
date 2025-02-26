import { ChatCompletionMessage } from 'openai/resources';
import { CreateMessageDto } from 'src/conversations/dto/create-message.dto';

export interface IAIProvider {
  generateResponse(
    prompt: string,
    model: string,
  ): Promise<ChatCompletionMessage>;

  generateResponseWithContext(
    prompt: string,
    model: string,
    messages?: CreateMessageDto[],
  ): Promise<ChatCompletionMessage>;
}
