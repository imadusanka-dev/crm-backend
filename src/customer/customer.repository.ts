import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, or, ilike } from 'drizzle-orm';
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
      firstName: createCustomerDto.firstName,
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
    return await this.db.select().from(customers);
  }

  async getCustomerById(id: string): Promise<Customer> {
    const [customer] = await this.db
      .select()
      .from(customers)
      .where(eq(customers.id, id))
      .limit(1);

    return customer;
  }

  async updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const [updatedCustomer] = await this.db
      .update(customers)
      .set(updateCustomerDto)
      .where(eq(customers.id, id))
      .returning();

    return updatedCustomer;
  }

  async deleteCustomer(id: string): Promise<Customer | null> {
    const [deletedCustomer] = await this.db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning();

    return deletedCustomer;
  }

  async getCustomerByEmail(email: string): Promise<Customer> {
    const [customer] = await this.db
      .select()
      .from(customers)
      .where(eq(customers.email, email))
      .limit(1);

    return customer;
  }

  async searchCustomers(searchTerm: string): Promise<Customer[]> {
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }

    const searchPattern = `%${searchTerm}%`;

    return await this.db
      .select()
      .from(customers)
      .where(
        or(
          ilike(customers.email, searchPattern),
          ilike(customers.firstName, searchPattern),
          ilike(customers.lastName, searchPattern),
        ),
      );
  }
}
