import ValidationMessages from 'App/Enums/ValidationMessages';
import ValidationRules from 'App/Enums/ValidationRules';

export default interface IValidationRule {
  rule: ValidationRules;
  field: string;
  message: ValidationMessages;
}
