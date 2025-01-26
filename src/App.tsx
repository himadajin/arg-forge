import { useState } from 'react'
import {
  Box,
  ChakraProvider,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react'
import CommandLineArgsTable from './CommandLineArgsTable';
import { parseCommandLineArgs } from './parser'

function App() {
  const spaceOptions = [
    "-triple",
    "-main-file-name",
    "-mrelocation-model",
    "-pic-level",
    "-target-cpu",
    "-target-abi",
    "-target-linker-version",
    "-resource-dir",
    "-isysroot",
    "-internal-isystem",
    "-internal-externc-isystem",
    "-ferror-limit",
    "-stack-protector",
    "-o",
    "-x"
  ];

  const [commandLine, setCommandLine] = useState("");
  const parsedArgs = parseCommandLineArgs(commandLine, spaceOptions);

  return (
    <ChakraProvider>
      <Container maxW="container.md" py={8}>
        <Heading mb={4} size="lg">
          Command-line argument editor
        </Heading>

        <FormControl>
          <FormLabel>Input</FormLabel>
          <Input
            placeholder="clang -O3 main.c -o a.out"
            value={commandLine}
            onChange={(e) => setCommandLine(e.target.value)}
          />
        </FormControl>
        <Box py={8}>
          <CommandLineArgsTable args={parsedArgs} />
        </Box>
      </Container>
    </ChakraProvider>
  )
}

export default App
