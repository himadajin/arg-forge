export const formatArgs = (args: any[]): string[] => {
  return args.reduce((acc: string[], arg) => {
    switch (arg.type) {
      case "option-equal":
        acc.push(`${arg.option}=${arg.value}`);
        break;
      case "option":
        acc.push(arg.option);
        break;
      case "option-space":
        acc.push(arg.option);
        if (arg.value) {
          acc.push(arg.value);
        }
        break;
      case "value":
        acc.push(arg.value);
        break;
      case "redirect":
        acc.push(arg.option);
        if (arg.value) {
          acc.push(arg.value);
        }
        break;
    }
    return acc;
  }, []);
};
