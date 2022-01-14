import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isBefore', async: false })
export class IsAfterDate implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    return (
      new Date(propertyValue).getTime() >
      new Date(args.object[args.constraints[0]]).getTime()
    );
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be later than now`;
  }
}
