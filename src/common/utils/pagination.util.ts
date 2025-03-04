import { BadRequestException } from '@nestjs/common';

export function encodeCursorId(id: number): string {
  return Buffer.from(JSON.stringify({ id })).toString('base64');
}

export function decodeCursorId(cursor: string): string {
  const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
  return decoded;
}

export function validateCursor(cursor: string) {
  try {
    const decodedCursor = decodeCursorId(cursor);
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

export function createEndCursorId<T extends { id: number }>(entitiy: T[]) {
  return encodeCursorId(entitiy[entitiy.length - 1].id);
}
