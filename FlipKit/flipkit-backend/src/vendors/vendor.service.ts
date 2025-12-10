import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  // Fetch all vendors
  async getAllVendors() {
    return this.prisma.vendor.findMany({
      orderBy: { createdAt: 'desc' }, // newest first
    });
  }

  async getVendorsByProduct(product: string) {
    return this.prisma.vendor.findMany({
      where: { category: product },
    });
  }

  // Optional: add a vendor manually
  addVendor(data: {
    name: string;
    product: string;
    contact?: string;
    picture?: string;
    category?: string;
    avg_price?: string;
    res_time?: string;
    ratings?: string;
    tot_prod?: string;
  }) {
    return this.prisma.vendor.create({ data });
  }

  async getVendorById(id: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }
}
