import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './schema/customer.schema';

describe('CustomerController', () => {
  let controller: CustomerController;
  let mockService: {
    create: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

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
    mockService = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    // Manually create controller instance with injected mock
    controller = new CustomerController(mockService as any);
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

      mockService.create.mockResolvedValue(mockCustomer);

      const result = await controller.createCustomer(createDto);

      expect(result).toEqual(mockCustomer);
      expect(mockService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('getAllCustomers', () => {
    it('should return all customers when no search term', async () => {
      const customers = [mockCustomer];
      mockService.findAll.mockResolvedValue(customers);

      const result = await controller.getAllCustomers();

      expect(result).toEqual(customers);
      expect(mockService.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should search customers when search term provided', async () => {
      const customers = [mockCustomer];
      mockService.findAll.mockResolvedValue(customers);

      const result = await controller.getAllCustomers('john');

      expect(result).toEqual(customers);
      expect(mockService.findAll).toHaveBeenCalledWith('john');
    });
  });

  describe('getCustomerById', () => {
    it('should return a customer by id', async () => {
      mockService.findOne.mockResolvedValue(mockCustomer);

      const result = await controller.getCustomerById(mockCustomer.id);

      expect(result).toEqual(mockCustomer);
      expect(mockService.findOne).toHaveBeenCalledWith(mockCustomer.id);
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

      mockService.update.mockResolvedValue(updatedCustomer);

      const result = await controller.updateCustomer(
        mockCustomer.id,
        updateDto,
      );

      expect(result).toEqual(updatedCustomer);
      expect(mockService.update).toHaveBeenCalledWith(
        mockCustomer.id,
        updateDto,
      );
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.deleteCustomer(mockCustomer.id);

      expect(mockService.remove).toHaveBeenCalledWith(mockCustomer.id);
    });
  });
});
