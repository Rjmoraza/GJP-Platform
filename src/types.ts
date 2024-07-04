import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface Options {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  context?: HttpContext;
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | ReadonlyArray<string | number | boolean>;
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  transferCache?:
    | {
        includeHeaders?: string[];
      }
    | boolean;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  discordUsername: string;
  region: {
    _id: string;
    name: string;
  };
  site: {
    _id: string;
    name: string;
  };
  team?: {
    _id: string;
    name: string;
  };
  roles: string[];
  coins: number;
}

export interface Site {
    _id?: string;
    name: string;
    open?: number;
    modality?: string;
    region: {
      _id: string;
      name: string;
    };
    country: {
      name: string;
      code: string;
    };
}

export interface Region {
    _id?: string;
    name: string;
}

export interface Category {
  _id?: string;
  titleSP: string;
  titleEN: string;
  titlePT: string;
  descriptionSP: string;
  descriptionEN: string;
  descriptionPT: string;
  manualSP: File | null;
  manualEN: File | null;
  manualPT: File | null;
}


export interface Country {
  name: string;
  code: string;
}

export interface GameJam {
  _id?: string;
  edition: string;
  themes: {
    _id?: string;
    titleEN?: string;
  }[];
}

export interface Stage {
  _id?: string;
  name: string;
  startDate: Date;
  endDate: Date;
  startDateEvaluation: Date;
  endDateEvaluation: Date;
  gameJam: {
    _id: string;
    edition: string;
  };
}

export interface Team {
  _id?: string;
  studioName: string;
  description: Date;
  linkTree: string[];
  region: {
    _id: string;
    name: string;
  };
  site: {
    _id: string;
    name: string;
  };
  gameJam: {
    _id: string;
    edition: string;
  };
  jammers: {
    _id: string;
    name: string;
    email: string;
    discordUsername: string;
  }[];
}

export interface Theme {
  _id?: string;
  manualSP: File | null;
  manualEN: File | null;
  manualPT: File | null;
  descriptionSP: string;
  descriptionPT: string;
  descriptionEN: string;
  titleSP: string;
  titleEN: string;
  titlePT: string;
}

export interface Member {
    _id: string;
    name: string;
    email: string;
    discordUsername: string;
}

export interface Chat {
  _id: string;
  participants: {
    participantType: 'User' | 'Team';
    participantId?: string;
  }[];
  messagesList: {
    sender: string;
    senderType: 'User' | 'Team';
    message: string;
    sentDate: Date;
  }[];
}

export interface Submission {
  _id?: string;
  title: string;
  description: string;
  pitch: string;
  game: string;
  teamId: string;
  categoryId: string; 
  stageId?: string; 
  themeId: string;
  score: number;
  evaluators?: {
      userId?: string;
      name?: string;
      email?: string;
  }[];
}

export interface Rating {
  pitchScore?: Number;
  pitchFeedback?: String;
  gameDesignScore?: Number;
  gameDesignFeedback?: String;
  artScore?: Number;
  artFeedback?: String;
  buildScore?: Number;
  buildFeedback?: String;
  audioScore?: Number;
  audioFeedback?: String;
  generalFeedback?: String;
}