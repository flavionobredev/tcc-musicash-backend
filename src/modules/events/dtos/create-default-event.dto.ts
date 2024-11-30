import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString, MinDate } from 'class-validator';

export class CreateDefaultEventInputDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  // @IsString()
  // @IsNotEmpty()
  @IsDate({message: 'startDate must be a Date instance'})
  @MinDate(() => {
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  }, { message: 'startDate must be a valid date'})
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsOptional()
  @IsDate({message: 'endDate must be a Date instance'})
  @MinDate(() => {
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  }, { message: 'endDate must be a valid date'})
  endDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;
}
