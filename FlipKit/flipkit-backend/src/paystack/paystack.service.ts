import { HttpService } from '@nestjs/axios';
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaystackService {
  private readonly secretKey: string;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY')!;
    if (!this.secretKey) {
      throw new Error('PAYSTACK_SECRET_KEY is not defined');
    }
  }

  async verifyPayment(reference: string): Promise<any> {
    if (!reference) {
      throw new BadRequestException('Payment reference is required');
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://api.paystack.co/transaction/verify/${reference}`, {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new BadRequestException(error.response.data.message || 'Verification failed');
      }
      throw new InternalServerErrorException('Failed to verify payment with Paystack');
    }
  }
}