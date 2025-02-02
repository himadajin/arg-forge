import { useState, useMemo } from 'react'
import {
  Box,
  ChakraProvider,
  Checkbox,
  Code,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
} from '@chakra-ui/react'
import CommandLineArgsTable from './CommandLineArgsTable';
import { Argument, parseCommandLineArgs } from './parser'
import JSONArgsViewer from './JSONArgsViewer';

function transformArgs(
  args: Argument[],
  updatedInput: string,
  updatedOutput: string,
  newRedirectFileName: string,
  removeHeadCmd: boolean,
  includeStderr: boolean,
): Argument[] {
  if (args.length === 0) {
    return [];
  }

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

  if (newRedirectFileName !== "") {
    const redirectArg = result.findLast(arg => arg.type === "redirect" && arg.option === ">");
    if (redirectArg) {
      redirectArg.value = newRedirectFileName;
    } else {
      result.push({ type: "redirect", option: ">", value: newRedirectFileName });
    }
  }

  // remove head command if needed
  if (removeHeadCmd && result[0].type === "value") {
    result.shift();
  }

  // append 2>&1 if needed
  if (includeStderr) {
    const redirectArgIdx = result.findLastIndex(
      arg =>
        (arg.type === "redirect") &&
        (arg.option === ">")
    );
    const stderrArgIdx = result.findLastIndex(
      arg =>
        (arg.type === "redirect") &&
        (arg.option === "2>&1")
    );
    if (redirectArgIdx !== -1 && stderrArgIdx === -1) {
      result.push({ type: "redirect", option: "2>&1", value: "" });
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

  const [commandLineInput, setCommandLineInput] = useState("");
  const [outputFile, setOutputFile] = useState("");
  const [updatedInputFile, setUpdatedInputFile] = useState("");
  const [newRedirectFileName, setNewRedirectFileName] = useState("");

  const [removeHeadCmd, setRemoveHeadCmd] = useState(true);
  const [includeStderr, setIncludeStderr] = useState(true);

  const parsedArgs = useMemo(
    () => parseCommandLineArgs(commandLineInput, spaceOptions),
    [commandLineInput, spaceOptions]
  );
  const transformedArgs = useMemo(
    () => transformArgs(
      parsedArgs, updatedInputFile, outputFile, newRedirectFileName,
      removeHeadCmd, includeStderr
    ),
    [parsedArgs, updatedInputFile, outputFile, newRedirectFileName,
      removeHeadCmd, includeStderr]
  );

  return (
    <ChakraProvider>
      <Container maxW="container.md" py={8} pb={64}>
        <Heading mb={4} size="lg">
          Command-line argument editor
        </Heading>
        <FormControl paddingTop={8}>
          <FormLabel>Input</FormLabel>
          <Input
            placeholder="clang -O3 main.c -o a.out"
            value={commandLineInput}
            onChange={(e) => setCommandLineInput(e.target.value)}
          />
        </FormControl>
        <Box py={2}>
          <FormControl>
            <FormLabel>Replace input filename</FormLabel>
            <Input
              placeholder="input file"
              value={updatedInputFile}
              onChange={(e) => setUpdatedInputFile(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box py={2}>
          <FormControl>
            <FormLabel>Replace output filename ( <Code>-o</Code> )</FormLabel>
            <Input
              placeholder="output"
              value={outputFile}
              onChange={(e) => setOutputFile(e.target.value)}
            />
          </FormControl>
        </Box>
        <Box py={2}>
          <FormControl>
            <FormLabel>Replace redirect filename ( <Code>{'>'} output.log </Code> )</FormLabel>
            <Input
              placeholder="output"
              value={newRedirectFileName}
              onChange={(e) => setNewRedirectFileName(e.target.value)}
            />
          </FormControl>
        </Box>

        <HStack spacing={4} py={4}>
          <Checkbox
            isChecked={removeHeadCmd}
            onChange={(e) => setRemoveHeadCmd(e.target.checked)}
          >
            Remove head command.
          </Checkbox>
          <Checkbox
            isChecked={includeStderr}
            onChange={(e) => setIncludeStderr(e.target.checked)}
          >
            Redirect stderr to stdout. ( <Code>2{'>&'}1</Code> )
          </Checkbox>
        </HStack>

        <Tabs pt={8}>
          <TabList>
            <Tab>JSON View</Tab>
            <Tab>Table View</Tab>
          </TabList>
          <TabPanels minH="100">
            <TabPanel>
              <JSONArgsViewer parsedArgs={transformedArgs} />
            </TabPanel>
            <TabPanel>
              <CommandLineArgsTable args={transformedArgs} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </ChakraProvider>
  )
}

export default App
