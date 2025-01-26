export type Token =
  | { type: "option"; value: string } //  -o, -v
  | { type: "equal"; value: "=" }   // "="
  | { type: "argument"; value: string }; // input.c

export type Option =
  | { type: "option", option: string, value: "" }
  | { type: "option-space", option: string, value: string }
  | { type: "option-equal", option: string, value: string }
  | { type: "argument", option: "", value: string }

function findTokenEnd(input: string, start: number): number {
  let i = start;
  while (i < input.length) {
    if (/\s/.test(input[i]) || input[i] === "=") {
      break;
    }
    i++;
  }
  return i;
}

function tokenizeCommandLine(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    // skip spaces
    if (/\s/.test(input[i])) {
      i++;
      continue;
    }

    if (input.slice(i).startsWith("-") || input.slice(i).startsWith("+")) {
      // parse "-arg", "+arg"
      const endIndex = findTokenEnd(input, i);
      const option = input.slice(i, endIndex);
      tokens.push({ type: "option", value: option });
      i = endIndex;
    } else if (input[i] === "=") {
      // '='
      tokens.push({ type: "equal", value: "=" });
      i++;
    } else {
      const endIndex = findTokenEnd(input, i);
      const argument = input.slice(i, endIndex);
      tokens.push({ type: "argument", value: argument });
      i = endIndex;
    }
  }

  return tokens;
}

function parseTokens(tokens: Token[], spaceOptions: string[]): Option[] {
  const options: Option[] = []
  let i = 0;
  while (i < tokens.length) {
    // -opt=value
    if (i + 2 < tokens.length &&
      tokens[i].type === "option" &&
      tokens[i + 1].type === "equal" &&
      tokens[i + 2].type === "argument") {
      options.push({
        type: "option-equal",
        option: tokens[i].value,
        value: tokens[i + 2].value
      })
      i += 3;
      continue;
    }

    // -o value
    if (i + 1 < tokens.length &&
      tokens[i].type === "option" &&
      spaceOptions.includes(tokens[i].value) &&
      tokens[i + 1].type === "argument") {
      options.push({
        type: "option-space",
        option: tokens[i].value,
        value: tokens[i + 1].value
      })
      i += 2;
      continue;
    }

    // input.txt
    if (tokens[i].type === "argument") {
      options.push({
        type: "argument",
        option: "",
        value: tokens[i].value
      })
    } else if (tokens[i].type === "option") {
      // -O3
      options.push({
        type: "option",
        option: tokens[i].value,
        value: ""
      })
    }
    i += 1;
  }

  return options
}

export function parseCommandLineOptions(input: string, spaceOptions: string[]): Option[] {
  return parseTokens(tokenizeCommandLine(input), spaceOptions);
}

export function getCommandLineOptionString(option: Option): string {
  switch (option.type) {
    case "argument":
      return option.value;
    case "option":
      return option.option;
    case "option-equal":
      return option.option + "=" + option.value;
    case "option-space":
      return option.option + " " + option.value;
  }
}

export function getCommandLineStringFromOptions(options: Option[]): string {
  return options.map(getCommandLineOptionString).join(" ");
}
