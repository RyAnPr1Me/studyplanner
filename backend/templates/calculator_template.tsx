import React, { useState } from 'react';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';

const QuadraticCalculator: React.FC = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [solution, setSolution] = useState<string | null>(null);

  const solve = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    if (Number.isNaN(numA) || Number.isNaN(numB) || Number.isNaN(numC)) {
      setSolution('Please enter valid numbers');
      return;
    }
    if (numA === 0) {
      setSolution('Coefficient "a" cannot be zero for quadratic equation');
      return;
    }
    const discriminant = numB ** 2 - 4 * numA * numC;
    if (discriminant < 0) {
      setSolution('No real solutions');
      return;
    }
    const root = Math.sqrt(discriminant);
    const x1 = (-numB + root) / (2 * numA);
    const x2 = (-numB - root) / (2 * numA);
    setSolution(`x₁ = ${x1.toFixed(2)}, x₂ = ${x2.toFixed(2)}`);
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Quadratic Equation Solver
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
        <TextField label="a" value={a} onChange={(event) => setA(event.target.value)} />
        <TextField label="b" value={b} onChange={(event) => setB(event.target.value)} />
        <TextField label="c" value={c} onChange={(event) => setC(event.target.value)} />
        <Button variant="contained" onClick={solve}>
          Solve
        </Button>
        {solution && (
          <Typography variant="body1" color="primary">
            {solution}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default QuadraticCalculator;
