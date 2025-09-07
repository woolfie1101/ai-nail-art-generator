
export enum AppStatus {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}

export type IdleState = {
  status: AppStatus.IDLE;
};

export type LoadingState = {
  status: AppStatus.LOADING;
};

export type SuccessState = {
  status: AppStatus.SUCCESS;
  result: string;
};

export type ErrorState = {
  status: AppStatus.ERROR;
  error: string;
};

export type AppState = IdleState | LoadingState | SuccessState | ErrorState;

export interface ImageData {
    data: string;
    mimeType: string;
}
