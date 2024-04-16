export interface EmailConfirmation {
	id: string;
	code: string;
	isActive: boolean;
	attempts?: number;
	confirmationStatus: ConfirmationStatus;
}

export enum ConfirmationStatus {
	PENDING = 0,
	ACTIVATED = 1,
	DECLINED = 2
}