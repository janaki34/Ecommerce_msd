const express = require('express');
const app = express();
app.use(express.json());

let products = [
  { id: 1, name: 'T-shirt', price: 20 },
  { id: 2, name: 'Mug', price: 10 }
];

let orders = [];
let orderId = 1;


app.get('/products', (req, res) => {
  res.json(products);
});


app.post('/orders', (req, res) => {
  const { customerId, items } = req.body;
  if (!customerId || !items) return res.status(400).send('Missing data');

  const order = { id: orderId++, customerId, items, status: 'pending' };
  orders.push(order);
  res.status(201).json(order);
});


app.get('/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === +req.params.id);
  if (!order) return res.status(404).send('Order not found');
  res.json(order);
});

app.listen(3000, () => console.log('Server running on port 3000'));

