export class FindAmountByMonthInput {
  userId: string;
  month: string;

  constructor(userId: string, month: string) {
    this.userId = userId;
    this.month = month;
  }

  static validate(input: FindAmountByMonthInput): void {
    if (!input.userId || input.userId.trim() === '') {
      throw new Error("UserId field is required and cannot be empty");
    }

    if (!input.month || input.month.trim() === '') {
      throw new Error("Month field is required and cannot be empty");
    }

    const monthPattern = /^\d{4}-\d{2}$/;
    if (!monthPattern.test(input.month)) {
      throw new Error("Month field must be in the format YYYY-MM");
    }

    const [, month] = input.month.split('-').map(Number);
    if (month < 1 || month > 12) {
      throw new Error("Month must be between 01 and 12");
    }
  }
}