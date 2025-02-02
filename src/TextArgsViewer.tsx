import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useClipboard } from '@chakra-ui/hooks';
import { CopyIcon } from '@chakra-ui/icons';

import { Argument, getCommandLineStringFromArgs } from './parser';

interface TextArgsViewerProps {
  parsedArgs: Argument[];
}

const TextArgsViewer: React.FC<TextArgsViewerProps> = ({ parsedArgs }) => {
  const argsString = getCommandLineStringFromArgs(parsedArgs);
  const { onCopy } = useClipboard(argsString);

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
        overflow="visible"
        whiteSpace="pre-wrap"
        wordBreak="break-word"
      >
        {argsString}
      </Box>
    </Box>
  );
};

export default TextArgsViewer;
