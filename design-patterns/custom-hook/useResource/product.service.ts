// product.service.ts
import { Injectable, inject } from '@angular/core';
import { ResourceService } from './resource-mock.service';

export interface Product {
  id: string;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private resource = inject(ResourceService);

  useProduct(productId: string) {
    return this.resource.createResource<Product>(
      `/products/${productId}`,
      { id: productId, title: '' }
    );
  }
}