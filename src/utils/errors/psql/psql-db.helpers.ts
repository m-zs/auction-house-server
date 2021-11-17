export const getErrorData = (
  details: string,
): { name?: string; value?: string } => {
  const matches = details.match(/\(.*?\)/g)?.map((x) => x.replace(/[()]/g, ''));

  return {
    name: matches?.[0],
    value: matches?.[1],
  };
};
