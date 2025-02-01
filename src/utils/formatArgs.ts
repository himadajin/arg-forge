export const formatArgs = (args: any[]): string[] => {
  return args.reduce((acc: string[], arg) => {
    if (arg.option) {
      acc.push(arg.option);
      if (arg.value) acc.push(arg.value);
    } else if (arg.value) {
      acc.push(arg.value);
    }
    return acc;
  }, []);
};
