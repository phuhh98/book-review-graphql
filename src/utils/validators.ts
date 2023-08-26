export const isJSON = (str: string | undefined): boolean => {
  try {
    return !!str && !!JSON.parse(str);
  } catch (e) {
    return false;
  }
};
