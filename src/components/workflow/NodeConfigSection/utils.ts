/**
 * Utility functions for NodeConfigSection
 */

export const getNestedValue = (obj: any, path: string[]): any => {
  let current = obj;
  for (const key of path) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return current;
};

export const shouldShowSchemas = (nodeType: string, subtype?: string): boolean => {
  const aiNodeTypes = ["hyperclova", "clova-ocr", "clova-studio", "papago", "custom-model"];
  const isAINode = aiNodeTypes.includes(nodeType);
  const isExcelReader = nodeType === "function" && subtype === "excel-read";
  return isAINode || isExcelReader;
};

export const capitalize = (str: string): string => {
  return str.replace(/([A-Z])/g, " $1").trim();
};

