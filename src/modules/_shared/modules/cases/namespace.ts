const baseCasesNamespace = 'cases';

export const buildCasesNamespace = (parentNamespace: string): string => {
  return `${parentNamespace}/${baseCasesNamespace}`;
};
