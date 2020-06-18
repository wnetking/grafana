export type VariableType = 'query' | 'adhoc' | 'constant' | 'datasource' | 'interval' | 'textbox' | 'custom' | 'meta';

export interface VariableModel {
  type: VariableType;
  name: string;
  label: string | null;
}
