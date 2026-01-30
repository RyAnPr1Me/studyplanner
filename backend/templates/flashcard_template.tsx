import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';

interface FlashcardData {
  question: string;
  answer: string;
}

const StudyFlashcards: React.FC = () => {
  const [cards] = useState<FlashcardData[]>([
    { question: 'What is the derivative of x²?', answer: '2x' },
    { question: 'What is ∫x dx?', answer: 'x²/2 + C' },
    { question: 'What is the quadratic formula?', answer: '(-b ± √(b² - 4ac)) / (2a)' },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const next = () => {
    setShowAnswer(false);
    setCurrentIndex((index) => (index + 1) % cards.length);
  };

  return (
    <Card sx={{ minWidth: 300, minHeight: 200 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Card {currentIndex + 1} of {cards.length}
        </Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          {cards[currentIndex].question}
        </Typography>
        {showAnswer && (
          <Typography variant="h5" color="primary">
            {cards[currentIndex].answer}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="outlined" onClick={() => setShowAnswer((value) => !value)}>
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </Button>
          <Button variant="contained" onClick={next}>
            Next
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudyFlashcards;
