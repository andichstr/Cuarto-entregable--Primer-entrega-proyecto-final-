//@ts-check
import express from 'express';
import productsRoutes from './routes/products.router.js';
import cartsRoutes from './routes/carts.router.js';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);

app.get('*', (req, res) => {
  res.json({"error": "Page not found."});
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});