import React from 'react'
import { Box } from '@mui/material';

function Canvas({children}) {
  const windowHeight = window.innerHeight;
  const boxHeight = windowHeight * 0.3; // 30% of the window's height

  return (
     <Box height={`${boxHeight}px`} width="100%">
      {children}
    </Box>
  )
}

export default Canvas;