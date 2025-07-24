import { EntitySchema } from 'typeorm';

const Product = new EntitySchema({
  name: 'Product',
  tableName: 'products',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    name: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
    description: {
      type: 'text',
      nullable: true
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false
    },
    stock: {
      type: 'int',
      nullable: false,
      default: 0
    },
    image_url: {
      type: 'varchar',
      length: 500,
      nullable: true
    },
    created_at: {
      type: 'timestamp',
      createDate: true
    },
    updated_at: {
      type: 'timestamp',
      updateDate: true
    }
  },
  relations: {
    cartItems: {
      target: 'CartItem',
      type: 'one-to-many',
      inverseSide: 'product'
    }
  }
});

export default Product;