import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useClipboard } from '@chakra-ui/hooks';
import { CopyIcon } from '@chakra-ui/icons';

import { formatArgs } from './utils/formatArgs';
import { Argument } from './parser';

interface JSONArgsViewerProps {
  parsedArgs: Argument[];
}

const JSONArgsViewer: React.FC<JSONArgsViewerProps> = ({ parsedArgs }) => {
  const formatted = React.useMemo(() => formatArgs(parsedArgs), [parsedArgs]);
  const jsonString = JSON.stringify({ args: formatted }, null, 2);
  const { onCopy } = useClipboard(jsonString);

  return (
    <Box position="relative">
      <Button
        onClick={onCopy}
        size="sm"
        position="absolute"
        right="4"
        top="4"
        variant="ghost"
      >
        <CopyIcon />
      </Button>
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
    </Box>
  );
};

export default JSONArgsViewer;
