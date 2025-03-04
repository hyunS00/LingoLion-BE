import { BadRequestException } from '@nestjs/common';

export function encodeCursorId(id: number): string {
  return Buffer.from(JSON.stringify({ id })).toString('base64');
}

export function encodeCursorObj(obj: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
}

export function decodeCursor(cursor: string): string {
  const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
  return decoded;
}

export function validateCursorId(cursor: string) {
  try {
    const decodedCursor = decodeCursor(cursor);
    const parsedCursor = JSON.parse(decodedCursor);
    const id = parseInt(parsedCursor.id, 10);

    if (isNaN(id) || id < 0) {
      throw new Error('지원하지 않는 커서 포맷');
    }

    return id;
  } catch (error) {
    throw new BadRequestException('지원하지 않는 커서 포맷');
  }
}

export function validateDateIdCursor(cursor: string): {
  id: string | number;
  createdAt: Date;
} {
  try {
    const decodedCursor = decodeCursor(cursor);
    const { id, createdAt } = JSON.parse(decodedCursor);
    return { id, createdAt };
  } catch (error) {
    throw new BadRequestException('지원하지 않는 커서 포맷');
  }
}
