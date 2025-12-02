const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4001;

// Parse JSON bodies
app.use(express.json());
app.use(cors());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'validation-service' });
});

// Core validation endpoint
app.post('/validate', (req, res) => {
  const { fields } = req.body;

  if (!Array.isArray(fields)) {
    return res.status(400).json({
      error: '"fields" must be an array',
    });
  }

  const results = fields.map((field) => {
    const { name, value, validator } = field || {};

    if (typeof name !== 'string' || typeof validator !== 'string') {
      return {
        name: name || null,
        isValid: false,
        error: 'Field "name" and "validator" must be strings',
      };
    }

    try {
      const regex = new RegExp(validator);
      const valueString = value == null ? '' : String(value);
      const isValid = regex.test(valueString);

      return { name, isValid };
    } catch (e) {
      return {
        name,
        isValid: false,
        error: 'Invalid regex',
      };
    }
  });

  res.json({ results });
});

app.listen(PORT, () => {
  console.log(`Validation service running on port ${PORT}`);
});
