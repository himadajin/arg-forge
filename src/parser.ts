export type Token =
  | { type: "option", value: string } //  -o, -v
  | { type: "equal", value: "=" }   // "="
  | { type: "value", value: string }; // input.c

export type Argument =
  | { type: "option", option: string, value: "" }
  | { type: "option-space", option: string, value: string }
  | { type: "option-equal", option: string, value: string }
  | { type: "value", option: "", value: string }

function findTokenEndIndex(input: string, start: number): number {
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
      const endIndex = findTokenEndIndex(input, i);
      const option = input.slice(i, endIndex);
      tokens.push({ type: "option", value: option });
      i = endIndex;
    } else if (input[i] === "=") {
      // '='
      tokens.push({ type: "equal", value: "=" });
      i++;
    } else {
      const endIndex = findTokenEndIndex(input, i);
      const argument = input.slice(i, endIndex);
      tokens.push({ type: "value", value: argument });
      i = endIndex;
    }
  }

  return tokens;
}

function parseTokens(tokens: Token[], spaceOptions: string[]): Argument[] {
  const args: Argument[] = []
  let i = 0;
  while (i < tokens.length) {
    // -opt=value
    if (i + 2 < tokens.length &&
      tokens[i].type === "option" &&
      tokens[i + 1].type === "equal" &&
      tokens[i + 2].type === "value") {
      args.push({
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
      tokens[i + 1].type === "value") {
      args.push({
        type: "option-space",
        option: tokens[i].value,
        value: tokens[i + 1].value
      })
      i += 2;
      continue;
    }

    // input.txt
    if (tokens[i].type === "value") {
      args.push({
        type: "value",
        option: "",
        value: tokens[i].value
      })
    } else if (tokens[i].type === "option") {
      // -O3
      args.push({
        type: "option",
        option: tokens[i].value,
        value: ""
      })
    }
    i += 1;
  }

  return args
}

export function parseCommandLineArgs(input: string, spaceOptions: string[]): Argument[] {
  return parseTokens(tokenizeCommandLine(input), spaceOptions);
}

export function getCommandLineOptionString(args: Argument): string {
  switch (args.type) {
    case "value":
      return args.value;
    case "option":
      return args.option;
    case "option-equal":
      return args.option + "=" + args.value;
    case "option-space":
      return args.option + " " + args.value;
  }
}

export function getCommandLineStringFromArgs(args: Argument[]): string {
  return args.map(getCommandLineOptionString).join(" ");
}
