export interface IItem {
    key: number;
    value: string | number;
    type: string;
  }
    
  export interface IAverageItem {
    index: number;
    value: string;
  }
    
  export interface IQuestion {
    question_text: string;
    type: string;
    responses: number[] | string[];
  }