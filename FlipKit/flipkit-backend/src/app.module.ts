import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { VendorModule } from './vendors/vendor.module';
import { PaystackModule } from './paystack/paystack.module'

@Module({
  imports: [AuthModule, VendorModule, PaystackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
