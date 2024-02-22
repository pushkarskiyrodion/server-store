import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import { router } from './routes/router.js';

const uri = "mongodb+srv://aethereal:12mys15rpv@cluster0.qirvyop.mongodb.net/?retryWrites=true&w=majority"

const app = express();

mongoose.connect(uri)
  .then(() => {
      console.log('Connected to the database')
  })
  .catch((err) => {
      console.error(`Error connecting to the database. n${err}`);
  })

app.use(morgan('combined'));
app.use(cors())
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 3050;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});
