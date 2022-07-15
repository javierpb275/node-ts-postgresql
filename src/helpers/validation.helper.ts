export const validateObjectProperties = (
  someObject: any,
  allowedProperties: string[]
): boolean => {
  const objectProperties: string[] = Object.keys(someObject);
  const isValid: boolean = objectProperties.every((property) =>
    allowedProperties.includes(property)
  );
  return isValid;
};
