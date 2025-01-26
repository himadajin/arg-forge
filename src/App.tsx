import { useState } from 'react'
import {
  Box,
  ChakraProvider,
  Code,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { Option, parseCommandLineOptions, getCommandLineOptionString } from './parser'

const renderTableOfOptions = ({ options }: { options: Option[] }) => {
  return (
    <Table variant="simple" size="sm">
      <Thead>
        <Tr>
          <Th>TYPE</Th>
          <Th>Argument</Th>
        </Tr>
      </Thead>
      <Tbody>
        {options.map((opt, index) => (
          <Tr key={index}>
            <Td>{opt.type}</Td>
            <Td><Code>{getCommandLineOptionString(opt)}</Code></Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

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
  const parsedOptions = parseCommandLineOptions(commandLine, spaceOptions);

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
          {renderTableOfOptions({ options: parsedOptions })}
        </Box>
      </Container>
    </ChakraProvider>
  )
}

export default App
