import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { customers, Customer, NewCustomer } from './schema/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerRepository {
  constructor(
    @Inject('DRIZZLE_DB')
    private readonly db: any,
  ) {}

  async createCustomer(
    createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    const newCustomer: NewCustomer = {
      firstName: createCustomerDto.fristName, // Note: keeping the typo from DTO
      lastName: createCustomerDto.lastName,
      email: createCustomerDto.email,
      phoneNumber: createCustomerDto.phoneNumber,
      address: createCustomerDto.address,
      city: createCustomerDto.city,
      state: createCustomerDto.state,
      country: createCustomerDto.country,
    };

    const [customer] = await this.db
      .insert(customers)
      .values(newCustomer)
      .returning();

    return customer;
  }

  async getAllCustomers(): Promise<Customer[]> {
    try {
      return await this.db.select().from(customers);
    } catch (error) {
      throw new Error(
        `Failed to fetch customers: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async getCustomerById(id: string): Promise<Customer> {
    const [customer] = await this.db
      .select()
      .from(customers)
      .where(eq(customers.id, id))
      .limit(1);

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const updateData: Partial<NewCustomer> = {};

    if (updateCustomerDto.firstName !== undefined) {
      updateData.firstName = updateCustomerDto.firstName;
    }
    if (updateCustomerDto.lastName !== undefined) {
      updateData.lastName = updateCustomerDto.lastName;
    }
    if (updateCustomerDto.email !== undefined) {
      updateData.email = updateCustomerDto.email;
    }
    if (updateCustomerDto.phoneNumber !== undefined) {
      updateData.phoneNumber = updateCustomerDto.phoneNumber;
    }
    if (updateCustomerDto.address !== undefined) {
      updateData.address = updateCustomerDto.address;
    }
    if (updateCustomerDto.city !== undefined) {
      updateData.city = updateCustomerDto.city;
    }
    if (updateCustomerDto.state !== undefined) {
      updateData.state = updateCustomerDto.state;
    }
    if (updateCustomerDto.country !== undefined) {
      updateData.country = updateCustomerDto.country;
    }

    const [updatedCustomer] = await this.db
      .update(customers)
      .set(updateData)
      .where(eq(customers.id, id))
      .returning();

    if (!updatedCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return updatedCustomer;
  }

  async deleteCustomer(id: string): Promise<void> {
    const [deletedCustomer] = await this.db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning();

    if (!deletedCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
  }
}
