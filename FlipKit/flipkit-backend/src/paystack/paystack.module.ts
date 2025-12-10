import { Module } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { PaystackController } from './paystack.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OrderModule } from './order/order.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [OrderModule, HttpModule],
  providers: [PaystackService, PrismaService],
  controllers: [PaystackController],
  exports: [PaystackService],
})
export class PaystackModule {}