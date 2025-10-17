
const express = require('express');
const app = express();
app.use(express.json());


let products = [
  { id: 1, name: 'Laptop', description: 'High performance laptop', price: 75000, stock: 10 },
  { id: 2, name: 'Smartphone', description: 'Latest smartphone', price: 45000, stock: 25 },
  { id: 3, name: 'Headphones', description: 'Noise-cancelling headphones', price: 5000, stock: 50 }
];

let orders = [];
let nextOrderId = 1;


app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/orders', (req, res) => {
  const { customer_id, items } = req.body;
  if (!customer_id || !items || !items.length) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  let total_amount = 0;
  for (let item of items) {
    const product = products.find(p => p.id === item.product_id);
    if (!product) return res.status(404).json({ error: `Product ${item.product_id} not found` });
    if (item.quantity > product.stock) return res.status(400).json({ error: `Insufficient stock for product ${product.name}` });
    total_amount += product.price * item.quantity;
    product.stock -= item.quantity; 
  }

  const order = {
    order_id: nextOrderId++,
    customer_id,
    items,
    status: 'pending',
    total_amount
  };

  orders.push(order);
  res.status(201).json(order);
});

app.get('/orders', (req, res) => {
  const { customer_id } = req.query;
  if (!customer_id) return res.status(400).json({ error: 'customer_id query param is required' });
  const customerOrders = orders.filter(o => o.customer_id == customer_id);
  res.json(customerOrders);
});

app.put('/orders/:order_id', (req, res) => {
  const order = orders.find(o => o.order_id === parseInt(req.params.order_id));
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const { status } = req.body;
  if (status) order.status = status;
  res.json(order);
});

app.delete('/orders/:order_id', (req, res) => {
  const index = orders.findIndex(o => o.order_id === parseInt(req.params.order_id));
  if (index === -1) return res.status(404).json({ error: 'Order not found' });
  orders.splice(index, 1);
  res.json({ message: 'Order deleted successfully' });
});

app.get('/orders/:order_id/status', (req, res) => {
  const order = orders.find(o => o.order_id === parseInt(req.params.order_id));
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  res.json({
    order_id: order.order_id,
    status: order.status,
    estimated_delivery: estimatedDelivery.toISOString().split('T')[0]
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
