import ValidationMessages from 'App/Enums/ValidationMessages';
import ValidationRules from 'App/Enums/ValidationRules';

export default interface ValidationRule {
	rule: ValidationRules;
	field: string;
	message: ValidationMessages;
}
