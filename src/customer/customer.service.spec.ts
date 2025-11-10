import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './schema/customer.schema';

describe('CustomerService', () => {
  let service: CustomerService;
  let mockRepository: {
    createCustomer: ReturnType<typeof vi.fn>;
    getAllCustomers: ReturnType<typeof vi.fn>;
    getCustomerById: ReturnType<typeof vi.fn>;
    updateCustomer: ReturnType<typeof vi.fn>;
    deleteCustomer: ReturnType<typeof vi.fn>;
    getCustomerByEmail: ReturnType<typeof vi.fn>;
    searchCustomers: ReturnType<typeof vi.fn>;
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

  const mockCreateDto: CreateCustomerDto = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'USA',
  };

  beforeEach(() => {
    mockRepository = {
      createCustomer: vi.fn(),
      getAllCustomers: vi.fn(),
      getCustomerById: vi.fn(),
      updateCustomer: vi.fn(),
      deleteCustomer: vi.fn(),
      getCustomerByEmail: vi.fn(),
      searchCustomers: vi.fn(),
    };

    // Manually create service instance with injected mock
    service = new CustomerService(mockRepository as any);
  });

  describe('create', () => {
    it('should create a customer successfully', async () => {
      mockRepository.getCustomerByEmail.mockResolvedValue(null);
      mockRepository.createCustomer.mockResolvedValue(mockCustomer);

      const result = await service.create(mockCreateDto);

      expect(result).toEqual(mockCustomer);
      expect(mockRepository.getCustomerByEmail).toHaveBeenCalledWith(
        mockCreateDto.email,
      );
      expect(mockRepository.createCustomer).toHaveBeenCalledWith(mockCreateDto);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockRepository.getCustomerByEmail.mockResolvedValue(mockCustomer);

      await expect(service.create(mockCreateDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRepository.createCustomer).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all customers when no search term provided', async () => {
      const customers = [mockCustomer];
      mockRepository.getAllCustomers.mockResolvedValue(customers);

      const result = await service.findAll();

      expect(result).toEqual(customers);
      expect(mockRepository.getAllCustomers).toHaveBeenCalled();
    });

    it('should search customers when search term provided', async () => {
      const customers = [mockCustomer];
      mockRepository.searchCustomers.mockResolvedValue(customers);

      const result = await service.findAll('john');

      expect(result).toEqual(customers);
      expect(mockRepository.searchCustomers).toHaveBeenCalledWith('john');
    });
  });

  describe('findOne', () => {
    it('should return a customer by id', async () => {
      mockRepository.getCustomerById.mockResolvedValue(mockCustomer);

      const result = await service.findOne(mockCustomer.id);

      expect(result).toEqual(mockCustomer);
      expect(mockRepository.getCustomerById).toHaveBeenCalledWith(
        mockCustomer.id,
      );
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockRepository.getCustomerById.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
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

    it('should update a customer successfully', async () => {
      const updatedCustomer = { ...mockCustomer, ...updateDto };
      mockRepository.getCustomerById.mockResolvedValue(mockCustomer);
      mockRepository.getCustomerByEmail.mockResolvedValue(null);
      mockRepository.updateCustomer.mockResolvedValue(updatedCustomer);

      const result = await service.update(mockCustomer.id, updateDto);

      expect(result).toEqual(updatedCustomer);
      expect(mockRepository.getCustomerById).toHaveBeenCalledWith(
        mockCustomer.id,
      );
      expect(mockRepository.updateCustomer).toHaveBeenCalledWith(
        mockCustomer.id,
        updateDto,
      );
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockRepository.getCustomerById.mockResolvedValue(null);

      await expect(service.update('invalid-id', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if email already exists for another customer', async () => {
      const otherCustomer = { ...mockCustomer, id: 'other-id' };
      mockRepository.getCustomerById.mockResolvedValue(mockCustomer);
      mockRepository.getCustomerByEmail.mockResolvedValue(otherCustomer);

      await expect(service.update(mockCustomer.id, updateDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a customer successfully', async () => {
      mockRepository.deleteCustomer.mockResolvedValue(mockCustomer);

      await service.remove(mockCustomer.id);

      expect(mockRepository.deleteCustomer).toHaveBeenCalledWith(
        mockCustomer.id,
      );
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockRepository.deleteCustomer.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
