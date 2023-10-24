const express = require('express');
const cors = require('cors');
const app = express();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

let randomValues = [];
// Rota para gerar um número aleatório dentro de um intervalo especificado
app.get('/random', (req, res) => {
  const { min, max } = req.query;
  if (!min || !max) {
    return res.status(400).json({ error: 'Parâmetros "min" e "max" são obrigatórios.' });
  }

  const minValue = parseInt(min);
  const maxValue = parseInt(max);

  if (isNaN(minValue) || isNaN(maxValue) || minValue > maxValue) {
    return res.status(400).json({ error: 'Valores inválidos para "min" e "max".' });
  }

  const randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
  res.json({ randomValue });
});

// Rota para listar todos os números aleatórios gerados
app.get('/random/all', (req, res) => {
  res.json({ randomValues });
});

// Rota para adicionar um novo número aleatório à lista
app.post('/random', (req, res) => {
  const { min, max } = req.body;
  if (!min || !max) {
    return res.status(400).json({ error: 'Parâmetros "min" e "max" são obrigatórios.' });
  }

  const minValue = parseInt(min);
  const maxValue = parseInt(max);

  if (isNaN(minValue) || isNaN(maxValue) || minValue > maxValue) {
    return res.status(400).json({ error: 'Valores inválidos para "min" e "max".' });
  }

  const randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
  randomValues.push(randomValue);
  res.status(201).json({ randomValue });
});

// Rota para atualizar um número aleatório na lista
app.put('/random/:index', (req, res) => {
  const { index } = req.params;
  if (!randomValues[index]) {
    return res.status(404).json({ error: 'Índice não encontrado.' });
  }

  const { min, max } = req.body;
  if (!min || !max) {
    return res.status(400).json({ error: 'Parâmetros "min" e "max" são obrigatórios.' });
  }

  const minValue = parseInt(min);
  const maxValue = parseInt(max);

  if (isNaN(minValue) || isNaN(maxValue) || minValue > maxValue) {
    return res.status(400).json({ error: 'Valores inválidos para "min" e "max".' });
  }

  const randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
  randomValues[index] = randomValue;
  res.json({ randomValue });
});

// Rota para excluir um número aleatório da lista
app.delete('/random/:index', (req, res) => {
  const { index } = req.params;
  if (!randomValues[index]) {
    return res.status(404).json({ error: 'Índice não encontrado.' });
  }

  randomValues.splice(index, 1);
  res.json({ message: 'Valor excluído com sucesso.' });
});

app.listen(port, () => {
  console.log(`API de números aleatórios está rodando na porta ${port}`);
});
