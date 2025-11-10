import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerRepository } from './customer.repository';
import { Customer } from './schema/customer.schema';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const existingCustomer = await this.customerRepository.getCustomerByEmail(
      createCustomerDto.email,
    );
    if (existingCustomer) {
      throw new ConflictException('Customer with this email already exists');
    }
    return await this.customerRepository.createCustomer(createCustomerDto);
  }

  async findAll(search?: string): Promise<Customer[]> {
    if (search) {
      return await this.customerRepository.searchCustomers(search);
    }
    return await this.customerRepository.getAllCustomers();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.getCustomerById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const existingCustomer = await this.customerRepository.getCustomerById(id);
    if (!existingCustomer) {
      throw new NotFoundException('Customer not found');
    }
    const existingCustomerByEmail =
      await this.customerRepository.getCustomerByEmail(updateCustomerDto.email);
    if (existingCustomerByEmail && existingCustomerByEmail.id !== id) {
      throw new ConflictException('Customer with this email already exists');
    }
    return await this.customerRepository.updateCustomer(id, updateCustomerDto);
  }

  async remove(id: string): Promise<void> {
    const deletedCustomer = await this.customerRepository.deleteCustomer(id);
    if (!deletedCustomer) {
      throw new NotFoundException('Customer not found');
    }
  }
}
