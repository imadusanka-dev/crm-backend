import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerRepository } from './customer.repository';
import { Customer } from './schema/customer.schema';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return await this.customerRepository.createCustomer(createCustomerDto);
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.getAllCustomers();
  }

  async findOne(id: string): Promise<Customer> {
    return await this.customerRepository.getCustomerById(id);
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return await this.customerRepository.updateCustomer(id, updateCustomerDto);
  }

  async remove(id: string): Promise<void> {
    return await this.customerRepository.deleteCustomer(id);
  }
}
