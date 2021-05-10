export interface GeniusResponse {
  meta: JSON;
  response: Hits;
}

export interface Hit {
  highlights: [];
  index: string;
  type: string;
  result: JSON;
}

export interface Hits {
  hits: Hit[]
}

// export declare type Hits = Hit[];
