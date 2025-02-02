export type Token =
  | { type: "option", value: string } //  eg. "-option", "+option"
  | { type: "equal", value: "=" }   // "="
  | { type: "value", value: string } // eg. "value"
  | { type: "redirect", value: string }; // e.g. ">", "2>&1"

export type Argument =
  | { type: "option", option: string, value: "" }
  | { type: "option-space", option: string, value: string }
  | { type: "option-equal", option: string, value: string }
  | { type: "value", option: "", value: string }
  | { type: "redirect", option: string, value: string };

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

    // tokenize "2>&1"
    if (input.slice(i).startsWith("2>&1")) {
      tokens.push({ type: "redirect", value: "2>&1" });
      i += 4;
      continue;
    }

    // tokenize ">>", "2>"
    if (input.slice(i).startsWith(">>") || input.slice(i).startsWith("2>")) {
      tokens.push({ type: "redirect", value: input.slice(i, i + 2) });
      i += 2;
      continue;
    }

    // tokenize ">"
    if (input[i] === ">") {
      tokens.push({ type: "redirect", value: ">" });
      i++;
      continue;
    }

    // tokenize option, value
    if (input.slice(i).startsWith("-") || input.slice(i).startsWith("+")) {
      // tokenize "-option", "+option"
      const endIndex = findTokenEndIndex(input, i);
      const option = input.slice(i, endIndex);
      tokens.push({ type: "option", value: option });
      i = endIndex;
    } else if (input[i] === "=") {
      // tokenize "="
      tokens.push({ type: "equal", value: "=" });
      i++;
    } else {
      // tokenize "value"
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
    // parse redirect
    if (tokens[i].type === "redirect") {
      // parse "2>&1"
      if (tokens[i].value === "2>&1") {
        args.push({
          type: "redirect",
          option: tokens[i].value,
          value: ""
        });
        i++;
        continue;
      }
      // parse ">>", ">" with value
      if (i + 1 < tokens.length && tokens[i + 1].type === "value") {
        args.push({
          type: "redirect",
          option: tokens[i].value,
          value: tokens[i + 1].value
        });
        i += 2;
        continue;
      }
    }

    // parse option with equal
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

    // parse option with space
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

    if (tokens[i].type === "value") {
      // parse value
      args.push({
        type: "value",
        option: "",
        value: tokens[i].value
      })
    } else if (tokens[i].type === "option") {
      // parse option without value
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
    case "redirect":
      return args.value ? (args.option + " " + args.value) : args.option;
  }
}

export function getCommandLineStringFromArgs(args: Argument[]): string {
  return args.map(getCommandLineOptionString).join(" ");
}
