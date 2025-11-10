import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CustomerRepository } from './customer.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './schema/customer.schema';

describe('CustomerRepository', () => {
  let repository: CustomerRepository;
  let mockDb: any;

  const mockCustomer: Customer = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    createdAt: new Date(),
  };

  beforeEach(() => {
    mockDb = {
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      returning: vi.fn(),
    };

    repository = new CustomerRepository(mockDb);
  });

  describe('createCustomer', () => {
    it('should create a customer', async () => {
      const createDto: CreateCustomerDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1234567890',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
      };

      mockDb.returning.mockResolvedValue([mockCustomer]);

      const result = await repository.createCustomer(createDto);

      expect(result).toEqual(mockCustomer);
      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalled();
      expect(mockDb.returning).toHaveBeenCalled();
    });
  });

  describe('getAllCustomers', () => {
    it('should return all customers', async () => {
      const customers = [mockCustomer];
      mockDb.select.mockReturnValue({
        from: vi.fn().mockResolvedValue(customers),
      });

      const result = await repository.getAllCustomers();

      expect(result).toEqual(customers);
      expect(mockDb.select).toHaveBeenCalled();
    });
  });

  describe('getCustomerById', () => {
    it('should return a customer by id', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockCustomer]),
          }),
        }),
      });

      const result = await repository.getCustomerById(mockCustomer.id);

      expect(result).toEqual(mockCustomer);
    });

    it('should return null if customer not found', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const result = await repository.getCustomerById('invalid-id');

      expect(result).toBeUndefined();
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer', async () => {
      const updateDto: UpdateCustomerDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phoneNumber: '+1987654321',
        address: undefined,
        city: undefined,
        state: undefined,
        country: undefined,
      };
      const updatedCustomer = { ...mockCustomer, ...updateDto };

      mockDb.update.mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([updatedCustomer]),
          }),
        }),
      });

      const result = await repository.updateCustomer(
        mockCustomer.id,
        updateDto,
      );

      expect(result).toEqual(updatedCustomer);
      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer', async () => {
      mockDb.delete.mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockCustomer]),
        }),
      });

      const result = await repository.deleteCustomer(mockCustomer.id);

      expect(result).toEqual(mockCustomer);
      expect(mockDb.delete).toHaveBeenCalled();
    });

    it('should return null if customer not found', async () => {
      mockDb.delete.mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      });

      const result = await repository.deleteCustomer('invalid-id');

      expect(result).toBeUndefined();
    });
  });

  describe('getCustomerByEmail', () => {
    it('should return a customer by email', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockCustomer]),
          }),
        }),
      });

      const result = await repository.getCustomerByEmail(mockCustomer.email);

      expect(result).toEqual(mockCustomer);
    });
  });

  describe('searchCustomers', () => {
    it('should search customers by term', async () => {
      const customers = [mockCustomer];
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(customers),
        }),
      });

      const result = await repository.searchCustomers('john');

      expect(result).toEqual(customers);
      expect(mockDb.select).toHaveBeenCalled();
    });

    it('should return empty array if search term is empty', async () => {
      const result = await repository.searchCustomers('');

      expect(result).toEqual([]);
      expect(mockDb.select).not.toHaveBeenCalled();
    });

    it('should return empty array if search term is whitespace', async () => {
      const result = await repository.searchCustomers('   ');

      expect(result).toEqual([]);
      expect(mockDb.select).not.toHaveBeenCalled();
    });
  });
});
