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

function transformArgs(args: Argument[], updatedInput: string, updatedOutput: string): Argument[] {
  let result = args.map((arg) => ({ ...arg }));

  if (updatedOutput !== "") {
    const outputArg = result.findLast(arg => arg.option === "-o");
    if (outputArg) {
      // "-o"が存在するなら、更新する
      outputArg.value = updatedOutput;
    } else {
      // "-o"が存在しないなら、新規追加する
      result.push({ type: "option-space", option: "-o", value: updatedOutput });
    }
  }

  if (updatedInput !== "") {
    const inputArg = result.findLast(arg => arg.type === "value");
    if (inputArg) {
      // 入力ファイルが見つかった場合は更新する
      inputArg.value = updatedInput;
    } else {
      // 入力ファイルが見つからない場合は新規追加する
      result.push({ type: "value", option: "", value: updatedInput });
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
  const [updatedInputFile, setUpdatedInputFile] = useState(""); // 新規追加

  const parsedArgs = parseCommandLineArgs(commandLine, spaceOptions);
  const transformedArgs = transformArgs(parsedArgs, updatedInputFile, updatedOutputFile);

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
            <FormLabel>Replace input filename</FormLabel>
            <Input
              placeholder="input file"
              value={updatedInputFile}
              onChange={(e) => setUpdatedInputFile(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box pb={4}>
          <FormControl>
            <FormLabel>Replace output filename ( <Code>-o</Code> )</FormLabel>
            <Input
              placeholder="output"
              value={updatedOutputFile}
              onChange={(e) => setUpdatedOutputFile(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box py={4}>
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
