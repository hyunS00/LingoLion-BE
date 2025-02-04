import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import emojiRegex from 'emoji-regex';

@ValidatorConstraint({ async: false })
export class IsEmojiConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    if (typeof value !== 'string') return false;

    const regex = emojiRegex();

    const matches = value.match(regex);

    return matches !== null && matches.join('') === value;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return '값($value)은 올바른 이모지가 아닙니다.';
  }
}

export function IsEmoji(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmojiConstraint,
    });
  };
}
