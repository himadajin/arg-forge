export const formatArgs = (args: any[]): string[] => {
  return args.reduce((acc: string[], arg) => {
    if (arg.type === "option-equal") {
      acc.push(`${arg.option}=${arg.value}`);
    } else if (arg.type === "option" || arg.type === "option-space") {
      acc.push(arg.option);
      if (arg.value && arg.type === "option-space") acc.push(arg.value);
    } else if (arg.type === "value") {
      acc.push(arg.value);
    }
    return acc;
  }, []);
};
