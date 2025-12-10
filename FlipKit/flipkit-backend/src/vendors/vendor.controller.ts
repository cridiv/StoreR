import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { VendorService } from './vendor.service';

@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get()
  async getAllVendors(@Query('product') product?: string) {
    if (product) {
      return this.vendorService.getVendorsByProduct(product);
    }
    return this.vendorService.getAllVendors();
  }

  @Get(':id')
  async getVendorById(@Param('id') id: string) {
    return this.vendorService.getVendorById(id);
  }

  @Post()
  async addVendor(
    @Body()
    data: {
      name: string;
      product: string;
      contact?: string;
      picture?: string;
      category?: string;
      avg_price?: string;
    },
  ) {
    return this.vendorService.addVendor(data);
  }
}