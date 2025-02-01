import React from 'react';
import { Box } from '@chakra-ui/react';

import { formatArgs } from './utils/formatArgs';
import { Argument } from './parser';

interface JSONArgsViewerProps {
  parsedArgs: Argument[];
}

const JSONArgsViewer: React.FC<JSONArgsViewerProps> = ({ parsedArgs }) => {
  const formatted = React.useMemo(() => formatArgs(parsedArgs), [parsedArgs]);
  const jsonString = JSON.stringify({ args: formatted }, null, 2);

  return (
    <Box
      as="pre"
      p={4}
      bg="gray.50"
      borderWidth="1px"
      borderRadius="md"
      overflow="auto"
    >
      {jsonString}
    </Box>
  );
};

export default JSONArgsViewer;
