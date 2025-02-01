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
} from '@chakra-ui/react'
import CommandLineArgsTable from './CommandLineArgsTable';
import { Argument, parseCommandLineArgs } from './parser'
import JSONArgsViewer from './JSONArgsViewer';

function transformArgs(args: Argument[], updatedOutput: string): Argument[] {
  // argsをディープコピーする
  let result = args.map((arg) => ({ ...arg }));
  if (updatedOutput !== "") {
    const foundOutputArg = result.find((arg) => arg.option === "-o");
    if (foundOutputArg) {
      foundOutputArg.value = updatedOutput;
    } else {
      // "-o"が存在しないなら、新規追加する
      result.push({ type: "option-space", option: "-o", value: updatedOutput });
    }
  }
  return result;
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
  const [updatedOutputFile, setUpdatedOutputFile] = useState("");

  const parsedArgs = parseCommandLineArgs(commandLine, spaceOptions);
  const transformedArgs = transformArgs(parsedArgs, updatedOutputFile);

  return (
    <ChakraProvider>
      <Container maxW="container.md" py={8}>
        <Heading mb={4} size="lg">
          Command-line argument editor
        </Heading>
        <FormControl paddingTop={8}>
          <FormLabel>Input</FormLabel>
          <Input
            placeholder="clang -O3 main.c -o a.out"
            value={commandLine}
            onChange={(e) => setCommandLine(e.target.value)}
          />
        </FormControl>
        <Box py={4}>
          <FormControl>
            <FormLabel>Replace output filename ( <Code>-o</Code> )</FormLabel>
            <Input
              placeholder="output"
              value={updatedOutputFile}
              onChange={(e) => setUpdatedOutputFile(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box pb={4}>
          <JSONArgsViewer parsedArgs={transformedArgs} />
        </Box>
        <Box py={8}>
          <CommandLineArgsTable args={transformedArgs} />
        </Box>
      </Container>
    </ChakraProvider>
  )
}

export default App
