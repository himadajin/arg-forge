import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useClipboard } from '@chakra-ui/hooks';
import { CopyIcon } from '@chakra-ui/icons';

import { formatArgs } from './utils/formatArgs';
import { Argument } from './parser';

function stringToBashArgs(formattedArgs: string[]): string {
  const bashArgs = formattedArgs.map((arg) => {
    if (arg.startsWith('"') && arg.endsWith('"')) {
      return `  ${arg}`;
    } else {
      return `  "${arg}"`;
    }
  });

  return `args=(\n${bashArgs.join("\n")}\n)`;
}

interface BashArgsViewerProps {
  parsedArgs: Argument[];
}

const BashArgsViewer: React.FC<BashArgsViewerProps> = ({ parsedArgs }) => {
  const formatted = React.useMemo(() => formatArgs(parsedArgs), [parsedArgs]);
  const bashString = stringToBashArgs(formatted);
  const { onCopy } = useClipboard(bashString);

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
        {bashString}
      </Box>
    </Box>
  );
};

export default BashArgsViewer;
