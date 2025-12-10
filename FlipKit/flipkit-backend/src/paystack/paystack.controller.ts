import {
  Body,
  Controller,
  Post,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PaystackService } from '../paystack/paystack.service';
// You can replace this with your actual Order/User service
import { OrderService } from './order/order.service';

class VerifyPaymentDto {
  reference: string;
  email: string;
  amount: number; // in base currency (e.g., USD, NGN)
}

@Controller('paystack')
export class PaystackController {
  private readonly logger = new Logger(PaystackController.name);

  constructor(
    private readonly paystackService: PaystackService,
    private readonly orderService: OrderService, // your real service
  ) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    const { reference, email, amount } = dto;

    if (!reference || !email || !amount) {
      throw new BadRequestException('Missing required fields');
    }

    // 1. Verify with Paystack
    const result = await this.paystackService.verifyPayment(reference);

    if (!result.status || result.data.status !== 'success') {
      this.logger.warn(`Paystack verification failed for ref: ${reference}`);
      throw new BadRequestException('Payment verification failed on Paystack');
    }

    const paystackAmountKobo = result.data.amount; // in kobo
    const paystackEmail = result.data.customer.email;
    const gatewayResponse = result.data.gateway_response;

    // 2. Security checks
    if (paystackEmail.toLowerCase() !== email.toLowerCase()) {
      throw new BadRequestException('Email mismatch');
    }

    // Convert your frontend amount (e.g., NGN) to kobo for comparison
    const expectedAmountKobo = Math.round(amount);

    if (paystackAmountKobo !== expectedAmountKobo) {
      this.logger.warn(
        `Amount mismatch: expected ${expectedAmountKobo}, got ${paystackAmountKobo}`,
      );
      throw new BadRequestException('Amount mismatch');
    }

    // 4. Create or update order as paid
    const order = await this.orderService.createOrUpdatePaidOrder({
      paymentReference: reference,
      email,
      amount,
      gatewayResponse,
      paidAt: new Date(result.data.paid_at),
    });

    this.logger.log(`Payment verified and recorded: ${reference}`);

    return {
      success: true,
      message: 'Payment verified successfully',
      reference,
      order,
    };
  }
}