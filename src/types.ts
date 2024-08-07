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
  region?: {
    _id: string;
    name: string;
  };
  site?: {
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
    code?: string;
    open?: number;
    modality?: string;
    description?: string;
    regionId: string;
    country: {
      name: string;
      code: string;
    };
    city?: string;
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

export interface Jam {
  _id?: string,
  title: string,
  open: boolean,
  public: boolean,
  sites: {
    _id: string,
    name: string,
    region: string
  }[],
  jammers: {
    _id: string,
    team: string,
    site: string,
    name: string,
    email: string
  }[],
  toolbox?: string,
  themes: {
    titlePT: string,
    titleES: string,
    titleEN: string,
    descriptionPT: string,
    descriptionES: string,
    descriptionEN: string,
    manualPT: string,
    manualES: string,
    manualEN: string
  }[],
  categories: {
    titlePT: string,
    titleES: string,
    titleEN: string,
    descriptionPT: string,
    descriptionES: string,
    descriptionEN: string,
    manualPT: string,
    manualES: string,
    manualEN: string
  }[],
  stages: {
    stageName: string,
    startDate: Date,
    endDate: Date,
    roles: {
      roleName: string
    }[]
  }[]
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
  teamName: string;
  teamCode: string;
  siteId: string;
  jamId: string;
  jammers: [{
    _id: string;
    name: string;
    email: string;
    discordUsername: string;
  }]
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
