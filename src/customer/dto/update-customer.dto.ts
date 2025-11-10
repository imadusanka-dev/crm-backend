import {
  IsString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiProperty({
    description: 'First name of the customer',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the customer',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Email address of the customer',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Phone number of the customer',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({
    description: 'Address of the customer',
    example: '123 Main Street',
    required: false,
  })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({
    description: 'City of the customer',
    example: 'New York',
    required: false,
  })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({
    description: 'State of the customer',
    example: 'NY',
    required: false,
  })
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty({
    description: 'Country of the customer',
    example: 'USA',
    required: false,
  })
  @IsString()
  @IsOptional()
  country: string;
}
