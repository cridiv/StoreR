// src/order/order.service.ts
import {
  Injectable,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

export type PaidOrderPayload = {
  paymentReference: string;
  email: string;
  amount: number; // in base currency (e.g., NGN)
  gatewayResponse?: string;
  paidAt: Date;
  metadata?: any;
  username?: string;
};

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private prisma: PrismaService) {}

  // Called after successful Paystack verification
  async createOrUpdatePaidOrder(payload: PaidOrderPayload) {
    const {
      paymentReference,
      email,
      amount,
      gatewayResponse,
      paidAt,
      metadata,
      username,
    } = payload;

    // Prevent double-processing (idempotency)
    const existing = await this.findByPaymentReference(paymentReference);
    if (existing?.paymentStatus === 'PAID') {
      this.logger.warn(`Duplicate payment attempt: ${paymentReference}`);
      return existing; // already processed
    }

    // If a pending order exists, update it; otherwise create new
    if (existing) {
      return this.prisma.order.update({
        where: { paymentReference },
        data: {
          paymentStatus: 'PAID',
          gatewayResponse,
          paidAt,
          updatedAt: new Date(),
        },
      });
    }

    return this.prisma.order.create({
      data: {
        email: email.toLowerCase().trim(),
        username,
        amount,
        paymentReference,
        paymentStatus: 'PAID',
        gatewayResponse,
        paidAt,
        metadata,
      },
    });
  }

  // Optional: create pending order before payment (e.g., on checkout start)
  async createPendingOrder(dto: CreateOrderDto & { paymentReference?: string }) {
    const ref = dto.paymentReference || this.generateReference();

    const existing = await this.prisma.order.findUnique({
      where: { paymentReference: ref },
    });

    if (existing) {
      throw new ConflictException('Order reference already exists');
    }

    return this.prisma.order.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        username: dto.username,
        amount: dto.amount,
        currency: dto.currency || 'NGN',
        paymentReference: ref,
        paymentStatus: 'PENDING',
        metadata: dto.metadata,
      },
    });
  }

  async findByPaymentReference(reference: string) {
    return this.prisma.order.findUnique({
      where: { paymentReference: reference },
    });
  }

  async findById(id: string) {
    return this.prisma.order.findUnique({ where: { id } });
  }

  async getUserOrders(email: string) {
    return this.prisma.order.findMany({
      where: { email: email.toLowerCase().trim() },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Simple reference generator (you can use Paystack's ref too)
  private generateReference(): string {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}