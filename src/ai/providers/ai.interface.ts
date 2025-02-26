import { CreateMessageDto } from 'src/conversations/dto/create-message.dto';

export interface ChatCompletionMessage {
  content: string;
  role: string;
}

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
