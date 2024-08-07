import express from 'express';
import cors from 'cors';
import mongoose, { Schema } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const port = 4000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const username = process.env.MONGO_USERNAME;
const password = encodeURIComponent(process.env.MONGO_PASSWORD);

mongoose.connect(
  'mongodb+srv://sakshat678:Akshat1810@akshat.y63cnvx.mongodb.net/?retryWrites=true&w=majority&appName=Akshat',
).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error', error);
});

const productSchema = new Schema({
  id:{
    type:Number,
    required:true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {

    type:String,
    required:true,
  }

});
const Product = mongoose.model('Product', productSchema);

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find().select(["-__v", "-_id"]);
    res.json(products);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/post', async (req, res) => {
  try {
    const {id, name, description, price,image } = req.body;
    const product = new Product({ id,name, description, price, image });
    await product.save();
    console.log(product)
    res.json({ message: 'Product added successfully' });
  } catch (err) {
    console.log(err, 'error');
    res.status(500).json({ error: 'Failed to add product' });
  }
});
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.log(err, 'error');
    res.status(500).json({ error: 'Failed to delete product' });
  }
});
app.listen(port, () => console.log('Server running on port ${port}'));